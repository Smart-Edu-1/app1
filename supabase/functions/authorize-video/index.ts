import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { lessonId, deviceId } = await req.json();

    if (!lessonId) {
      return new Response(
        JSON.stringify({ error: 'lessonId is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Get user session
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    // Get lesson data
    const { data: lesson, error: lessonError } = await supabaseClient
      .from('lessons')
      .select('youtube_id, is_premium, is_active')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      console.error('Lesson fetch error:', lessonError);
      return new Response(
        JSON.stringify({ error: 'Lesson not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    if (!lesson.is_active) {
      return new Response(
        JSON.stringify({ error: 'Lesson is not active' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Check if lesson is free or user has access
    if (!lesson.is_premium) {
      // Free lesson - allow access
      const token = generateToken(lessonId, user?.id || 'guest', deviceId);
      return new Response(
        JSON.stringify({ 
          ok: true, 
          token,
          youtubeId: lesson.youtube_id,
          expiresIn: 600 // 10 minutes
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Premium lesson - check user authentication and subscription
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Authentication required for premium content' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Check if user is premium (has active subscription)
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('expiry_date, is_active')
      .eq('id', user.id)
      .single();

    const isPremium = profile && 
      profile.is_active && 
      profile.expiry_date && 
      new Date(profile.expiry_date) > new Date();

    if (!isPremium) {
      return new Response(
        JSON.stringify({ error: 'Premium subscription required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    // Log access attempt for security monitoring
    console.log(`Video access granted: User ${user.id}, Lesson ${lessonId}, Device ${deviceId}`);

    // Generate short-lived token
    const token = generateToken(lessonId, user.id, deviceId);

    return new Response(
      JSON.stringify({ 
        ok: true, 
        token,
        youtubeId: lesson.youtube_id,
        expiresIn: 600 // 10 minutes
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

// Generate a simple token (in production, use proper JWT or similar)
function generateToken(lessonId: string, userId: string, deviceId: string): string {
  const timestamp = Date.now();
  const data = `${lessonId}:${userId}:${deviceId}:${timestamp}`;
  return btoa(data); // Base64 encode
}