import Home from './pages/Home';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './pages/ProtectedRoute';
import Navbar from './pages/Navbar';
import Appointments from './pages/Appointments';
// NEW: guest booking page
import Book from './pages/Book';


function App() {

  return ( 
    <BrowserRouter>

    <Navbar />

    {/* pt-28 = room for the floating navbar on every page.
        WHY: the navbar is fixed, so it would sit on top of the page without this space. */}
    <main className="pt-28">
    <Routes>
      <Route path="/" element={<Home />} />

      {/* NEW: guest booking. Public, so it's NOT inside ProtectedRoute */}
      <Route path="/book" element={<Book />} />

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
    </main>

    </BrowserRouter>
  )
}

export default App
