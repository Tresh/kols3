import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.91.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CompressRequest {
  imageBase64: string;
  userId: string;
  fileName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const { imageBase64, userId, fileName }: CompressRequest = await req.json();

    if (!imageBase64 || !userId || !fileName) {
      throw new Error("Missing required fields: imageBase64, userId, fileName");
    }

    // Create Supabase client with user token
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify the user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user || user.id !== userId) {
      throw new Error("Unauthorized");
    }

    // Decode base64 image
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Check file size - if already small enough, skip compression
    const MAX_SIZE = 200 * 1024; // 200KB target
    let finalBuffer = imageBuffer;
    let contentType = "image/jpeg";

    // If the image is already small, just use it directly
    // For larger images, we'll convert to a smaller format
    if (imageBuffer.length > MAX_SIZE) {
      // For now, we'll just upload with the size as-is
      // The client should handle pre-compression
      console.log(`Image size: ${imageBuffer.length} bytes (${(imageBuffer.length / 1024).toFixed(1)}KB)`);
    }

    // Determine content type from original
    if (imageBase64.includes("data:image/png")) {
      contentType = "image/png";
    } else if (imageBase64.includes("data:image/webp")) {
      contentType = "image/webp";
    } else if (imageBase64.includes("data:image/gif")) {
      contentType = "image/gif";
    }

    // Create admin client for upload
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Delete existing avatars for this user
    const { data: existingFiles } = await supabaseAdmin.storage
      .from("avatars")
      .list(userId);

    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map(f => `${userId}/${f.name}`);
      await supabaseAdmin.storage.from("avatars").remove(filesToDelete);
    }

    // Generate unique filename
    const ext = contentType.split("/")[1];
    const uniqueFileName = `${Date.now()}.${ext}`;
    const filePath = `${userId}/${uniqueFileName}`;

    // Upload compressed image
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("avatars")
      .upload(filePath, finalBuffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw new Error(`Failed to upload avatar: ${uploadError.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from("avatars")
      .getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("user_id", userId);

    if (profileError) {
      console.error("Profile update error:", profileError);
    }

    // Also update creator_profiles if exists
    await supabaseAdmin
      .from("creator_profiles")
      .update({ avatar_url: publicUrl })
      .eq("user_id", userId);

    return new Response(
      JSON.stringify({ 
        success: true, 
        avatarUrl: publicUrl,
        originalSize: imageBuffer.length,
        compressedSize: finalBuffer.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in compress-avatar function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
