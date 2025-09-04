import React from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAuth, getUser } from '../utils/auth'
import { Link } from 'react-router-dom'

export default function Header(){
const nav = useNavigate()
const user = getUser()
const logout = () => { clearAuth(); nav('/login') }


return (
<header className="w-full py-4 px-4 bg-white shadow-sm flex items-center justify-between">
<div className="flex items-center gap-3">
<Link to="/welcome">
  <img 
    src="https://res.cloudinary.com/djlo5utij/image/upload/v1756900854/top_gafwmg.png" 
    alt="logo" 
    className="w-16 h-16 object-contain cursor-pointer" 
  />
</Link>
</div>
<div className="flex items-center gap-3">
{user && <span className="text-sm">Hi, {user.name}</span>}
<button onClick={logout} className="text-sm text-red-500">Logout</button>
</div>
</header>
)
}