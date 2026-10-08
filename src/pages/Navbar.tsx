import {Link} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

function Navbar () {
  const {token} = useAuth();

  return (
    <nav className="flex items-center justify-between border-b p-4">
      <Link to="/" className="text-2xl font-bold">
      Loc'd In 
    </Link>

    <div>
      <Link to="/">Home</Link>

      {token && (
        <Link to="/dashboard">
          Dashboard
          </Link>)}

      {!token && (
        <Link to="/login">
          Login
          </Link> )}

      {!token && (
        <Link to="/register">
        Register
        </Link>)}

      {token && (
        <Link to="/appointments">
          Appointments
          </Link> )}
    </div>
    </nav>
  )
}

export default Navbar;