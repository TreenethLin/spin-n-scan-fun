
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId, ip } = await req.json()
    
    // Validate the user ID
    if (!userId) {
      throw new Error('User ID is required')
    }
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if user has already participated
    const { data: existingParticipant } = await supabase
      .from('participants')
      .select()
      .eq('user_id', userId)
      .single()
      
    if (existingParticipant) {
      throw new Error('You have already participated in the wheel spin')
    }

    // Get available prizes
    const { data: prizes } = await supabase
      .from('prizes')
      .select()
      .eq('active', true)
      .gt('remaining_quantity', 0)

    if (!prizes || prizes.length === 0) {
      throw new Error('No prizes available')
    }

    // Select a prize based on probability weights
    const totalWeight = prizes.reduce((sum, prize) => sum + Number(prize.probability), 0)
    let random = Math.random() * totalWeight
    let selectedPrize = prizes[0]
    
    for (const prize of prizes) {
      random -= Number(prize.probability)
      if (random <= 0) {
        selectedPrize = prize
        break
      }
    }

    // Update prize quantity and record participation
    const { error: updateError } = await supabase
      .from('prizes')
      .update({ remaining_quantity: selectedPrize.remaining_quantity - 1 })
      .eq('id', selectedPrize.id)

    if (updateError) throw updateError

    const { error: participantError } = await supabase
      .from('participants')
      .insert({
        user_id: userId,
        prize: selectedPrize.name,
        ip_address: ip
      })

    if (participantError) throw participantError

    return new Response(
      JSON.stringify({ prize: selectedPrize.name }),
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
