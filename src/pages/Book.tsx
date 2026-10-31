// Book.tsx — the guest booking page (/book)
// No account needed. Client picks a service, date, time, adds their
// name + phone, and the backend texts a confirmation to them AND Morneice.
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getServices, createBooking } from '../api/server';
import type { Service } from '../types/service';

// TODO: change these to Morneice's real appointment times.
// WHY a list instead of a free time picker: she only takes
// appointments at set times, and it stops "3:17 AM" bookings.
const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

// "14:00" -> "2:00 PM" so the buttons are easy to read
function showTime(slot: string) {
  const [hour, minute] = slot.split(':').map(Number);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // 0 and 12 both become 12
  return `${hour12}:${String(minute).padStart(2, '0')} ${suffix}`;
}

// Morneice works in St. Louis, so every appointment time is St. Louis time,
// even if the client's phone is set to another time zone.
const ST_LOUIS = 'America/Chicago';

// Today's date in St. Louis as "2026-10-15" so the calendar can't pick past days.
// WHY en-CA: Canada writes dates as year-month-day, the format a date input needs.
function todayString() {
  return new Date().toLocaleDateString('en-CA', { timeZone: ST_LOUIS });
}

// Turn a picked date + time into the exact moment in St. Louis.
// "2027-01-05" + "14:00" -> "2027-01-05T20:00:00.000Z"
// WHY two tries: St. Louis is 5 hours behind UTC in daylight saving time and
// 6 hours behind the rest of the year. We try both, then ask a St. Louis clock
// which one really shows the picked time. That handles daylight saving for us.
function stLouisToISO(date: string, time: string) {
  const daylightTime = new Date(`${date}T${time}:00-05:00`);
  const standardTime = new Date(`${date}T${time}:00-06:00`);

  const clock = daylightTime.toLocaleTimeString('en-US', {
    timeZone: ST_LOUIS,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23', // 24-hour clock, so it matches our "14:00" slots
  });

  return (clock === time ? daylightTime : standardTime).toISOString();
}

function Book() {
  // ?service=123 in the URL (from the "Book" buttons on Home)
  const [searchParams] = useSearchParams();

  const [services, setServices] = useState<Service[]>([]);

  // form fields — start the service as whatever was in the URL
  const [serviceId, setServiceId] = useState(searchParams.get('service') || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [smsConsent, setSmsConsent] = useState(false);

  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // after booking we save what the backend sent back, then show the confirmation
  // textSent = did the texts actually go out? The booking still saves if they fail.
  const [booked, setBooked] = useState<{ service: Service; date: string; textSent: boolean } | null>(null);

  // Load the services for the dropdown (same getServices as Home)
  useEffect(() => {
    getServices()
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Phone check: 10 digits, or 11 starting with 1
  const digits = clientPhone.replace(/\D/g, '');
  const validPhone = digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));

  // Button only turns on when everything is filled in
  const canSubmit = serviceId && date && time && clientName.trim() && validPhone && smsConsent && !sending;

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault(); // stop the page from reloading
    setError('');
    setSending(true);

    try {
      // Put the date + time together as St. Louis time, then send the EXACT moment.
      // WHY not new Date(date + time): that uses the phone's time zone, so a phone
      // on New York time would book 2:00 PM as 1:00 PM in St. Louis.
      const fullDate = stLouisToISO(date, time);

      const data = await createBooking(serviceId, fullDate, notes, clientName, clientPhone, smsConsent);

      setBooked({ service: data.appointment.service, date: data.appointment.date, textSent: data.textSent });

      // scroll back up so they see the confirmation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSending(false);
    }
  };

  // ========== CONFIRMATION SCREEN ==========
  if (booked) {
    const when = new Date(booked.date).toLocaleString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: ST_LOUIS, // show St. Louis time, not the phone's time
    });

    return (
      <div className="bg-ruby-glow -mt-28 flex min-h-screen items-center justify-center px-4 pb-20 pt-40 text-white">
        <div className="glass w-full max-w-xl rounded-[36px] p-8 text-center md:p-12" role="status">
          <p className="font-display text-5xl font-black">You're booked! ✷</p>
          <p className="mt-6 font-display text-2xl font-bold">{booked.service.name}</p>
          <p className="mt-2 text-xl text-blush">{when} (St. Louis time)</p>
          {/* WHY check textSent: never say we texted them if the text failed.
              This screen is their only record when that happens. */}
          <p className="mt-6 leading-relaxed text-blush">
            {booked.textSent
              ? `We just texted your confirmation to ${clientPhone}. Morneice got a text too, so she'll be ready for you.`
              : "Your appointment is saved, but our confirmation text didn't go through. Please take a screenshot of this page."}
          </p>
          <Link to="/" className="mt-8 inline-flex min-h-14 items-center rounded-full bg-white px-8 text-lg font-extrabold text-ruby">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  // ========== BOOKING FORM ==========
  return (
    // -mt-28 pulls the red up under the floating navbar (App gives every page pt-28)
    // WHY a div: App already wraps every page in <main>, and a page should only have one
    <div className="bg-ruby-glow -mt-28 min-h-screen px-4 pb-20 pt-40 text-white">
      <div className="mx-auto max-w-2xl">
        <p className="font-bold uppercase tracking-widest text-blush">No account needed</p>
        <h1 className="mt-3 font-display text-4xl font-black tracking-tight md:text-6xl">Book your appointment</h1>
        <p className="mt-4 text-lg text-blush">Pick a service and time. We'll text your confirmation right away.</p>

        <form onSubmit={handleBooking} className="glass mt-10 flex flex-col gap-6 rounded-[32px] p-6 md:p-10">

          {/* 1. SERVICE */}
          <label className="flex flex-col gap-2 font-bold">
            Service
            {/* color-scheme:dark keeps the open list dark, so the white text stays readable */}
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="min-h-14 rounded-2xl border border-white/30 bg-ink/40 px-4 text-white [color-scheme:dark]"
            >
              <option value="">Choose a service</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name} · ${service.price}
                </option>
              ))}
            </select>
          </label>

          {/* 2. DATE — min stops past dates */}
          <label className="flex flex-col gap-2 font-bold">
            Date
            <input
              type="date"
              min={todayString()}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="min-h-14 rounded-2xl border border-white/30 bg-ink/40 px-4 text-white [color-scheme:dark]"
            />
          </label>

          {/* 3. TIME — buttons are easier to tap on a phone than a dropdown */}
          <fieldset>
            <legend className="mb-2 font-bold">Time</legend>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button" // type="button" so clicking it doesn't submit the form
                  onClick={() => setTime(slot)}
                  // the picked time turns white
                  className={`min-h-12 rounded-full border font-bold transition ${
                    time === slot ? 'border-white bg-white text-ruby' : 'border-white/30 bg-white/5 hover:bg-white/15'
                  }`}
                >
                  {showTime(slot)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-blush">Times are St. Louis time</p>
          </fieldset>

          {/* 4. NAME + PHONE */}
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="flex flex-col gap-2 font-bold">
              Your name
              <input
                type="text"
                autoComplete="name"
                placeholder="First and last name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="min-h-14 rounded-2xl border border-white/30 bg-ink/40 px-4 text-white placeholder:text-white/40"
              />
            </label>
            <label className="flex flex-col gap-2 font-bold">
              Mobile number
              <input
                type="tel"
                autoComplete="tel"
                placeholder="(314) 555-0123"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="min-h-14 rounded-2xl border border-white/30 bg-ink/40 px-4 text-white placeholder:text-white/40"
              />
            </label>
          </div>

          {/* 5. NOTES */}
          <label className="flex flex-col gap-2 font-bold">
            Notes (optional)
            <textarea
              rows={3}
              placeholder="Booking for your child? Add their name. Anything Morneice should know?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="rounded-2xl border border-white/30 bg-ink/40 p-4 text-white placeholder:text-white/40"
            />
          </label>

          {/* 6. TEXT CONSENT — required, because the text IS the confirmation */}
          <label className="flex items-start gap-3 text-sm leading-relaxed text-blush">
            <input
              type="checkbox"
              checked={smsConsent}
              onChange={(e) => setSmsConsent(e.target.checked)}
              className="mt-0.5 size-5 shrink-0 accent-white"
            />
            <span>
              Text me my appointment confirmation and reminders at this number. Msg &amp; data rates may apply.
              Reply STOP to opt out.
            </span>
          </label>

          {error && <p className="rounded-2xl bg-ink/40 p-4 font-bold">{error}</p>}

          <button
            type="submit"
            disabled={!canSubmit}
            className="min-h-14 rounded-full bg-white px-8 text-lg font-extrabold text-ruby transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? 'Booking...' : 'Book my appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Book;
