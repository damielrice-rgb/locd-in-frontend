// Navbar.tsx — glass pill nav that floats over every page.
// CHANGED: no more Login / Register / Dashboard links.
// Clients just tap "Book now" and book as a guest.
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  // open = is the mobile menu showing? starts closed
  const [open, setOpen] = useState(false);

  // closes the mobile menu after someone taps a link
  const close = () => setOpen(false);

  return (
    // fixed = stays at the top while you scroll. z-50 = sits above everything.
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      {/* bg-ink/70 = 70% see-through black, so it's readable on red AND white sections */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-white/20 bg-ink/70 py-2 pl-6 pr-2 text-white backdrop-blur-xl">

        {/* Logo */}
        <Link to="/" onClick={close} className="flex items-baseline gap-1.5 text-white">
          <span className="font-display text-xl font-black tracking-tight">LOC'D IN</span>
          <span className="hidden font-script text-2xl leading-none sm:inline">with Mo</span>
        </Link>

        {/* Desktop links — hidden on phones, shown from md size up */}
        <div className="hidden items-center gap-7 text-[15px] font-bold md:flex">
          {/* <a> (not <Link>) for #section links so the browser scrolls to that section */}
          <a href="/#services" className="hover:text-blush">Services</a>
          <a href="/#lookbook" className="hover:text-blush">Lookbook</a>
          <a href="/#faq" className="hover:text-blush">FAQ</a>
          <Link to="/special" className="hover:text-blush">New client special</Link>
        </div>

        <div className="flex items-center gap-2">
          {/* The main button on every page — goes straight to the booking form */}
          <Link
            to="/book"
            onClick={close}
            className="inline-flex min-h-12 items-center rounded-full bg-white px-5 font-extrabold text-ruby transition hover:-translate-y-0.5"
          >
            Book now
          </Link>

          {/* Hamburger — only shows on phones (md:hidden) */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Open menu"
            aria-expanded={open}
            className="grid size-12 place-items-center rounded-full border border-white/25 md:hidden"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown — only shows when open is true */}
      {open && (
        <div className="mx-auto mt-2 flex max-w-7xl flex-col gap-1 rounded-3xl border border-white/20 bg-ink/90 p-4 font-bold text-white backdrop-blur-xl md:hidden">
          <a href="/#services" onClick={close} className="rounded-xl px-3 py-3 hover:bg-white/10">Services</a>
          <a href="/#lookbook" onClick={close} className="rounded-xl px-3 py-3 hover:bg-white/10">Lookbook</a>
          <a href="/#faq" onClick={close} className="rounded-xl px-3 py-3 hover:bg-white/10">FAQ</a>
          <Link to="/special" onClick={close} className="rounded-xl px-3 py-3 hover:bg-white/10">New client special</Link>
        </div>
      )}
    </header>
  );
}

export default Navbar;
