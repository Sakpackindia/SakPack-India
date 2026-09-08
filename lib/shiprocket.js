// Shiprocket courier-aggregator integration. Shiprocket sits on top of many
// couriers and assigns one automatically, unlike Delhivery's single-courier
// API — so instead of a waybill you get an order/shipment id first, and an
// AWB code + assigned courier once Shiprocket books it with a courier.

const AUTH_URL = "https://apiv2.shiprocket.in/v1/external/auth/login";
const API_BASE = "https://apiv2.shiprocket.in/v1/external";

async function fetchWithTimeout(resource, options = {}) {
  const { timeout = 8000 } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    return await fetch(resource, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

// Shiprocket tokens are valid ~10 days; cached in-memory per server instance
// so we don't re-authenticate on every request.
let cachedToken = null;
let cachedTokenExpiry = 0;

async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;
  if (!email) throw new Error("Shiprocket is not configured — SHIPROCKET_EMAIL is missing.");
  if (!password) throw new Error("Shiprocket is not configured — SHIPROCKET_PASSWORD is missing.");

  if (cachedToken && Date.now() < cachedTokenExpiry) return cachedToken;

  const response = await fetchWithTimeout(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.token) {
    throw new Error(data?.message || "Shiprocket authentication failed.");
  }

  cachedToken = data.token;
  cachedTokenExpiry = Date.now() + 9 * 24 * 60 * 60 * 1000; // refresh a day early
  return cachedToken;
}

// POST /orders/create/adhoc — books an order with Shiprocket. `order` needs
// { order_number, payment_method, subtotal }, `address` needs { full_name,
// address_line_1, address_line_2, city, state, postal_code, phone }, and
// `orderItems` needs [{ product_name, quantity, line_total }].
export async function createShipment({ order, address, orderItems, weightKg, lengthCm, widthCm, heightCm }) {
  const token = await getShiprocketToken();
  const pickupLocation = process.env.SHIPROCKET_PICKUP_LOCATION;
  if (!pickupLocation) throw new Error("Shiprocket is not configured — SHIPROCKET_PICKUP_LOCATION is missing.");

  const isCod = order.payment_method === "COD";
  const orderDate = new Date().toISOString().slice(0, 16).replace("T", " ");

  const payload = {
    order_id: order.order_number,
    order_date: orderDate,
    pickup_location: pickupLocation,
    comment: `Sakpack order ${order.order_number}`,
    billing_customer_name: address.full_name || "Customer",
    billing_last_name: "",
    billing_address: address.address_line_1,
    billing_address_2: address.address_line_2 || "",
    billing_city: address.city,
    billing_pincode: address.postal_code,
    billing_state: address.state,
    billing_country: "India",
    billing_email: address.email || "orders@sakpack.com",
    billing_phone: address.phone || "9999999999",
    shipping_is_billing: true,
    order_items: (orderItems || []).map((item) => ({
      name: item.product_name,
      sku: item.product_name,
      units: item.quantity,
      selling_price: item.quantity ? Number(item.line_total) / item.quantity : Number(item.line_total),
    })),
    payment_method: isCod ? "COD" : "Prepaid",
    sub_total: Number(order.subtotal),
    length: lengthCm,
    breadth: widthCm,
    height: heightCm,
    weight: weightKg,
  };

  const response = await fetchWithTimeout(`${API_BASE}/orders/create/adhoc`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.shipment_id) {
    const errorMsg =
      (data?.errors && typeof data.errors === "object" ? Object.values(data.errors).flat().join(", ") : null) ||
      data?.message ||
      "Failed to create Shiprocket shipment.";
    throw new Error(errorMsg);
  }

  return {
    shiprocketOrderId: data.order_id ? String(data.order_id) : null,
    shipmentId: data.shipment_id ? String(data.shipment_id) : null,
    awbCode: data.awb_code || null,
    trackingUrl: data.awb_code ? `https://shiprocket.co/tracking/${data.awb_code}` : null,
    raw: data,
  };
}

// GET /courier/track/awb/:awb — live scan history once an AWB is assigned.
// Normalized to the same { ShipmentData: [{ Shipment: { Status, Scans } }] }
// shape used by lib/delhivery.js so the admin/customer UI can render either
// courier's tracking data with one code path.
export async function trackShipmentByAwb(awbCode) {
  const token = await getShiprocketToken();
  const response = await fetchWithTimeout(`${API_BASE}/courier/track/awb/${encodeURIComponent(awbCode)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || "Shiprocket tracking API call failed.");

  const trackData = data?.tracking_data || Object.values(data || {})[0]?.tracking_data;
  const activities = trackData?.shipment_track_activities || [];

  return {
    ShipmentData: [
      {
        Shipment: {
          Status: { Status: trackData?.current_status || trackData?.shipment_status || null },
          Scans: activities.map((a) => ({
            ScanDetail: { Scan: a.activity, ScannedLocation: a.location, StatusDateTime: a.date },
          })),
        },
      },
    ],
  };
}

// GET /orders/show/:id — used when we don't have an AWB yet, to check
// whether Shiprocket has since assigned a courier + AWB to this order.
export async function getOrderDetails(shiprocketOrderId) {
  const token = await getShiprocketToken();
  const response = await fetchWithTimeout(`${API_BASE}/orders/show/${encodeURIComponent(shiprocketOrderId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.message || "Shiprocket order lookup failed.");
  return data;
}
