import type { APIRoute } from 'astro';

export const prerender = false;

const VALID_PRODUCTS = new Set(['doooo-app', 'doooo-hub', 'prodect']);

interface NotifyPayload {
  email: string;
  product: string;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length < 254;
}

async function forwardToResend(email: string, product: string): Promise<void> {
  const env = import.meta.env;
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) return;

  // Taq + Taq Hub signups share one topic. Prodect has its own.
  // Topics live inside Resend's single default audience.
  const topicMap: Record<string, string | undefined> = {
    'doooo-app': env.RESEND_TOPIC_DOOOO,
    'doooo-hub': env.RESEND_TOPIC_DOOOO,
    'prodect': env.RESEND_TOPIC_PRODECT,
  };

  const topicId = topicMap[product];
  if (!topicId) return;

  const response = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      unsubscribed: false,
      topics: [{ id: topicId, subscription: 'opt_in' }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend ${response.status}: ${body}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  let payload: NotifyPayload;
  try {
    payload = (await request.json()) as NotifyPayload;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const product = typeof payload.product === 'string' ? payload.product : '';

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!VALID_PRODUCTS.has(product)) {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_product' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    await forwardToResend(email, product);
  } catch (err) {
    console.error('[notify] forwardToResend failed', err);
    return new Response(JSON.stringify({ ok: false, error: 'forward_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('[notify] signup', { product, email });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
