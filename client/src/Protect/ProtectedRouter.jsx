import React, {useContext} from 'react'
import { AppContext } from '../context/AppContext'
import { Navigate } from 'react-router-dom'


function ProtectedRouter({children}) {
    const {isLoggedin} = useContext(AppContext)
    return isLoggedin ? children : <Navigate to='/login'/>
  return (
    <div>
      
    </div>
  )
}

export default ProtectedRouter
