import { createServerSupabaseClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', request.url), { status: 302 })
}

export async function GET(request: NextRequest) {
  const supabase = createServerSupabaseClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', request.url), { status: 302 })
}
