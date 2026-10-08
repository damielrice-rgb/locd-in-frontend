import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {getServices, createAppointment, deleteAppointment, updateAppointment} from '../api/server';
import type {Service} from '../types/service';
import useAppointments from '../hooks/useAppointments';

function Appointments() {
  // Get the service id from url
  const [searchParams] = useSearchParams()

  // Store the service that is selected
  const [service, setService] = useState<Service | null>(null)

  const [date, setDate] = useState('');

  const [time, setTime] = useState('')

  const [notes, setNotes] = useState('');

  const [message, setMessage] = useState('');

  const {appointments, setAppointments, loading, error} = useAppointments();
// Keeps track of which appt. we are editing
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
// These store the updated appt. info
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editNotes, setEditNotes] = useState('');
  

  useEffect(() => {
    // Get the service ID from ?service=
    const serviceId = searchParams.get('service')

    if(!serviceId) {
      return
    }

    //Get all services from the backend
      getServices()
      .then((services)=> {

      //Find the service that matches the ID
      const selectedService = services.find((item: Service) => item._id === serviceId)
      // Save the selected service
      setService(selectedService || null)
    })
    .catch((error) => {
      console.log(error);
    })
  }, [searchParams])

  async function handleDelete(appointmentId: string){
    try {
      // Delete Appointment from backend
      await deleteAppointment(appointmentId)

      // Remove deleted from page
      setAppointments((currentAppointments: any[]) => 
      currentAppointments.filter((appointment: any) => appointment._id !== appointmentId))

      setMessage('Appointment cancelled successfully!')
    } catch (error) {
      console.error(error);
      setMessage('Failed to cancel appointment.')
    }
  }

  function handleEdit(appointment: any) {
    //Save the appt. we are editing
    setEditingAppointment(appointment)
// Get the appt. date
    const appointmentDate = new Date(appointment.date)
// Put the date into the date input
    setEditDate(appointmentDate.toISOString().split('T')[0])
// Put the time in the time input
    setEditTime(appointmentDate.toTimeString().slice(0,5))
  
  // Put the existing notes in the note input
  setEditNotes(appointment.notes || '');
  }

  async function handleUpdate(event: React.FormEvent){
    event.preventDefault();

    try{
      //Make sure we have a appointment selected
      if(!editingAppointment){
        return
      }
      //Combine the date and time into one value
      const appointmentDate = `${editDate}T${editTime}`

      //Send the updated appointment to the backend
      const data = await updateAppointment(
        editingAppointment._id,
        editingAppointment.service._id,
        appointmentDate,
        editNotes,
        editingAppointment.status
      )

      // Replace the old appt. with new one
      setAppointments((currentAppointments: any[]) =>
      currentAppointments.map((appointment) => 
      appointment._id === editingAppointment._id
        ? data.appointment
        : appointment
      ) 
    )
    // Close the edit form
    setEditingAppointment(null);

    setMessage('Appointment updated successfully!')
    } catch (error) {
      console.error(error);
      setMessage('Failed to update appointment.');
    }
  }

  async function handleBooking(event: React.FormEvent){
    event.preventDefault();
    try{
      if(!service){
        return
      }

      //Combine selected date and time
      const appointmentDate = `${date}T${time}`

      //Send to backend
      const newAppointment = await createAppointment(
        service._id,
        appointmentDate,
        notes
      )
      // Add new appointment to list on page
      setAppointments((currentAppointments: any[]) => [
        ...currentAppointments,
        newAppointment.appointment
      ])
      setMessage('Appointment booked successfully!')

    }catch (error) {
      console.log(error);
      setMessage('Failed to book appointment.')
    }
  }
  return (
    <div className="min-h-screen p-10">
      <h1 className="text-4xl font-bold">
        Book an Appointment
      </h1>

      {service ? (
        <div className="mt-6 border rounded-lg p-6">
          <h2 className="text-2xl font-bold">
            {service.name}
            </h2>
            
            <p className="mt-2">
              {service.description}
              </p>
              
              <p className="mt-4 font-bold">
                ${service.price}
                </p>

                <form onSubmit={handleBooking} className="mt-6">
                  <label className="block font-bold mb-2">
                    Choose a Date
                  </label>

                  <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="w-full rounded-lg border p-3 mb-4" />

                  <label className="block font-bold mb-2">
                    Choose a Time
                  </label>

                  <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="w-full rounded-lg border p-3 mb-4" />

                  <label className="block font-bold mb-2">
                    Notes
                  </label>

                  <textarea
                  placeholder="Add any notes for your appointment"
                  value={notes}
                  onChange={(event) => setNotes(event?.target.value)}
                  className="w-full rounded-lg border p-3 mb-4" />

                  <button 
                  className="rounded-lg border px-4 py-2 font-bold cursor-pointer"
                  type="submit">
                    Book Appointment
                  </button>

                  {message && (
                    <p className="mt-4 font-bold">
                      {message}
                    </p>
                  )}

                </form>
                </div>
                ) : (
                  <p className="mt-4">
                    Please select a service.
                  </p>
                )}

                <div className="mt-10">
                  <h2 className="text-2xl font-bold mb-4">
                    My Appointments
                  </h2>

                   {message && (
                    <p className="mt-4 font-bold">
                      {message}
                    </p>
                  )}

                  {loading && <p>Loading your appointments..</p>}

                  {error && <p className="font-bold text-red-600">{error}</p>}

                  {!loading && !error && appointments.length === 0 ? (
                    <p>You dont have any appointments yet.</p>
                  ) : ( 
                    <div>
                      {appointments.map((appointment: any) => (
                        <div
                        key={appointment._id}
                        className="border rounded-lg p-6 mb-4"
                        >
                          <h3 className="text-xl font-bold">
                            {appointment.service?.name}
                          </h3>

                          <p className="mt-2">
                            Date: {new Date(appointment.date).toLocaleString()}
                          </p>

                          <p className="mt-2">
                            Status: {appointment.status}
                          </p>

                          {appointment.notes && (
                            <p className="mt-2">
                              Notes: {appointment.notes}
                            </p>
                            )}
                            <button 
                            type="button"
                            onClick={() => handleEdit(appointment)}
                            className="mt-4 mr-2 rounded-lg border px-4 py-2 font-bold cursor-pointer"
                            >
                              Edit Appointment
                              </button>

                            <button type="button"
                            onClick={() => handleDelete(appointment._id)}
                            className="mt-4 rounded-lg border px-4 py-2 font-bold cursor-pointer"
                            >
                              Cancel Appointment
                            </button>

                            {editingAppointment?._id === appointment._id && (
                              <form onSubmit={handleUpdate} className="mt-6 border-t pt-6">
                                <h4 className="text-xl font-bold mb-4">
                                  Edit Appointment
                                  </h4>

                                  <label className="block font-bold mb-2">
                                    Date
                                    </label>

                                    <input
                                    type="date"
                                    value={editDate}
                                    onChange={(event) => setEditDate(event.target.value)}
                                    className="w-full rounded-lg border p-3 mb-4"
                                     />

                                     <label className="block font-bold mb-2">
                                      Time
                                      </label>

                                      <input
                                      type="time"
                                      value={editTime}
                                      onChange={(event) => setEditTime(event.target.value)}
                                      className="w-full rounded-lg border p-3 mb-4" 
                                      />

                                        <label className="block font-bold mb-2">
                                      Notes
                                      </label>

                                      <textarea
                                      
                                      value={editNotes}
                                      onChange={(event) => setEditNotes(event.target.value)}
                                      className="w-full rounded-lg border p-3 mb-4" 
                                      />

                                      <button type="submit"
                                      className="rounded-lg border px-4 py-2 font-bold cursor-pointer">
                                        Save Changes
                                        </button>

                                        <button type="button"
                                        onClick={() => setEditingAppointment(null)}
                                        className="ml-2 rounded-lg border px-4 py-2 font-bold cursor-pointer">
                                          Cancel
                                          </button>
                              </form>
                            )}
                          
                    </div>
                  ))}
                </div>
                  )}
                  </div>
                  </div>
  )
}

export default Appointments