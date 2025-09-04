import React from 'react'


export default function GoogleSignIn(){
const api = import.meta.env.VITE_API_URL || 'http://localhost:5000'
return (
<a href={`${api}/auth/google`} className="btn border px-4 py-2 rounded-lg w-full text-center">
<img src="https://www.citypng.com/public/uploads/preview/google-logo-icon-gsuite-hd-701751694791470gzbayltphh.png" alt="g" className="inline-block w-5 h-5 mr-2 align-middle"/> Sign in with Google
</a>
)
}