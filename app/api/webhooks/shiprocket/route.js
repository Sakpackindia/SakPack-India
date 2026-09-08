import { createAdminClient } from "@/lib/supabase/admin";

// Shiprocket pushes order/shipment status changes here as they happen, so
// the order-detail pages can reflect live status without anyone manually
// clicking "Refresh". Register this URL (https://<domain>/api/webhooks/shiprocket)
// in the Shiprocket dashboard's webhook settings, with SHIPROCKET_WEBHOOK_SECRET
// pasted as the token — Shiprocket's "Auth Token Type" dropdown there picks
// which header it arrives in (we accept either "Authorization" or
// "x-api-key" so either dropdown choice works without a code change).

export async function GET() {
  return Response.json({ status: "active" });
}

function normalizeOrderStatus(rawStatus) {
  const s = (rawStatus || "").toLowerCase();
  if (s.includes("delivered")) return "delivered";
  if (s.includes("cancel")) return "cancelled";
  if (
    s.includes("transit") ||
    s.includes("shipped") ||
    s.includes("dispatch") ||
    s.includes("out for delivery") ||
    s.includes("picked") ||
    s.includes("pickup")
  ) {
    return "shipped";
  }
  return null;
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
  }

  // Shiprocket's own "Test Webhook" button in the dashboard sends a payload
  // with none of these identifiers — let that through without a secret check
  // so the test button works, same as it does with no order to update.
  const shiprocketOrderId = payload.order_id ? String(payload.order_id) : null;
  const shiprocketShipmentId = payload.shipment_id ? String(payload.shipment_id) : null;
  const awbCode = payload.awb || payload.awb_code || null;
  const isTestPing = !shiprocketOrderId && !shiprocketShipmentId && !awbCode;

  if (!isTestPing) {
    const expectedKey = process.env.SHIPROCKET_WEBHOOK_SECRET;
    const authHeader = request.headers.get("authorization") || "";
    const providedKey = request.headers.get("x-api-key") || authHeader.replace(/^Bearer\s+/i, "");
    if (!expectedKey || providedKey !== expectedKey) {
      return Response.json({ success: false, error: "Invalid or missing webhook secret." }, { status: 401 });
    }
  }

  if (isTestPing) {
    return Response.json({ success: true, message: "Test ping received." });
  }

  const admin = createAdminClient();

  let query = admin.from("orders").select("id, tracking_number").limit(1);
  if (shiprocketOrderId) query = query.eq("shiprocket_order_id", shiprocketOrderId);
  else query = query.eq("shiprocket_shipment_id", shiprocketShipmentId);

  const { data: order } = await query.maybeSingle();
  if (!order) return Response.json({ success: false, error: "Matching order not found." }, { status: 404 });

  const currentStatus = payload.current_status || payload.shipment_status || payload.status || null;
  const courierName = payload.courier_name || null;
  const orderStatus = normalizeOrderStatus(currentStatus);

  const update = { updated_at: new Date().toISOString() };
  if (currentStatus) update.shipment_status = currentStatus;
  if (orderStatus) update.order_status = orderStatus;
  if (awbCode && !order.tracking_number) {
    update.tracking_number = awbCode;
    update.tracking_url = `https://shiprocket.co/tracking/${awbCode}`;
  }
  if (courierName) update.courier_name = `Shiprocket (${courierName})`;

  await admin.from("orders").update(update).eq("id", order.id);

  return Response.json({ success: true });
}
