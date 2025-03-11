
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { qrCode } = await req.json()
    
    if (!qrCode) {
      throw new Error('QR code is required')
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if the QR code exists in the users table
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('qr_code')
      .eq('qr_code', qrCode)
      .maybeSingle()
    
    if (userError) throw userError
    
    if (!user) {
      return new Response(
        JSON.stringify({ 
          isValid: false,
          isEligible: false,
          message: 'Invalid QR code'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Check if user has already participated
    const { data: participant, error: participantError } = await supabase
      .from('participants')
      .select('claimed')
      .eq('user_id', qrCode)
      .maybeSingle()
    
    if (participantError) throw participantError

    const isEligible = !participant
    const isClaimed = participant?.claimed || false

    return new Response(
      JSON.stringify({ 
        isValid: true,
        isEligible,
        isClaimed,
        message: isEligible ? 'You are eligible to spin the wheel!' : 'You have already participated'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
