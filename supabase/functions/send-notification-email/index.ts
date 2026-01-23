import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationEmailRequest {
  to: string;
  subject: string;
  type: "application_approved" | "application_rejected" | "task_approved" | "task_rejected" | "new_task" | "module_unlocked";
  data?: {
    userName?: string;
    taskTitle?: string;
    moduleTitle?: string;
    xpEarned?: number;
    rejectionReason?: string;
  };
}

const getEmailContent = (type: string, data: NotificationEmailRequest["data"] = {}) => {
  const userName = data.userName || "Scholar";
  
  switch (type) {
    case "application_approved":
      return {
        subject: "🎉 Your Scholarship Application is Approved!",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000;">Congratulations, ${userName}! 🎉</h1>
            <p>Your scholarship application has been approved. You now have full access to the Scholarship Portal.</p>
            <p>Start completing tasks to earn XP and climb the leaderboard!</p>
            <a href="https://kols3.lovable.app/scholarship" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Go to Scholarship Portal</a>
            <p style="color: #666; margin-top: 24px;">Best,<br>The KOLS3 Team</p>
          </div>
        `,
      };
    case "application_rejected":
      return {
        subject: "Scholarship Application Update",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000;">Application Update</h1>
            <p>Hi ${userName},</p>
            <p>Unfortunately, your scholarship application was not approved at this time.</p>
            ${data.rejectionReason ? `<p><strong>Reason:</strong> ${data.rejectionReason}</p>` : ""}
            <p>You may reapply in the future. Thank you for your interest!</p>
            <p style="color: #666; margin-top: 24px;">Best,<br>The KOLS3 Team</p>
          </div>
        `,
      };
    case "task_approved":
      return {
        subject: `✅ Task Approved - You earned ${data.xpEarned || 0} XP!`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000;">Task Approved! ✅</h1>
            <p>Hi ${userName},</p>
            <p>Your submission for "<strong>${data.taskTitle || "a task"}</strong>" has been approved!</p>
            <p style="font-size: 24px; font-weight: bold;">+${data.xpEarned || 0} XP</p>
            <a href="https://kols3.lovable.app/scholarship" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">View Your Progress</a>
            <p style="color: #666; margin-top: 24px;">Keep up the great work!<br>The KOLS3 Team</p>
          </div>
        `,
      };
    case "task_rejected":
      return {
        subject: "Task Submission Update",
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000;">Task Submission Update</h1>
            <p>Hi ${userName},</p>
            <p>Your submission for "<strong>${data.taskTitle || "a task"}</strong>" was not approved.</p>
            ${data.rejectionReason ? `<p><strong>Reason:</strong> ${data.rejectionReason}</p>` : ""}
            <p>Please review the requirements and try again!</p>
            <a href="https://kols3.lovable.app/scholarship" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Retry Task</a>
            <p style="color: #666; margin-top: 24px;">Best,<br>The KOLS3 Team</p>
          </div>
        `,
      };
    case "new_task":
      return {
        subject: `📋 New Task Available: ${data.taskTitle || "Check it out!"}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000;">New Task Available! 📋</h1>
            <p>Hi ${userName},</p>
            <p>A new task is available for you: "<strong>${data.taskTitle || "New Task"}</strong>"</p>
            <p>Complete it to earn XP and climb the leaderboard!</p>
            <a href="https://kols3.lovable.app/scholarship" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">Start Task</a>
            <p style="color: #666; margin-top: 24px;">Best,<br>The KOLS3 Team</p>
          </div>
        `,
      };
    case "module_unlocked":
      return {
        subject: `🔓 New Module Unlocked: ${data.moduleTitle || "Check it out!"}`,
        html: `
          <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #000;">Module Unlocked! 🔓</h1>
            <p>Hi ${userName},</p>
            <p>Congratulations! You've unlocked a new module: "<strong>${data.moduleTitle || "New Module"}</strong>"</p>
            <p>Continue your learning journey now!</p>
            <a href="https://kols3.lovable.app/scholarship" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 16px;">View Module</a>
            <p style="color: #666; margin-top: 24px;">Keep learning!<br>The KOLS3 Team</p>
          </div>
        `,
      };
    default:
      return {
        subject: "KOLS3 Notification",
        html: `<p>You have a new notification from KOLS3.</p>`,
      };
  }
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, data }: NotificationEmailRequest = await req.json();

    if (!to || !type) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const emailContent = getEmailContent(type, data);

    const emailResponse = await resend.emails.send({
      from: "KOLS3 <notifications@resend.dev>",
      to: [to],
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in send-notification-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
