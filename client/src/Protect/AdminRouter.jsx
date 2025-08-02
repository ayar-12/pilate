import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { Navigate } from 'react-router-dom'

function AdminRouter({children}) {
    const{isLoggedin, userData} = useContext(AppContext)
    const isAdmin = userData?.role === 'admin'

    if (!isLoggedin) return <Navigate to='/login'/>
    if(!isAdmin)return <Navigate to='/' />

    return children
  
  
}

export default AdminRouter
