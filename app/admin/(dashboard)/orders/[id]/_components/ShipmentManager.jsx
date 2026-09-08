"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Truck, RefreshCw, PackageCheck, ExternalLink, X, RadioTower } from "lucide-react";

const POLL_INTERVAL_MS = 15000;

const inputClass =
  "w-full rounded-xl border border-gold-400/20 bg-ivory-deep/60 px-4 py-3 text-base sm:text-lg font-bold text-ink transition-colors duration-300 focus:border-gold-400/40 focus:outline-none focus:ring-2 focus:ring-gold-400/20 hover:border-gold-400/30";
const labelClass = "mb-1.5 block text-xs sm:text-sm font-extrabold uppercase tracking-wider text-ink/60";

const COURIERS = {
  shiprocket: { label: "Shiprocket", endpoint: "/api/shiprocket", trackFallback: (n) => `https://shiprocket.co/tracking/${n}` },
};

async function postJson(endpoint, body) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

function CreateShipmentModal({ order, courierKey, onClose, onBooked }) {
  const courier = COURIERS[courierKey];
  const [weightGrams, setWeightGrams] = useState(200);
  const [lengthCm, setLengthCm] = useState(12);
  const [widthCm, setWidthCm] = useState(9);
  const [heightCm, setHeightCm] = useState(6);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const handleConfirm = async () => {
    setBusy(true);
    setError(null);
    const result = await postJson(courier.endpoint, {
      action: "create_shipment",
      payload: {
        orderId: order.id,
        weightGrams: Number(weightGrams),
        lengthCm: Number(lengthCm),
        widthCm: Number(widthCm),
        heightCm: Number(heightCm),
      },
    });
    setBusy(false);
    if (!result.success) return setError(result.error || "Booking failed.");
    onBooked();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[2rem] border border-gold-400/25 bg-gradient-to-b bg-white/95 p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-gold-600" />
            <h3 className="font-display text-lg text-ink">Ship via {courier.label}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-ink/40 hover:bg-ink hover:text-ivory"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-5 text-base text-ink/50">
          Order <span className="text-ink">{order.order_number}</span> will be booked with {courier.label} using these package details.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Weight (g)</label>
            <input type="number" value={weightGrams} onChange={(e) => setWeightGrams(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Length (cm)</label>
            <input type="number" value={lengthCm} onChange={(e) => setLengthCm(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Width (cm)</label>
            <input type="number" value={widthCm} onChange={(e) => setWidthCm(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Height (cm)</label>
            <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={inputClass} />
          </div>
        </div>

        {error && <p className="mt-4 text-base text-red-400">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="flex-1 whitespace-nowrap rounded-xl border border-gold-400/25 bg-ivory-deep/60 px-4 py-3 text-sm sm:text-base font-semibold uppercase tracking-wide text-ink/60 hover:text-ink disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy}
            className="btn-gold flex-1 whitespace-nowrap px-4 py-3 text-sm sm:text-base font-semibold uppercase tracking-wide disabled:opacity-60"
          >
            {busy ? "Booking…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ShipmentManager({ order }) {
  const router = useRouter();
  const [modalCourier, setModalCourier] = useState(null);
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [tracking, setTracking] = useState(null);
  // Kept fresh by polling the DB, which the Shiprocket webhook writes to as
  // status updates arrive — mirrors the customer-facing ShipmentTracking
  // component so admin sees the same live status without manually refreshing.
  const [live, setLive] = useState(null);

  const isBooked = Boolean(order.tracking_number || order.shiprocket_order_id);
  const activeCourier = COURIERS.shiprocket;

  const activeCourierName = live?.courier_name ?? order.courier_name;
  const activeTrackingNumber = live?.tracking_number ?? order.tracking_number;
  const activeTrackingUrl = live?.tracking_url ?? order.tracking_url;
  const activeShipmentStatus = live?.shipment_status ?? order.shipment_status;
  const activeOrderStatus = live?.order_status ?? order.order_status;
  const isFinal = activeOrderStatus === "delivered" || activeOrderStatus === "cancelled";

  useEffect(() => {
    if (!isBooked || isFinal) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const result = await postJson(activeCourier.endpoint, { action: "get_status", payload: { orderId: order.id } });
        if (!cancelled && result.success) setLive(result.order);
      } catch {
        // Silent — next tick tries again.
      }
    };
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [order.id, isBooked, isFinal, activeCourier.endpoint]);

  const handleTrackNow = async () => {
    setBusy("track");
    setError(null);
    const result = await postJson(activeCourier.endpoint, { action: "track_shipment", payload: { orderId: order.id } });
    setBusy(null);
    if (!result.success) return setError(result.error || "Tracking lookup failed.");
    setTracking(result.tracking);
    router.refresh();
  };

  const scans = tracking?.ShipmentData?.[0]?.Shipment?.Scans || [];
  const liveStatus = tracking?.ShipmentData?.[0]?.Shipment?.Status?.Status;

  if (isBooked) {
    return (
      <div className="mt-5 border-t border-gold-400/20 pt-5 space-y-3">
        <div className="flex items-center gap-2">
          <PackageCheck className="h-4 w-4 text-gold-600" />
          <h3 className="text-base font-semibold uppercase tracking-wide text-ink/40">Shipment</h3>
          {!isFinal && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <RadioTower className="h-3.5 w-3.5 animate-pulse" /> Live
            </span>
          )}
        </div>
        <div className="text-base text-ink/70">
          <span className="text-ink/40">Courier:</span> {activeCourierName || activeCourier.label}
        </div>
        <div className="text-base">
          <span className="text-ink/40">Waybill:</span>{" "}
          <span className="font-mono text-ink select-all">{activeTrackingNumber || "Awaiting AWB assignment"}</span>
        </div>
        {activeShipmentStatus && (
          <div className="text-base text-ink/70">
            <span className="text-ink/40">Last Status:</span> {activeShipmentStatus}
          </div>
        )}

        {error && <p className="text-base text-red-400">{error}</p>}

        <div className="grid grid-cols-2 gap-2 pt-1">
          {activeTrackingNumber && (
            <a
              href={activeTrackingUrl || activeCourier.trackFallback(activeTrackingNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-gold-400/25 bg-gold-400/5 px-3 py-2 text-center text-base font-semibold text-gold-700 hover:border-gold-300/40 hover:bg-gold-400/10"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" /> Track
            </a>
          )}
          <button
            type="button"
            onClick={handleTrackNow}
            disabled={busy === "track"}
            className={`inline-flex items-center justify-center gap-1.5 rounded-xl border border-gold-400/25 bg-gold-400/5 px-3 py-2 text-center text-base font-semibold text-gold-700 hover:border-gold-300/40 hover:bg-gold-400/10 disabled:opacity-50 ${!activeTrackingNumber ? "col-span-2" : ""}`}
          >
            <RefreshCw className={`h-3.5 w-3.5 shrink-0 ${busy === "track" ? "animate-spin" : ""}`} /> {busy === "track" ? "Checking…" : "Refresh"}
          </button>
        </div>

        {scans.length > 0 && (
          <div className="mt-3 space-y-3 rounded-xl border border-gold-400/20 bg-ivory-deep/60 p-3 text-base">
            {liveStatus && (
              <p className="flex items-center justify-between border-b border-gold-400/20 pb-2 font-semibold capitalize text-gold-600">
                <span>Current Status</span>
                <span>{liveStatus}</span>
              </p>
            )}
            <div className="space-y-2.5">
              {scans.map((scan, i) => {
                const sd = scan.ScanDetail || {};
                return (
                  <div key={i} className="text-ink/60">
                    <p className="text-ink/80">
                      {sd.Scan}
                      {sd.ScannedLocation && <span className="text-ink/50"> — {sd.ScannedLocation}</span>}
                    </p>
                    {sd.StatusDateTime && (
                      <p className="mt-0.5 text-base text-ink/35">
                        {new Date(sd.StatusDateTime).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-5 border-t border-gold-400/20 pt-5">
      <div className="mb-3 flex items-center gap-2">
        <Truck className="h-4 w-4 text-gold-600" />
        <h3 className="text-base font-semibold uppercase tracking-wide text-ink/40">Shipment</h3>
      </div>
      <button
        type="button"
        onClick={() => setModalCourier("shiprocket")}
        className="btn-gold w-full px-4 py-2.5 text-sm sm:text-base font-semibold uppercase tracking-wide"
      >
        Ship via Shiprocket
      </button>

      {modalCourier && (
        <CreateShipmentModal
          order={order}
          courierKey={modalCourier}
          onClose={() => setModalCourier(null)}
          onBooked={() => {
            setModalCourier(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
