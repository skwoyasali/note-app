import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import API from '../api/api'
import { setToken, setUser } from '../utils/auth'


export default function VerifyOTP(){
const [code, setCode] = useState('')
const [error, setError] = useState(null)
const [loading, setLoading] = useState(false)
const [params] = useSearchParams()
const nav = useNavigate()
const email = params.get('email') || ''


useEffect(() => { if(!email) { /* allow manual email */ } }, [email])


const submit = async (e) => {
e.preventDefault(); setError(null)
if(!/^[0-9]{4,6}$/.test(code)) return setError('Enter valid OTP code')
try{
setLoading(true)
const resp = await API.post('/auth/verify-otp', { email, code })
setToken(resp.data.token)
setUser(resp.data.user)
nav('/welcome')
}catch(err){ setError(err.response?.data?.message || 'OTP verification failed') }
finally{ setLoading(false) }
}


return (
<div className="min-h-screen flex items-center justify-center">
<div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">
<h2 className="text-2xl font-semibold mb-4">Verify OTP</h2>
<p className="text-sm text-gray-600 mb-2">We sent an OTP to <strong>{email}</strong></p>
{error && <div className="text-sm text-red-600 mb-2">{error}</div>}
<form onSubmit={submit} className="space-y-3">
<input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Enter OTP" className="w-full p-2 border rounded" />
<button type="submit" className="w-full btn bg-blue-600 text-white">{loading ? 'Verifying...' : 'Verify & Continue'}</button>
</form>
</div>
</div>
)
}