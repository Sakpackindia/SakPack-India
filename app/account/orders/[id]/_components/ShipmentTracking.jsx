"use client";

import { useEffect, useState } from "react";
import { Truck, ExternalLink, RadioTower } from "lucide-react";
import Reveal from "@/components/Reveal";

const POLL_INTERVAL_MS = 15000;

export default function ShipmentTracking({ orderId, trackingNumber, trackingUrl, courierName, cachedStatus }) {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  // Kept fresh by polling the DB, which the Shiprocket webhook writes to as
  // status updates arrive — this is what makes the page feel "live" without
  // re-calling Shiprocket's own tracking API on every tick.
  const [live, setLive] = useState(null);

  const activeCourier = live?.courier_name ?? courierName;
  const activeTrackingNumber = live?.tracking_number ?? trackingNumber;
  const activeTrackingUrl = live?.tracking_url ?? trackingUrl;
  const activeOrderStatus = live?.order_status;
  const isShiprocket = (activeCourier || "").toLowerCase().includes("shiprocket");
  const endpoint = isShiprocket ? "/api/shiprocket" : "/api/delhivery";
  const fallbackUrl = activeTrackingNumber
    ? isShiprocket
      ? `https://shiprocket.co/tracking/${activeTrackingNumber}`
      : `https://www.delhivery.com/track/package/${activeTrackingNumber}`
    : null;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "track_shipment", payload: { orderId } }),
        });
        const data = await res.json();
        if (!cancelled && data.success) setTracking(data.tracking);
      } catch {
        // Best-effort — the cached status below still shows.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Live polling — only meaningful for Shiprocket, since it's the only
  // courier with a webhook keeping the DB updated automatically. Stops once
  // the order reaches a final state so it doesn't poll forever.
  const isFinal = activeOrderStatus === "delivered" || activeOrderStatus === "cancelled";
  useEffect(() => {
    if (!isShiprocket || isFinal) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch("/api/shiprocket", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "get_status", payload: { orderId } }),
        });
        const data = await res.json();
        if (!cancelled && data.success) setLive(data.order);
      } catch {
        // Silent — next tick tries again.
      }
    };
    const id = setInterval(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [orderId, isShiprocket, isFinal]);

  const scans = tracking?.ShipmentData?.[0]?.Shipment?.Scans || [];
  const apiLiveStatus = tracking?.ShipmentData?.[0]?.Shipment?.Status?.Status;
  const displayStatus = live?.shipment_status || apiLiveStatus || cachedStatus;

  return (
    <Reveal delay={40} className="card-panel p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-gold-300">
          <Truck className="h-5 w-5" />
        </div>
        <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">Shipment Tracking</h2>
        {isShiprocket && !isFinal && (
          <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
            <RadioTower className="h-3.5 w-3.5 animate-pulse" /> Live
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 text-lg mb-4">
        <span className="text-ink/50">Courier:</span>
        <span className="text-ink font-medium">{activeCourier || "Delhivery"}</span>
        {activeTrackingNumber && (
          <>
            <span className="text-ink/20">|</span>
            <span className="text-ink/50">Tracking No:</span>
            <span className="text-ink font-mono select-all">{activeTrackingNumber}</span>
          </>
        )}
      </div>

      {(activeTrackingUrl || fallbackUrl) && (
        <a
          href={activeTrackingUrl || fallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-gold-400/30 bg-gold-400/5 px-4 py-2 text-base font-semibold uppercase tracking-wide text-gold-700 transition-all duration-300 hover:border-gold-400/60 hover:bg-gold-400/10"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Track on {isShiprocket ? "Shiprocket" : "Delhivery"}
        </a>
      )}

      {loading ? (
        <p className="border-t border-ink/10 pt-4 text-base text-ink/40">Fetching latest status…</p>
      ) : scans.length > 0 ? (
        <div className="space-y-2 border-t border-ink/10 pt-4">
          {scans.map((scan, i) => {
            const sd = scan.ScanDetail || {};
            return (
              <div key={i} className="flex flex-wrap justify-between gap-2 text-base text-ink/60">
                <span>{sd.Scan} {sd.ScannedLocation ? `at ${sd.ScannedLocation}` : ""}</span>
                <span className="text-ink/40">{sd.StatusDateTime ? new Date(sd.StatusDateTime).toLocaleString("en-IN") : ""}</span>
              </div>
            );
          })}
          {displayStatus && (
            <p className="pt-2 font-display text-lg font-semibold capitalize text-gold-700">{displayStatus}</p>
          )}
        </div>
      ) : (
        displayStatus && (
          <p className="border-t border-ink/10 pt-4 text-lg text-ink/60">
            Last known status: <span className="text-ink">{displayStatus}</span>
          </p>
        )
      )}
    </Reveal>
  );
}
