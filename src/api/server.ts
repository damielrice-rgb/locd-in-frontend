const API_URL = import.meta.env.VITE_API_URL;

// this function gets a;; services from backend
export async function getServices() {
// send a GET request to our Express backend
const response = await fetch(`${API_URL}/services`);

if(!response.ok) {
  throw new Error ('Failed to fetch services');
}

// turn response into JS data
const data = await response.json();

return data;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/users/login`, { 
    method: 'POST', 
    headers: {
      'Content-Type' : 'application/json',
    },

    body: JSON.stringify({
      email,
      password,
    }),
});

  if (!response.ok) {
    throw new Error ('Login failed');
  }

  const data = await response.json();

  return data;
}

// Register a new user
export async function register (
  username: string,
  email: string,
  password: string
){
  // Send registration info to backend
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type' : 'application/json',
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  })
// Check if the backend returned and error
  if(!response.ok) {
    throw new Error ('Registration failed')
  }
// Return the backend response
  return response.json()
}

export async function createAppointment(
  service: string,
  date: string,
  notes: string,
) {
  const token = localStorage.getItem('token')

  const response = await fetch(`${API_URL}/appointments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      service,
      date,
      notes,
    }),
  })

  if(!response.ok) {
    throw new Error('Failed to create appointment')
  }

  return response.json()
}

export async function getAppointments() {
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/appointments`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if(!response.ok){
    throw new Error('Failed to get appointments');
  }
  return response.json()
}

export async function deleteAppointment(appointmentId: string){
  const token = localStorage.getItem('token');

  const response = await fetch(`${API_URL}/appointments/${appointmentId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if(!response.ok) {
    throw new Error('Failed to delete appointment')
  }

  return response.json();
}

export async function updateAppointment(
  appointmentId: string,
  service: string,
  date: string,
  notes: string,
  status: string,
){
  // Get logged-in user's JWT
  const token = localStorage.getItem('token');

  // Send updated appointment to backend
  const response = await fetch(
    `${API_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: {
        'Content-type' : 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        service,
        date,
        notes,
        status 
      }),
    }
  )
// If the request fail, show error


  if(!response.ok) {
    throw new Error('Failed to update appointment')
  }
// Return the update appointment
  return response.json()
}

// ===================================================
// NEW: Guest booking — no login, so NO token
// ===================================================
export async function createBooking(
  service: string,
  date: string,
  notes: string,
  clientName: string,
  clientPhone: string,
  smsConsent: boolean,
) {
  const response = await fetch(`${API_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service,
      date,
      notes,
      clientName,
      clientPhone,
      smsConsent,
    }),
  })

  const data = await response.json()

  // Show the backend's message (like "that time was just booked")
  // instead of a generic error, so the client knows what to fix
  if(!response.ok) {
    throw new Error(data.message || 'Failed to book appointment')
  }

  return data
}

// ===================================================
// NEW: Text Club sign up — also no login
// ===================================================
export async function subscribe(phone: string, consent: boolean, source: string) {
  const response = await fetch(`${API_URL}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      phone,
      consent,
      source,
    }),
  })

  const data = await response.json()

  if(!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}
