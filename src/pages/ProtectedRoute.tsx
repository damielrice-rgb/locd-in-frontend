import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

function ProtectedRoute({children}: {children: React.ReactNode}){
  // Get the user's JWT from Auth Context
  const {token} = useAuth();

  if(!token) {
    return <Navigate to="/login" replace />
  }

  return children;
}

export default ProtectedRoute;