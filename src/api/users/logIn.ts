// Libs
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const supabase = createClientComponentClient()

// Función para iniciar seción
export const logIn = async () => {
  const host: string = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : window.location.origin

  try {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: host + '/auth/callback' }
    })
  } catch (error) {
    return []
  }
}
