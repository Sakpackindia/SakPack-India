"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitInquiry(_prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const message = formData.get("message");

  if (!name || !message) {
    return { error: "Please share your name and a short message." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({
    name,
    email: email || null,
    phone: phone || null,
    message,
  });

  if (error) return { error: "Something went wrong. Please try WhatsApp instead." };

  return { success: true };
}

export async function subscribeNewsletter(_prevState, formData) {
  const email = formData.get("email");
  if (!email) return { error: "Please enter your email." };

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  // A unique-constraint violation just means they're already subscribed —
  // treat that as success instead of showing an error.
  if (error && error.code !== "23505") return { error: "Something went wrong. Please try again." };

  return { success: true };
}
