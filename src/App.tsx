import Home from './pages/Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import Navbar from './pages/Navbar';
import Appointments from './pages/Appointments';


function App() {

  return ( 
    <BrowserRouter>

    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
        <Dashboard />
        </ProtectedRoute>} />

        <Route path="/appointments" element={
        <ProtectedRoute>
        <Appointments />
        </ProtectedRoute>} />

    </Routes>

    </BrowserRouter>
  )
}

export default App
