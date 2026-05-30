import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

function validate(data: Record<string, unknown>) {
  const errors: string[] = []
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2)
    errors.push('Name is required')
  if (!data.email || typeof data.email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.push('Valid email is required')
  if (!data.message || typeof data.message !== 'string')
    errors.push('Message is required')
  return errors
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const errors = validate(body)
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(', ') }, { status: 400 })
    }

    const { name, email, subject, message } = body

    // Instantiate lazily so build doesn't fail without the env var
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: 'Portfolio Contact <noreply@bradreardon.studio>',
      to: 'brad@bradreardon.studio',
      replyTo: email,
      subject: `[Portfolio] ${subject || 'New message'} — from ${name}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; color: #1a1a1a;">
          <h2 style="font-size: 20px; font-weight: normal; margin-bottom: 24px;">
            New message from <em>${name}</em>
          </h2>
          <p style="color: #888; font-size: 13px; margin-bottom: 4px;">From</p>
          <p style="margin-bottom: 20px;">${name} &lt;${email}&gt;</p>
          ${subject ? `<p style="color: #888; font-size: 13px; margin-bottom: 4px;">Subject</p>
          <p style="margin-bottom: 20px;">${subject}</p>` : ''}
          <p style="color: #888; font-size: 13px; margin-bottom: 4px;">Message</p>
          <p style="white-space: pre-wrap; line-height: 1.7;">${message}</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 32px 0;" />
          <p style="font-size: 12px; color: #bbb;">Sent via your portfolio contact form</p>
        </div>
      `,
    })

    await resend.emails.send({
      from: 'Brad Reardon <brad@bradreardon.studio>',
      to: email,
      subject: 'Thanks for reaching out',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; color: #1a1a1a;">
          <p>Hi ${name},</p>
          <p>Thank you for your message. I'll be in touch within 48 hours.</p>
          <p style="font-style: italic; color: #888;">— Brad</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })

  } catch (err) {
    console.error('[Contact API]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
