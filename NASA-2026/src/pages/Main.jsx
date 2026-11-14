import { Link } from "react-router";

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-8 w-1.5 rounded-full bg-[#e7f434]" />
      <h2 className="text-2xl font-bold text-[#0050d8] sm:text-3xl">
        {children}
      </h2>
    </div>
  );
}

export default function MainPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-[#1b2b85] to-[#0050d8] p-7 text-white shadow-xl sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e7f434]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#e7f434]">
          NASA Space Apps Challenge 2026
        </span>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
          The Earth Information Jukebox
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-blue-100 sm:text-lg">
          У рамках технічного завдання Хакатону NASA: Space App Challenge, теми
          The Earth Information Jukebox було розроблено{" "}
          <Link
            to="/tehnology"
            className="font-semibold text-[#e7f434] underline decoration-[#e7f434]/50 underline-offset-4 transition hover:decoration-[#e7f434]"
          >
            алгоритм створення
          </Link>{" "}
          аудіосупроводу на основі наданої відеомоделі викидів CO₂ мовою
          програмування Python.
        </p>
      </section>

      {/* Відео */}
      <section className="flex flex-col gap-4">
        <SectionTitle>Відео результату роботи алгоритму</SectionTitle>
        <div className="overflow-hidden rounded-2xl border border-[#1b2b85]/10 bg-black shadow-lg">
          <video
            controls
            playsInline
            preload="metadata"
            className="aspect-video w-full"
          >
            <source
              src={`${import.meta.env.BASE_URL}video/main.mp4`}
              type="video/mp4"
            />
            Ваш браузер не підтримує відтворення цього відео.
          </video>
        </div>
      </section>

      {/* Аудіо (поки без плеєра) */}
      <section className="flex flex-col gap-4">
        <SectionTitle>Аудіо результату роботи алгоритму</SectionTitle>
        {/* <div className="flex items-center gap-4 rounded-2xl border border-dashed border-[#1b2b85]/25 bg-white/70 p-6">
          <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#1b2b85]/10 text-[#1b2b85]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6"
              aria-hidden="true"
            >
              <path d="M9 18V5l12-2v13" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          </span>
          <div>
            <p className="font-semibold text-[#1b2b85]">
              Аудіо ще генерується
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Музичний супровід з&apos;явиться тут одразу після обробки відео.
            </p>
          </div>
        </div> */}
      </section>

      {/* Перехід до результатів */}
      <section className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="text-slate-700">
          Переглянути всі результати можна у вкладці{" "}
          <Link
            to="/songs"
            className="font-semibold text-[#0050d8] underline decoration-[#0050d8]/50 underline-offset-4 transition hover:decoration-[#0050d8]"
          >
            Мелодії
          </Link>
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/tehnology"
            className="inline-flex items-center justify-center rounded-xl bg-[#1b2b85] px-6 py-3 font-bold text-[#e7f434] shadow-md transition hover:-translate-y-0.5 hover:bg-[#16236b] hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b2b85]"
          >
            До алгоритму
          </Link>
          <Link
            to="/songs"
            className="inline-flex items-center justify-center rounded-xl border-2 border-[#1b2b85] bg-white px-6 py-3 font-bold text-[#1b2b85] transition hover:-translate-y-0.5 hover:bg-[#1b2b85] hover:text-[#e7f434] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b2b85]"
          >
            До мелодій
          </Link>
        </div>
      </section>
    </div>
  );
}
