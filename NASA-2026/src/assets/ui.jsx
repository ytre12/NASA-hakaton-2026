import { Link } from "react-router";

export function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-8 w-1.5 rounded-full bg-[#e7f434]" />
      <h2 className="text-2xl font-bold text-[#0050d8] sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

export function PageHero({ badge, title, children }) {
  return (
    <section className="rounded-3xl bg-gradient-to-br from-[#1b2b85] to-[#0050d8] p-7 text-white shadow-xl sm:p-10">
      {badge && (
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f434]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#e7f434]">
          {badge}
        </span>
      )}
      <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {children && (
        <div className="mt-4 max-w-3xl text-base leading-relaxed text-blue-100 sm:text-lg">
          {children}
        </div>
      )}
    </section>
  );
}

export function ActionLink({ to, children, variant = "primary" }) {
  const styles =
    variant === "primary"
      ? "bg-[#1b2b85] text-[#e7f434] shadow-md hover:bg-[#16236b] hover:shadow-lg"
      : "border-2 border-[#1b2b85] bg-white text-[#1b2b85] hover:bg-[#1b2b85] hover:text-[#e7f434]";

  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded-xl px-6 py-3 font-bold transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b2b85] ${styles}`}
    >
      {children}
    </Link>
  );
}

function VideoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m10 9 5 3-5 3V9Z" />
    </svg>
  );
}

function AudioIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-7"
      aria-hidden="true"
    >
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

export function MediaPlaceholder({ kind = "video", title, note }) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#1b2b85]/20 bg-[#f4f6ff] p-6 text-center">
      <span className="grid size-12 place-items-center rounded-xl bg-[#1b2b85]/10 text-[#1b2b85]">
        {kind === "video" ? <VideoIcon /> : <AudioIcon />}
      </span>
      <p className="font-semibold text-[#1b2b85]">{title}</p>
      {note && <p className="max-w-xs text-sm text-slate-500">{note}</p>}
    </div>
  );
}
