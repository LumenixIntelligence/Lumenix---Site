export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, dealership, phone, email, challenge } = req.body;

  if (!name || !phone || !email) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Lumenix Intelligence <notifications@lumenixintelligence.com>',
        to: ['juan@lumenixintelligence.com'],
        subject: `New Demo Request — ${name} | ${dealership}`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#04060F;color:#E8F4FF;padding:32px;border-radius:8px;">
            <h2 style="color:#00B4FF;margin-bottom:24px;font-size:20px;">New Demo Request</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#7A95B8;width:140px;">Name</td><td style="padding:8px 0;color:#E8F4FF;font-weight:bold;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#7A95B8;">Dealership</td><td style="padding:8px 0;color:#E8F4FF;font-weight:bold;">${dealership}</td></tr>
              <tr><td style="padding:8px 0;color:#7A95B8;">Phone</td><td style="padding:8px 0;color:#E8F4FF;">${phone}</td></tr>
              <tr><td style="padding:8px 0;color:#7A95B8;">Email</td><td style="padding:8px 0;color:#E8F4FF;">${email}</td></tr>
              <tr><td style="padding:8px 0;color:#7A95B8;">Challenge</td><td style="padding:8px 0;color:#E8F4FF;">${challenge || 'Not specified'}</td></tr>
            </table>
            <div style="margin-top:24px;padding:16px;background:#0C1020;border-left:3px solid #00B4FF;border-radius:4px;">
              <p style="margin:0;color:#00B4FF;font-size:14px;">Respond within the next hour for best results.</p>
            </div>
            <p style="margin-top:24px;color:#3D5470;font-size:12px;">Lumenix Intelligence LLC — lumenixintelligence.com</p>
          </div>
        `
      })
    });

    if (emailRes.ok) {
      return res.status(200).json({ success: true });
    }

    const errText = await emailRes.text();
    console.error('Resend error:', errText);
    return res.status(500).json({ error: 'Email failed', details: errText });

  } catch (err) {
    console.error('Server error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
