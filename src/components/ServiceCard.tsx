// ServiceCard.tsx — one card in the services menu.
// The service data (name, price, description) still comes from YOUR API.
// The only new thing: we pick a GIF based on the service name.
import type { Service } from '../types/service';

interface ServiceCardProps {
  service: Service;
  onBook: (serviceId: string) => void; // Home decides what "Book" does
}

// Match a service name to a GIF in public/media/motion.
// WHY: the database doesn't store images, so we match on words in the name.
// If nothing matches, we fall back to the retwist GIF.
function getGif(name: string) {
  const n = name.toLowerCase();
  if (n.includes('starter')) return '/media/motion/gif-starter-locs.gif';
  if (n.includes('repair')) return '/media/motion/gif-loc-repair.gif';
  if (n.includes('style')) return '/media/motion/gif-loc-styles.gif';
  if (n.includes('braid')) return '/media/motion/gif-braids.gif';
  if (n.includes('crochet') || n.includes('curl')) return '/media/motion/gif-crochet.gif';
  return '/media/motion/gif-retwist.gif';
}

export default function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    // lift + zoom are our custom hover animations from index.css
    <article className="lift zoom flex flex-col overflow-hidden rounded-[28px] border border-line bg-white">
      <div className="aspect-[4/3] overflow-hidden bg-ink">
        {/* loading="lazy" = don't download the GIF until it's close to the screen (faster page) */}
        <img src={getGif(service.name)} alt={`${service.name} by Morneice in St. Louis`} loading="lazy" className="size-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-bold">{service.name}</h3>
          <span className="font-display text-xl font-bold text-ruby">${service.price}</span>
        </div>
        <p className="flex-1 leading-relaxed text-ink/70">{service.description}</p>

        <button
          onClick={() => onBook(service._id)}
          className="mt-2 min-h-12 rounded-full bg-ruby px-6 font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-ruby-deep"
        >
          Book {service.name}
        </button>
      </div>
    </article>
  );
}
