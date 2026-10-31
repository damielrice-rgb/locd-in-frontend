// TextClubForm.tsx — the SMS sign up form (phone + consent checkbox).
// Used on BOTH Home and Landing, so the text on it comes in as props.
import { useState } from 'react';
import { subscribe } from '../api/server';

interface TextClubFormProps {
  title: string;
  buttonText: string;
  source: string; // 'home' or 'landing' — saved so Morneice knows which page worked
}

export default function TextClubForm({ title, buttonText, source }: TextClubFormProps) {
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  // Strip out everything that isn't a number: "(314) 555-1234" -> "3145551234"
  const digits = phone.replace(/\D/g, '');

  // A US number is 10 digits, or 11 if it starts with 1
  const validPhone = digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));

  // The button only works when BOTH are true.
  // WHY: texting law (TCPA) says we need a real number AND a checked consent box.
  const canSubmit = validPhone && consent && !sending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // stop the page from reloading
    setError('');
    setSending(true);

    try {
      await subscribe(digits, consent, source);
      setSuccess(true);
    } catch (err) {
      // err is "unknown" in TypeScript, so check it's an Error first
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSending(false); // runs whether it worked or failed
    }
  };

  // After a successful sign up, swap the form for a thank you message
  if (success) {
    return (
      <div className="glass rounded-[28px] p-8 text-center text-white" role="status">
        <p className="font-display text-3xl font-black">You're in! ✷</p>
        <p className="mt-3 text-blush">Watch your texts for your code. Reply STOP anytime to cancel.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass flex flex-col gap-4 rounded-[28px] p-6 text-white md:p-8">
      <h3 className="font-display text-2xl font-bold md:text-3xl">{title}</h3>

      {/* htmlFor matches the input id so tapping the label focuses the input */}
      <label htmlFor={`phone-${source}`} className="text-sm font-bold">
        Mobile number
      </label>
      <input
        id={`phone-${source}`}
        type="tel"            // tel = phones show the number keypad
        autoComplete="tel"    // lets the phone autofill their number
        placeholder="(314) 555-0123"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="min-h-14 rounded-full border border-white/30 bg-white/10 px-6 text-lg text-white placeholder:text-white/50 focus:outline-2 focus:outline-white"
      />

      <label className="flex items-start gap-3 text-xs leading-relaxed text-blush">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 size-5 shrink-0 accent-white"
        />
        <span>
          I agree to receive recurring marketing texts from Loc'd In at this number. Consent is not a condition
          of purchase. Msg &amp; data rates may apply. Msg frequency varies. Reply STOP to cancel, HELP for help.{' '}
          {/* TODO: point these at real pages once Morneice has them */}
          <a href="#" className="underline">Privacy Policy</a> · <a href="#" className="underline">SMS Terms</a>
        </span>
      </label>

      {error && <p className="font-bold text-blush">{error}</p>}

      <button
        type="submit"
        disabled={!canSubmit}
        className="min-h-14 rounded-full bg-white px-8 text-lg font-extrabold text-ruby transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {sending ? 'Sending...' : buttonText}
      </button>
    </form>
  );
}
