import { NextResponse } from "next/server";
import { processPayuResult } from "@/lib/payuFulfillment";

export async function POST(req) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    const formData = await req.formData();
    const fields = Object.fromEntries(formData.entries());

    const result = await processPayuResult(fields);
    if (!result.ok) {
      console.error("[PayU Callback Error]:", result.reason, result.txnid || "");
      return NextResponse.redirect(`${siteUrl}/checkout/complete?order=unknown`, { status: 303 });
    }

    return NextResponse.redirect(`${siteUrl}/checkout/complete?order=${encodeURIComponent(result.orderNumber)}`, { status: 303 });
  } catch (error) {
    console.error("[PayU Callback Critical Error]:", error);
    return NextResponse.redirect(`${siteUrl}/checkout/complete?order=unknown`, { status: 303 });
  }
}
