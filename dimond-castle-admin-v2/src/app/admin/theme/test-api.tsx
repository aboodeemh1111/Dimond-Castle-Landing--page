'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function TestAPI() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL
      console.log('Testing API at:', `${API_URL}/api/theme`)
      
      const res = await fetch(`${API_URL}/api/theme`)
      console.log('Response status:', res.status)
      console.log('Response ok:', res.ok)
      
      if (!res.ok) {
        const text = await res.text()
        setResult(`Error ${res.status}: ${text}`)
        return
      }
      
      const data = await res.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Fetch error:', error)
      setResult(`Error: ${(error as Error).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Theme API Test</h1>
      <Button onClick={testAPI} disabled={loading}>
        {loading ? 'Testing...' : 'Test API Connection'}
      </Button>
      {result && (
        <pre className="p-4 bg-slate-100 rounded-md overflow-auto max-h-96">
          {result}
        </pre>
      )}
    </div>
  )
}

