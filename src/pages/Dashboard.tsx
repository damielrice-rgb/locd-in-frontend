import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


function Dashboard() {
    //Get the logout function from Auth Context
    const { logout } = useAuth();

    //Moves the user to another page
    const navigate = useNavigate()

    //Handle logout
    function handleLogout(){
      // Remove the JWT
      logout()

      // Send the user back to Login
      navigate('/login');
    }
  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold">
        My Dashboard
        </h1>

      <p className="mt-4">
        Welcome to your Loc'd In dashboard!
        </p>

        <button
        type="button" 
        className="mt-6 rounded-lg border px-4 py-2 font-bold cursor-pointer"
        onClick={handleLogout}>
          Logout
        </button>
    </div>
  )
}

export default Dashboard;