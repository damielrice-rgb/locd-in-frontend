import {useEffect, useState} from 'react';
import {getAppointments} from '../api/server';

function useAppointments() {
  const [ appointments, setAppointments] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState('');

  useEffect(() => {
    getAppointments()
    .then((data) => {
      setAppointments(data);
    })
    .catch((error) => {
      console.error(error);
      setError('Could not load your appointments');
    })
    .finally(()=> {
      setLoading(false);
    });
  }, []);
  return { appointments, setAppointments, loading, error};

}

export default useAppointments;