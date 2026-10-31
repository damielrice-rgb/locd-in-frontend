// Marquee.tsx — the black strip of words that scrolls forever.
// We pass the words in as a prop so Home and Landing can reuse it.

interface MarqueeProps {
  items: string[];
}

export default function Marquee({ items }: MarqueeProps) {
  // Put the list in TWICE. The CSS slides the track -50%, so the second
  // copy lands exactly where the first started = seamless loop.
  const doubled = [...items, ...items];

  return (
    // overflow-hidden hides the words that are off screen
    <div className="overflow-hidden bg-ink py-6 text-white" aria-label={items.join(', ')}>
      <div className="marquee-track" aria-hidden="true">
        {doubled.map((item, index) => (
          // index in the key because the same word shows up twice
          <span key={`${item}-${index}`} className="flex items-center gap-14 whitespace-nowrap font-display text-2xl font-bold md:text-3xl">
            {item}
            <span className="text-ruby-bright">✷</span>
          </span>
        ))}
      </div>
    </div>
  );
}
