// ─── Email Integration (Nodemailer) ─────────────────────────────────────────
import nodemailer from 'nodemailer';

/**
 * Send an approval email via SMTP.
 * Gracefully skips if SMTP credentials are not configured.
 */
export async function sendApprovalEmail(campaign) {
  const host = process.env.EMAIL_SMTP_HOST;
  const port = process.env.EMAIL_SMTP_PORT;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  const to   = process.env.EMAIL_TO;

  if (!host || !user || !pass) {
    console.log('ℹ️  Email integration skipped (SMTP not configured)');
    return null;
  }

  const transporter = nodemailer.createTransport({
    host,
    port: Number(port) || 587,
    secure: Number(port) === 465,
    auth: { user, pass },
  });

  const budget = campaign.finalBudget || campaign.budget;

  const mailOptions = {
    from: `"CampaignOS" <${user}>`,
    to:   to || user,
    subject: `✅ Campaign Approved: ${campaign.name}`,
    html: `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); padding: 24px 32px;">
          <h1 style="margin: 0; font-size: 22px; color: #ffffff;">🚀 Campaign Approved</h1>
        </div>
        <div style="padding: 24px 32px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8;">Campaign</td><td style="padding: 8px 0; font-weight: 600;">${campaign.name}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Product</td><td style="padding: 8px 0;">${campaign.product || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Audience</td><td style="padding: 8px 0;">${campaign.audience || 'N/A'}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Final Budget</td><td style="padding: 8px 0; font-weight: 600; color: #3b82f6;">₹${budget.toLocaleString()}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Duration</td><td style="padding: 8px 0;">${campaign.startDate || '—'} to ${campaign.endDate || '—'}</td></tr>
          </table>
          ${campaign.explanation ? `<div style="margin-top: 16px; padding: 16px; background: #1e293b; border-radius: 8px; font-size: 14px; white-space: pre-line;">${campaign.explanation}</div>` : ''}
        </div>
        <div style="padding: 16px 32px; background: #1e293b; text-align: center; font-size: 12px; color: #64748b;">
          Sent by CampaignOS – AI Marketing Decision System
        </div>
      </div>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('📧  Approval email sent:', info.messageId);
  return info;
}
