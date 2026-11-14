import { Outlet } from "react-router";

import MainNavigation from "../assets/MainNavigation";

function BrandHeader({ className = "" }) {
  return (
    <header className={`bg-[#1b2b85] px-5 py-4 text-white sm:px-7 sm:py-6 ${className}`}>
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
        Tetra-Solution
      </h1>
      <p className="mt-1 text-sm font-medium text-[#e7f434] sm:text-base">
        The Earth Information Jukebox
      </p>
    </header>
  );
}

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6ff] text-slate-900 sm:flex-row">
      {/* На мобільних шапка стоїть зверху окремо, а не разом із меню внизу */}
      <BrandHeader className="w-full sm:hidden" />

      {/* Бічне меню: від 640px — фіксовані 250px (не звужується), до 640px — знизу */}
      <aside className="order-last w-full shrink-0 bg-[#1b2b85] text-white sm:sticky sm:top-0 sm:order-first sm:h-screen sm:w-[250px] sm:overflow-y-auto">
        <div className="flex h-full flex-col">
          <BrandHeader className="hidden sm:block" />

          <div className="flex flex-1 flex-col gap-8 p-5 sm:p-6">
            <MainNavigation />

            <p className="mt-auto hidden text-xs leading-relaxed text-blue-200/70 sm:block">
              NASA Hackathon 2026 · The Earth Information Jukebox
            </p>
          </div>
        </div>
      </aside>

      {/* Основний контент: решта ширини */}
      <main className="min-w-0 flex-1 p-5 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
