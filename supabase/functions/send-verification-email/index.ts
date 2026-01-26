import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  confirmationUrl: string;
  type: 'signup' | 'recovery' | 'email_change';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, confirmationUrl, type }: EmailRequest = await req.json();

    // Validate required fields
    if (!email || !confirmationUrl) {
      throw new Error("Missing required fields: email and confirmationUrl");
    }

    let subject = "";
    let htmlContent = "";

    switch (type) {
      case 'signup':
        subject = "Welcome to KOLs3 - Verify Your Email";
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto; background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">KOLs3</h1>
                        <p style="margin: 8px 0 0; font-size: 14px; color: #888888;">Web3 Creator Marketplace</p>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 20px 40px 40px;">
                        <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #ffffff; text-align: center;">Welcome aboard! 🚀</h2>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #cccccc; text-align: center;">
                          Thanks for joining KOLs3. Click the button below to verify your email and access your dashboard.
                        </p>
                        
                        <!-- CTA Button -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: center; padding: 8px 0 24px;">
                              <a href="${confirmationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                                Verify Email Address
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0; font-size: 14px; color: #888888; text-align: center;">
                          If you didn't create an account, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 20px 40px; background-color: #141414; border-top: 1px solid #333;">
                        <p style="margin: 0; font-size: 12px; color: #666666; text-align: center;">
                          © 2025 KOLs3. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;
        break;

      case 'recovery':
        subject = "Reset Your KOLs3 Password";
        htmlContent = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0a;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto; background-color: #1a1a1a; border-radius: 16px; overflow: hidden;">
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: bold; color: #ffffff;">KOLs3</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px 40px;">
                        <h2 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: #ffffff; text-align: center;">Reset Your Password</h2>
                        <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #cccccc; text-align: center;">
                          Click the button below to reset your password. This link expires in 1 hour.
                        </p>
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: center; padding: 8px 0 24px;">
                              <a href="${confirmationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 8px;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        <p style="margin: 0; font-size: 14px; color: #888888; text-align: center;">
                          If you didn't request this, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 20px 40px; background-color: #141414; border-top: 1px solid #333;">
                        <p style="margin: 0; font-size: 12px; color: #666666; text-align: center;">
                          © 2025 KOLs3. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;
        break;

      default:
        subject = "KOLs3 - Email Verification";
        htmlContent = `
          <p>Please verify your email by clicking <a href="${confirmationUrl}">this link</a>.</p>
        `;
    }

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "KOLs3 <noreply@kols3.com>",
        to: [email],
        subject,
        html: htmlContent,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Verification email sent successfully:", emailResult);

    return new Response(JSON.stringify({ success: true, ...emailResult }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-verification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
