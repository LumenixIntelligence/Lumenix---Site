export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, business, phone, source, lang } = req.body || {};

  if (!name || !business || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Lumenix Leads <leads@lumenixintelligence.com>',
        to: ['juan@lumenixintelligence.com'],
        subject: `Nuevo lead — ${source || 'sitio web'}: ${business}`,
        text: [
          `Nombre: ${name}`,
          `Negocio: ${business}`,
          `Teléfono: ${phone}`,
          `Página: ${source || 'desconocida'}`,
          `Idioma: ${lang || 'desconocido'}`,
        ].join('\n'),
      }),
    });

    if (!resendRes.ok) {
      const errText = await resendRes.text();
      console.error('Resend error:', errText);
      return res.status(502).json({ error: 'Email send failed' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('submit-lead error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}
