import { Resend } from 'resend';

const resend = new Resend("re_gCbPs73m_4iyLc37P6T1wq8SPVubTiW1Y");

export async function POST(req) {
  const { to, subject, html } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'YourApp <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
