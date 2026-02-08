import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";



const ProtectedRoute = ({children,allowedRoles}) => {

    const {isAuthenticated,role,status} = useSelector((state)=>state.auth)


     if (status === 'loading') {
    return <div>Checking session...</div>
  }

  
    if(!isAuthenticated){
        return <Navigate to="/" replace />
    }

    if(allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to="/home" replace/>
    }


  return children
}

export default ProtectedRoute
