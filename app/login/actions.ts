'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // Use email and password or magic link based on the form
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Simple email/password sign-in for now
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirect('/login?error=Invalid email or password')
  }

  revalidatePath('/portal/home')
  redirect('/portal/home')
}
