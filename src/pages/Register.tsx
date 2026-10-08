import { useState } from 'react'
import { register } from '../api/server'
import { Link } from 'react-router-dom';

function Register () {
  // Store the username
  const [username, setUsername] = useState('')

  // Store the email
  const [email, setEmail] = useState('');

  const [password, setPassword ] = useState('')

  const [message, setMessage] = useState('')

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();

    try {
      await register(username, email, password)

      setMessage('Registration successful');
    } catch (error) {
      console.error('Registration error:', error)
      setMessage('Registration failed. Please try again.');
    }
  }

  return (
    <div>
      <h1 className="text-5xl font-bold mb-10">
        Loc'd In 
      </h1>

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">
          Create an Account
          </h2>

          <form onSubmit={handleRegister}>

            <input
            type="text"
            placeholder="Username"
            onChange={(event) => setUsername(event?.target.value)}
            className="w-full rounded-lg border p-3 mb-4"
             />

             <input
            type="email"
            placeholder="Email"
            onChange={(event) => setEmail(event?.target.value)}
            className="w-full rounded-lg border p-3 mb-4"
             />

              <input
            type="password"
            placeholder="Password"
            onChange={(event) => setPassword(event?.target.value)}
            className="w-full rounded-lg border p-3 mb-4"
             />

             <button 
             type="submit"
             className="w-full rounded-lg border px-4 py-3 font-bold">
              Register
              </button>
          </form>

          <p className="mt=4">
            Already have an account?{' '}
            <Link to="/login" className="font-bold underline">
            Login
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

export default Register;