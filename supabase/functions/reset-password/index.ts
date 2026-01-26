import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ResetRequest {
  email: string;
  redirectUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, redirectUrl }: ResetRequest = await req.json();

    if (!email || !redirectUrl) {
      throw new Error("Email and redirect URL are required");
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Generate password reset link using Supabase Admin API
    const { data, error: resetError } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: email,
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (resetError) {
      console.error("Reset link error:", resetError);
      return new Response(
        JSON.stringify({ success: true, message: "If an account exists, a reset email will be sent." }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resetLink = data.properties?.action_link;

    // Send branded email using Resend API
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Kols3 <noreply@kols3.xyz>",
        to: [email],
        subject: "Reset your Kols3 password",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; background-color: #0a0a0b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #0a0a0b;">
              <tr>
                <td style="padding: 40px 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto;">
                    <!-- Logo -->
                    <tr>
                      <td style="text-align: center; padding-bottom: 32px;">
                        <span style="font-size: 28px; font-weight: 700; color: #a855f7;">Kols3</span>
                      </td>
                    </tr>
                    
                    <!-- Content Card -->
                    <tr>
                      <td style="background: linear-gradient(145deg, #18181b, #1f1f23); border-radius: 16px; padding: 40px; border: 1px solid #27272a;">
                        <h1 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 16px 0; text-align: center;">
                          Reset Your Password
                        </h1>
                        
                        <p style="color: #a1a1aa; font-size: 16px; line-height: 24px; margin: 0 0 24px 0; text-align: center;">
                          We received a request to reset your password. Click the button below to choose a new one.
                        </p>
                        
                        <!-- Button -->
                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                          <tr>
                            <td style="text-align: center; padding: 8px 0 24px 0;">
                              <a href="${resetLink}" 
                                 style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #a855f7, #8b5cf6); color: #ffffff; text-decoration: none; font-weight: 600; font-size: 16px; border-radius: 8px;">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="color: #71717a; font-size: 14px; line-height: 20px; margin: 0; text-align: center;">
                          This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="text-align: center; padding-top: 32px;">
                        <p style="color: #52525b; font-size: 12px; margin: 0;">
                          © 2025 Kols3. All rights reserved.
                        </p>
                        <p style="color: #52525b; font-size: 12px; margin: 8px 0 0 0;">
                          The Web3 Creator Marketplace
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Password reset email sent:", emailResult);

    return new Response(
      JSON.stringify({ success: true, message: "If an account exists, a reset email will be sent." }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in reset-password function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
