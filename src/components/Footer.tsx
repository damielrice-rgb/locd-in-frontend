// Footer.tsx — black footer with a last "book" push + contact info.
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-ink px-4 pb-10 pt-20 text-white md:px-14">
      <div className="mx-auto max-w-7xl">
        {/* Final call to action */}
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/15 pb-14">
          <h2 className="font-display text-4xl font-black tracking-tight md:text-6xl">
            Ready to get <span className="text-ruby-bright">Loc'd In?</span>
          </h2>
          <Link
            to="/book"
            className="inline-flex min-h-14 items-center rounded-full bg-ruby px-8 text-lg font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-ruby-bright"
          >
            Book an appointment
          </Link>
        </div>

        {/* 4 columns on desktop, stacks on phones (grid-cols-1 -> md:grid-cols-4) */}
        <div className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <p className="font-display text-xl font-black">LOC'D IN</p>
            <p className="font-script text-3xl">by Morneice</p>
            <p className="mt-3 text-white/60">Loc stylist in St. Louis, MO.</p>
          </div>
          <div>
            <p className="mb-3 font-bold text-ruby-bright">Visit</p>
            {/* TODO: fill these in with Morneice's real info */}
            <p className="text-white/70">[Neighborhood], St. Louis, MO</p>
            <p className="text-white/70">[Days and hours]</p>
          </div>
          <div>
            <p className="mb-3 font-bold text-ruby-bright">Explore</p>
            <ul className="flex flex-col gap-2 text-white/70">
              <li><a href="/#services" className="hover:text-white">Services</a></li>
              <li><a href="/#lookbook" className="hover:text-white">Lookbook</a></li>
              <li><Link to="/special" className="hover:text-white">New client special</Link></li>
              <li><Link to="/book" className="hover:text-white">Book now</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 font-bold text-ruby-bright">Connect</p>
            <a href="#" className="text-white/70 hover:text-white">Instagram [@handle]</a>
          </div>
        </div>

        {/* new Date().getFullYear() keeps the year current automatically */}
        <p className="text-sm text-white/40">© {new Date().getFullYear()} Loc'd In by Morneice · St. Louis, MO</p>
      </div>
    </footer>
  );
}
