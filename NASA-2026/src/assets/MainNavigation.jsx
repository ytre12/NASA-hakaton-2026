import { NavLink } from "react-router";

function Icon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 shrink-0 desk:size-6"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const LINKS = [
  {
    to: "/",
    label: "Home",
    end: true,
    icon: (
      <Icon>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M10 21v-6h4v6" />
      </Icon>
    ),
  },
  {
    to: "/songs",
    label: "Melodies",
    icon: (
      <Icon>
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </Icon>
    ),
  },
  {
    to: "/tehnology",
    label: "Algorithm",
    icon: (
      <Icon>
        <rect x="6" y="6" width="12" height="12" rx="2" />
        <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
      </Icon>
    ),
  },
];

export default function MainNavigation() {
  return (
    // Мобільні (<820px): кнопки в рядок. Від 820px: вертикальний список.
    <nav
      aria-label="Main navigation"
      className="flex flex-row gap-2 desk:flex-col desk:gap-3"
    >
      {LINKS.map(({ to, label, end, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          title={label}
          className={({ isActive }) =>
            [
              "group flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border px-2 py-3",
              "text-center text-[11px] font-semibold transition duration-200",
              "desk:flex-row desk:justify-start desk:gap-3 desk:px-4 desk:py-3 desk:text-left desk:text-sm",
              isActive
                ? "border-[#e7f434] bg-[#e7f434]/15 text-white shadow-lg shadow-black/25"
                : "border-white/10 bg-white/5 text-blue-100 hover:-translate-y-0.5 hover:border-[#e7f434]/60 hover:bg-white/10 hover:text-white",
            ].join(" ")
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`transition-colors ${
                  isActive
                    ? "text-[#e7f434]"
                    : "text-blue-200 group-hover:text-[#e7f434]"
                }`}
              >
                {icon}
              </span>
              <span className="min-w-0 break-words leading-tight">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
