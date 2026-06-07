import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "STRIPE_SECRET_KEY not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" });

    const results: { serviceId: string; productId: string; priceId: string }[] = [];

    // Website Copy Pack
    const websiteProduct = await stripe.products.create({
      name: "Website Copy Starter Pack",
      description: "Professional website copy written in your voice, aligned with your services, and ready to paste into any website builder.",
    });
    const websitePrice = await stripe.prices.create({
      product: websiteProduct.id,
      unit_amount: 4900,
      currency: "gbp",
    });
    results.push({
      serviceId: "website_copy_pack",
      productId: websiteProduct.id,
      priceId: websitePrice.id,
    });

    // Social Media Pack
    const socialProduct = await stripe.products.create({
      name: "Social Media Starter Pack",
      description: "30 done-for-you posts tailored to your industry, audience, and offer.",
    });
    const socialPrice = await stripe.prices.create({
      product: socialProduct.id,
      unit_amount: 12000,
      currency: "gbp",
    });
    results.push({
      serviceId: "social_media_pack",
      productId: socialProduct.id,
      priceId: socialPrice.id,
    });

    // Quarterly Refresh (subscription)
    const refreshProduct = await stripe.products.create({
      name: "Quarterly Document Refresh",
      description: "Keep your documents accurate as your business evolves. Recurring billing every 4 months.",
    });
    const refreshPrice = await stripe.prices.create({
      product: refreshProduct.id,
      unit_amount: 2900,
      currency: "gbp",
      recurring: { interval: "month", interval_count: 4 },
    });
    results.push({
      serviceId: "quarterly_refresh",
      productId: refreshProduct.id,
      priceId: refreshPrice.id,
    });

    return new Response(JSON.stringify({ results, message: "Update service-catalog.ts with these IDs" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Stripe setup error:", err);
    return new Response(JSON.stringify({ error: err.message || "Setup failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
