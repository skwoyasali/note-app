export const setToken = (token) => localStorage.setItem('token', token)
export const getToken = () => localStorage.getItem('token')
export const clearAuth = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); }
export const setUser = (u) => localStorage.setItem('user', JSON.stringify(u))
export const getUser = () => JSON.parse(localStorage.getItem('user') || 'null')