// Home.tsx — the main Loc'd In page (/)
// Sections top to bottom: Hero, Marquee, Services, Lookbook, About,
// How to book, Reviews, Text Club, FAQ, Footer.
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getServices } from '../api/server';
import type { Service } from '../types/service';
import Marquee from '../components/Marquee';
import SpinBadge from '../components/SpinBadge';
import ServiceCard from '../components/ServiceCard';
import TextClubForm from '../components/TextClubForm';
import Faq from '../components/Faq';
import Footer from '../components/Footer';

// ===== Page content =====
// WHY up here: the text is easy to find and edit without digging through the HTML.

// The rotating words in the headline. The first word is added again at the
// end in the JSX so the loop back to the start is smooth.
const ROTATING_WORDS = ['Retwisted.', 'Started right.', 'Repaired.', 'Styled.', 'Kid-ready.'];

const MARQUEE_WORDS = ['Loc Retwists', 'Starter Locs', 'Loc Repair', 'Barrel Twists', "Kids' Locs", 'Loc Styles', 'St. Louis, MO'];

// Photos in public/media/bg. "/media/..." works because Vite serves the public folder at the root.
const LOOKBOOK = [
  { src: '/media/bg/retwist-overhead-black.jpg', label: 'Fresh retwist' },
  { src: '/media/bg/retwist-side-profile-red.jpg', label: "Men's retwist" },
  { src: '/media/bg/retwist-barrel-green-black.jpg', label: 'Barrel twists' },
  { src: '/media/bg/loc-loop-updo-ombre-red.jpg', label: 'Loop updo' },
  { src: '/media/bg/kids-loc-buns-black.jpg', label: "Kids' loc buns" },
  { src: '/media/bg/ginger-locs-highpony-red.jpg', label: 'Color + high pony' },
];

// How booking works — no account needed now
const STEPS = [
  { number: '01', title: 'Pick your service', text: 'Retwist, starter locs, repair, or a style. Prices are right on the menu.' },
  { number: '02', title: 'Choose a day & time', text: 'Tap a time that works, then add your name and mobile number. No account needed.' },
  { number: '03', title: 'Get your text', text: "Your confirmation is texted to you right away, and Morneice gets one too. That's it." },
];

const FAQS = [
  { question: 'How often should I get my locs retwisted?', answer: 'Most clients book a retwist every 4 to 6 weeks. Morneice will recommend a schedule based on your hair, your scalp, and how you wear your locs.' },
  { question: "Do you do kids' locs and starter locs?", answer: "Yes. Kids are welcome for starter locs, retwists, and styles. Book with the parent's phone number and add your child's name in the notes." },
  { question: "Where is Loc'd In located in St. Louis?", answer: '[Neighborhood or area], St. Louis, MO. The exact address is texted to you after you book.' },
  { question: 'Do I need an account to book?', answer: 'Nope. Pick a service and time, add your name and phone number, and your confirmation is texted to you.' },
  { question: 'How do I change or cancel?', answer: '[Add the cancellation policy, for example how much notice Morneice needs.] Call or text Morneice at the number in your confirmation text.' },
];

function Home() {
  const [services, setServices] = useState<Service[]>([]);

  // NEW: loading + error so the page doesn't look empty or broken while the API wakes up
  // (Render's free plan "sleeps", so the first load can take ~30 seconds)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // hash = the "#faq" part of the URL
  const { hash } = useLocation();

  useEffect(() => {
    getServices()
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error(error);
        setError('Services are taking a second to load. Refresh the page or tap Book now.');
      })
      .finally(() => {
        setLoading(false); // runs whether it worked or not
      });
  }, []);

  // Scroll to the section named in the URL, like /#faq.
  // WHY: coming from another page, the browser looks for #faq before React has
  // built this page, so it stays at the top. We run this again when loading
  // ends because the service cards push the lower sections down the page.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    }
  }, [hash, loading]);

  // CHANGED: "Book" goes straight to the guest booking page with the service picked.
  // No login check anymore.
  const handleBook = (serviceId: string) => {
    navigate(`/book?service=${serviceId}`);
  };

  return (
    // -mt-28 slides the red hero up under the floating navbar
    <div className="-mt-28 overflow-hidden">

      {/* ================= HERO (red) ================= */}
      <header className="bg-ruby-glow relative px-4 pb-24 pt-40 text-white md:px-14">

        {/* floating glass shapes — aria-hidden because they're only decoration */}
        <div aria-hidden="true" className="floaty glass absolute -left-28 top-64 size-[360px] rounded-full" />
        <div aria-hidden="true" className="floaty-slow absolute bottom-16 right-[6%] size-44 rotate-[18deg] rounded-[48px] border border-white/15 bg-ink/20 backdrop-blur-md" />

        {/* flex-wrap = text and video sit side by side on desktop, stack on phones */}
        <div className="relative z-10 mx-auto flex max-w-7xl flex-wrap items-center gap-12">
          <div className="min-w-0 flex-[999_1_520px]">
            <p className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-ink/30 px-4 py-2 text-sm font-bold tracking-wide">
              <span className="pulse-dot size-2 rounded-full bg-white" />
              Loc stylist · St. Louis, MO · By appointment
            </p>

            {/* 10.5vw on phones so the longest rotating word still fits on small screens */}
            <h1 className="font-display text-[clamp(32px,10.5vw,44px)] font-black leading-[1.02] tracking-tight md:text-[clamp(44px,5.6vw,96px)]">
              St. Louis locs,
              <br />
              {/* rot = the 1-line "window", rot-inner = the words sliding through it */}
              <span className="rot">
                <span className="rot-inner">
                  {ROTATING_WORDS.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                  {/* first word again so the loop is seamless */}
                  <span aria-hidden="true">{ROTATING_WORDS[0]}</span>
                </span>
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-blush md:text-xl">
              Neat parts, healthy roots, and styles that last. Book your retwist, starter locs, or loc repair with
              Morneice online in under a minute. No account needed.
            </p>

            <div className="mt-9 flex flex-wrap gap-3.5">
              <Link to="/book" className="inline-flex min-h-14 items-center rounded-full bg-ink px-8 text-lg font-extrabold text-white transition hover:-translate-y-0.5">
                Book an appointment
              </Link>
              <a href="#services" className="glass inline-flex min-h-14 items-center rounded-full px-8 text-lg font-extrabold text-white transition hover:-translate-y-0.5">
                See services &amp; prices
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-7 font-bold text-blush">
              <span>✷ Retwists from $75</span>
              <span>✷ Kids welcome</span>
              <span>✷ Text confirmations</span>
            </div>
          </div>

          {/* Glass video frame */}
          <div className="relative flex flex-[1_1_380px] justify-center">
            <div className="glass relative aspect-[3/4] w-full max-w-[420px] rounded-[36px] p-3 shadow-[0_40px_80px_rgba(40,0,8,.45)]">
              {/* muted + playsInline are REQUIRED for autoplay on iPhones.
                  poster = the picture that shows while the video loads. */}
              <video
                src="/media/motion/hero-reel-red.mp4"
                poster="/media/motion/hero-reel-red-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Reel of loc styles by Morneice"
                className="size-full rounded-[26px] object-cover"
              />
              <div className="absolute -left-4 bottom-14 rounded-2xl bg-white/90 px-4 py-3 text-ink shadow-xl backdrop-blur md:-left-7">
                <p className="text-xs font-extrabold uppercase tracking-widest text-ruby">Most booked</p>
                <p className="mt-1 font-display text-lg font-bold">Retwist · $75</p>
              </div>
              {/* hidden on phones so it doesn't hang off the screen */}
              <SpinBadge className="absolute -right-11 -top-10 hidden md:block" />
            </div>
          </div>
        </div>
      </header>

      {/* ================= MARQUEE ================= */}
      <Marquee items={MARQUEE_WORDS} />

      {/* ================= SERVICES (white) ================= */}
      {/* id="services" is what the "/#services" links scroll to */}
      <section id="services" className="scroll-mt-28 bg-white px-4 py-24 md:px-14">
        <div className="mx-auto max-w-7xl">
          <p className="font-script text-4xl text-ruby">the menu</p>
          <h2 className="font-display text-4xl font-black tracking-tight md:text-6xl">Loc services in St. Louis</h2>
          <p className="mt-4 max-w-2xl text-lg text-ink/70">
            From your very first starter locs to your monthly retwist, every service starts with a scalp check and
            ends with a style you'll want to show off.
          </p>

          {/* show ONE of these: loading, error, or the cards */}
          {loading && <p className="mt-12 font-bold text-ruby">Loading services...</p>}

          {error && <p className="mt-12 font-bold text-ruby">{error}</p>}

          {/* 1 column on phones, 2 on tablets, 3 on desktop */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} onBook={handleBook} />
            ))}
          </div>
        </div>
      </section>

      {/* ================= LOOKBOOK (black) ================= */}
      <section id="lookbook" className="scroll-mt-28 bg-ink px-4 py-24 text-white md:px-14">
        <div className="mx-auto max-w-7xl">
          <p className="font-script text-4xl text-ruby-bright">the work</p>
          <h2 className="font-display text-4xl font-black tracking-tight md:text-6xl">The Loc'd In lookbook</h2>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            Real St. Louis clients, real chairs. Retwists, barrel twists, loc updos, kids' styles, and color.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="glass rounded-[32px] p-3">
              <video
                src="/media/motion/lookbook-black.mp4"
                poster="/media/motion/lookbook-black-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                aria-label="Lookbook reel of loc styles"
                className="aspect-[3/4] size-full rounded-[24px] object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {LOOKBOOK.map((photo) => (
                <figure key={photo.src} className="zoom relative overflow-hidden rounded-3xl">
                  <img src={photo.src} alt={`${photo.label} by Morneice, St. Louis loc stylist`} loading="lazy" className="aspect-[3/4] size-full object-cover" />
                  <figcaption className="glass absolute inset-x-3 bottom-3 rounded-full px-4 py-2 text-sm font-bold">
                    {photo.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          <Link to="/book" className="mt-10 inline-flex min-h-14 items-center rounded-full bg-ruby px-8 text-lg font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-ruby-bright">
            Get this look · Book now
          </Link>
        </div>
      </section>

      {/* ================= ABOUT (red) ================= */}
      <section id="about" className="bg-ruby-glow relative px-4 py-24 text-white md:px-14">
        {/* floating cutout photo — only on very wide screens (2xl).
            WHY: on anything smaller it sits behind the text and makes it harder to read. */}
        <img src="/media/cut/ginger-locs-back.png" alt="" aria-hidden="true" className="floaty pointer-events-none absolute -right-10 top-10 hidden w-72 opacity-90 2xl:block" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          {/* TODO: swap this box for a real photo of Morneice */}
          <div className="glass grid aspect-[4/5] place-items-center rounded-[36px] text-center">
            <p className="font-bold">[Photo of Morneice]</p>
          </div>

          <div>
            <p className="font-script text-4xl">meet your stylist</p>
            {/* lg:text-6xl (not md) because this column is too narrow for "Morneice." on tablets */}
            <h2 className="font-display text-4xl font-black tracking-tight lg:text-6xl">Hi, I'm Morneice.</h2>
            <p className="mt-5 text-lg leading-relaxed text-blush">
              Loc'd In is my St. Louis loc studio. I care about healthy roots, clean parts, and locs that still look
              fresh weeks later. Whether you're starting your loc journey, keeping up with retwists, or bringing in
              your little one, you'll leave knowing exactly how to care for your locs at home.
            </p>
            <p className="mt-4 text-blush">[Add your story: how long you've been doing locs and what makes your chair different.]</p>

            {/* md:grid-cols-1 stacks the cards in the half-width column.
                WHY: 3 across is too narrow there, and "confirmations" spills out of its card. */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
              {[
                { title: 'Scalp-first care', text: 'Every visit starts with a root and scalp check.' },
                { title: 'Kid-friendly chair', text: "Patient appointments for little loc'ers." },
                { title: 'Text confirmations', text: 'Book in a minute and get your details by text.' },
              ].map((card) => (
                <div key={card.title} className="glass rounded-3xl p-5">
                  <p className="font-display font-bold">{card.title}</p>
                  <p className="mt-2 text-sm text-blush">{card.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW TO BOOK (white) ================= */}
      <section className="bg-white px-4 py-24 md:px-14">
        <div className="mx-auto max-w-7xl">
          <p className="font-script text-4xl text-ruby">easy booking</p>
          <h2 className="font-display text-4xl font-black tracking-tight md:text-6xl">Booked in 3 steps</h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number} className="lift rounded-[28px] border border-line p-8">
                <p className="font-display text-5xl font-black text-ruby">{step.number}</p>
                <h3 className="mt-4 font-display text-xl font-bold">{step.title}</h3>
                <p className="mt-2 text-ink/70">{step.text}</p>
              </div>
            ))}
          </div>

          <Link to="/book" className="mt-10 inline-flex min-h-14 items-center rounded-full bg-ruby px-8 text-lg font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-ruby-deep">
            Book my appointment
          </Link>
        </div>
      </section>

      {/* ================= REVIEWS (black) ================= */}
      <section className="bg-ink px-4 py-24 text-white md:px-14">
        <div className="mx-auto max-w-7xl">
          <p className="font-script text-4xl text-ruby-bright">kind words</p>
          <h2 className="font-display text-4xl font-black tracking-tight md:text-6xl">What St. Louis is saying</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {/* TODO: paste REAL client reviews only (with their OK) */}
            {[1, 2, 3].map((n) => (
              <figure key={n} className="glass rounded-[28px] p-8">
                <p aria-hidden="true" className="font-display text-6xl leading-none text-ruby-bright">“</p>
                <blockquote className="mt-2 text-lg">[Paste a real client review here.]</blockquote>
                <figcaption className="mt-4 font-bold text-white/60">[Client first name], [St. Louis neighborhood]</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ================= TEXT CLUB (red) ================= */}
      <section id="textclub" className="bg-ruby-glow px-4 py-24 text-white md:px-14">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <img src="/media/motion/gif-offer-red.gif" alt="Loc styles cycling on a red backdrop" loading="lazy" className="aspect-[4/5] w-full rounded-[36px] object-cover" />
          <div>
            <p className="font-bold uppercase tracking-widest text-blush">Loc'd In Text Club</p>
            <h2 className="mt-3 font-display text-4xl font-black tracking-tight md:text-5xl">Get [$10] off your first retwist</h2>
            <p className="mb-8 mt-4 text-lg text-blush">
              Be first to know when chairs open up in St. Louis, plus members-only deals and retwist reminders.
            </p>
            <TextClubForm title="Join by text" buttonText="Text me the deal" source="home" />
          </div>
        </div>
      </section>

      {/* ================= FAQ (white) ================= */}
      <section id="faq" className="scroll-mt-28 bg-white px-4 py-24 md:px-14">
        <div className="mx-auto max-w-3xl">
          <p className="font-script text-4xl text-ruby">good to know</p>
          <h2 className="mb-10 font-display text-4xl font-black tracking-tight md:text-6xl">Loc questions, answered</h2>
          <Faq items={FAQS} />
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
