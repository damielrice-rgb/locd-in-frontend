import {useState} from 'react';
import { login } from '../api/server';
import {useAuth} from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
   // Get login function from Auth Context
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  // Store user email
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');

  async function handleLogin(event: React.FormEvent) {
    // Prevent page reload
    event.preventDefault();

    try {     
        const data = await login(email, password);
      // Save the JWT using Auth Context
      loginUser(data.token);

      setMessage('Login successful!')
      navigate('/dashboard');

    } catch (error) {
      setMessage('Login failed. Check your email and password.')
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-10">
      <h1 className="text-5xl font-bold mb-10">
        Loc'd In
        </h1>
        
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Login
          </h2>

        <form onSubmit={handleLogin}>

          <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event?.target.value)}
          className="w-full rounded-lg border p-3 mb-4" 
          />
          <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event?.target.value)} 
          className="w-full rounded-lg border p-3 mb-4"
          />

          <button 
          type="submit"
          className="w-full rounded-lg border px-4 py-3 font-bold"
            >
            Login
            </button>

        </form>

        <p className="mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold underline">
          Register
          </Link>
        </p>

        {message && (
          <p className="mt-4 font-bold">
            {message}
          </p>
        )}
      </div>
      
    </div>
  )
}

export default Login