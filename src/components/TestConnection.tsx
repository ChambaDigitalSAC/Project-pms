'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestConnection() {
  const [status, setStatus] = useState('Checking connection...')

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('count')
          .single()

        if (error) throw error
        setStatus('Connected to Supabase!')
      } catch (error) {
        setStatus('Connection failed!')
        console.error(error)
      }
    }

    checkConnection()
  }, [])

  return <div>{status}</div>
}
