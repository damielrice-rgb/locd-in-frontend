import {useEffect, useState} from 'react'
import { getServices} from '../api/server'
import type { Service } from '../types/service'
import {useNavigate} from 'react-router-dom';

function Home() {

const [services, setServices] = useState<Service[]>([]);
const navigate = useNavigate();

useEffect(() => {
  getServices()
  .then((data) => {
    setServices(data)
  })
  .catch((error) => {
    console.error(error)
  })
}, [])

return (
  <div className="min-h-screen p-10">
    <h1 className="text-5xl font-bold mb-8">
      Loc'd In
    </h1>

    <h2 className="text-2xl font-bold mb-4">
      Our Services</h2>

    <div>
      {services.map((service) => (
        <div key={service._id} className="mb-4">

          <h3 className="text-xl font-bold">
            {service.name}</h3>

          <p>{service.description}</p>

          <p>{service.price}</p>

          <button 
          onClick={() => navigate(`/appointments?service=${service._id}`)}
          className="mt-2 rounded-lg border px-4 py-2 font-bold">
            Book Appointment
            </button>
            
        </div>
      ))}
    </div>
  </div>
)
}

export default Home;