// Faq.tsx — accordion of questions.
// <details> and <summary> are built into HTML: click to open/close,
// no useState needed. The CSS in index.css turns the + into an x.

export interface FaqItem {
  question: string;
  answer: string;
}

export default function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details key={item.question} className="rounded-3xl border border-line bg-white px-6 py-5">
          <summary className="flex items-center justify-between gap-4 font-display text-lg font-bold">
            {item.question}
            <span className="plus grid size-9 shrink-0 place-items-center rounded-full bg-ruby text-xl text-white">+</span>
          </summary>
          <p className="mt-4 leading-relaxed text-ink/70">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
