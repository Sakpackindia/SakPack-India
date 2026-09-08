import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createShipment, trackShipmentByAwb, getOrderDetails } from "@/lib/shiprocket";
import { DEFAULT_PACKAGE } from "@/lib/constants";
import { cookies } from "next/headers";
import { verifyAdminSessionToken, COOKIE_NAME as ADMIN_COOKIE_NAME } from "@/lib/adminSession";

async function getAuth() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (adminToken) {
    const adminSession = await verifyAdminSessionToken(adminToken);
    if (adminSession) {
      return { user: { id: "admin", email: adminSession.email }, isAdmin: true };
    }
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isAdmin: false };

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  return { user, isAdmin: profile?.role === "admin" };
}

async function loadOrderForShipping(orderId) {
  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select(
      `id, order_number, user_id, subtotal, payment_method, tracking_number, shiprocket_order_id, shiprocket_shipment_id,
       addresses ( full_name, phone, address_line_1, address_line_2, city, state, postal_code ),
       order_items ( product_name, quantity, line_total, product_variants ( weight_grams ) )`
    )
    .eq("id", orderId)
    .maybeSingle();
  return order;
}

function estimateWeightGrams(order) {
  const itemsWeight = (order.order_items || []).reduce((sum, item) => {
    const unitWeight = item.product_variants?.weight_grams || DEFAULT_PACKAGE.itemWeightGrams;
    return sum + unitWeight * item.quantity;
  }, 0);
  return itemsWeight + DEFAULT_PACKAGE.packagingOverheadGrams;
}

export async function POST(request) {
  const { action, payload } = (await request.json()) || {};
  if (!action) return Response.json({ success: false, error: "action is required." }, { status: 400 });

  try {
    const { user, isAdmin } = await getAuth();
    if (!user) return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });

    // Cheap DB-only read for polling — no Shiprocket API call. The webhook
    // (app/api/webhooks/shiprocket/route.js) is what keeps these columns
    // fresh in near-real-time; this just reads back whatever it last wrote,
    // so the order page can reflect status changes without a page reload.
    if (action === "get_status") {
      const { orderId } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      const admin = createAdminClient();
      let query = admin
        .from("orders")
        .select("id, user_id, order_status, shipment_status, tracking_number, tracking_url, courier_name, shiprocket_order_id")
        .eq("id", orderId);
      if (!isAdmin) query = query.eq("user_id", user.id);
      const { data: order } = await query.maybeSingle();

      if (!order) return Response.json({ success: false, error: "Order not found." }, { status: 404 });
      return Response.json({ success: true, order });
    }

    if (action === "create_shipment") {
      if (!isAdmin) return Response.json({ success: false, error: "Forbidden" }, { status: 403 });

      const { orderId, weightGrams, lengthCm, widthCm, heightCm } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      const order = await loadOrderForShipping(orderId);
      if (!order) return Response.json({ success: false, error: "Order not found." }, { status: 404 });
      if (order.tracking_number || order.shiprocket_order_id) {
        return Response.json({ success: false, error: "This order is already booked with a courier." }, { status: 400 });
      }
      if (!order.addresses) return Response.json({ success: false, error: "Order has no shipping address." }, { status: 400 });

      const weight = weightGrams || estimateWeightGrams(order);
      const result = await createShipment({
        order,
        address: order.addresses,
        orderItems: order.order_items,
        weightKg: weight / 1000,
        lengthCm: lengthCm || DEFAULT_PACKAGE.lengthCm,
        widthCm: widthCm || DEFAULT_PACKAGE.breadthCm,
        heightCm: heightCm || DEFAULT_PACKAGE.heightCm,
      });

      const admin = createAdminClient();
      await admin
        .from("orders")
        .update({
          shiprocket_order_id: result.shiprocketOrderId,
          shiprocket_shipment_id: result.shipmentId,
          tracking_number: result.awbCode,
          tracking_url: result.trackingUrl,
          courier_name: "Shiprocket",
          order_status: "shipped",
          shipped_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return Response.json({ success: true, awbCode: result.awbCode, trackingUrl: result.trackingUrl });
    }

    if (action === "track_shipment") {
      const admin = createAdminClient();
      const { orderId } = payload || {};
      if (!orderId) return Response.json({ success: false, error: "orderId is required." }, { status: 400 });

      let query = admin
        .from("orders")
        .select("id, user_id, tracking_number, shiprocket_order_id, shiprocket_shipment_id")
        .eq("id", orderId);
      if (!isAdmin) query = query.eq("user_id", user.id);
      const { data: order } = await query.maybeSingle();

      if (!order) return Response.json({ success: false, error: "Order not found." }, { status: 404 });
      if (!order.shiprocket_order_id) {
        return Response.json({ success: false, error: "This order hasn't shipped yet." }, { status: 404 });
      }

      let awbCode = order.tracking_number;
      let courierName = null;

      // No AWB yet — check if Shiprocket has since assigned a courier.
      if (!awbCode) {
        const details = await getOrderDetails(order.shiprocket_order_id);
        const shipment = details?.data?.shipments?.[0] || details?.data;
        awbCode = shipment?.awb || shipment?.awb_code || null;
        courierName = shipment?.courier_name || null;

        if (awbCode) {
          await admin
            .from("orders")
            .update({
              tracking_number: awbCode,
              tracking_url: `https://shiprocket.co/tracking/${awbCode}`,
              courier_name: courierName ? `Shiprocket (${courierName})` : "Shiprocket",
            })
            .eq("id", orderId);
        } else {
          return Response.json({
            success: true,
            tracking: { ShipmentData: [{ Shipment: { Status: { Status: "Awaiting courier assignment" }, Scans: [] } }] },
          });
        }
      }

      const data = await trackShipmentByAwb(awbCode);
      const status = data?.ShipmentData?.[0]?.Shipment?.Status?.Status;

      if (status) {
        await admin
          .from("orders")
          .update({
            shipment_status: status,
            order_status: status.toLowerCase() === "delivered" ? "delivered" : undefined,
          })
          .eq("id", orderId);
      }

      return Response.json({ success: true, tracking: data });
    }

    return Response.json({ success: false, error: "Invalid action type." }, { status: 400 });
  } catch (err) {
    return Response.json({ success: false, error: err.message }, { status: 502 });
  }
}
