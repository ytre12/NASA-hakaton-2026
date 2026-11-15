import { Outlet } from "react-router";

import MainNavigation from "../assets/MainNavigation";

function BrandHeader({ className = "" }) {
  return (
    <header className={`bg-[#1b2b85] px-5 py-4 text-white desk:px-7 desk:py-6 ${className}`}>
      <h1 className="text-2xl font-extrabold tracking-tight desk:text-3xl">
        Tetra-Solution
      </h1>
      <p className="mt-1 text-sm font-medium text-[#e7f434] desk:text-base">
        The Earth Information Jukebox
      </p>
    </header>
  );
}

export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f6ff] text-slate-900 pb-24 desk:flex-row desk:pb-0">
      {/* На мобільних шапка стоїть зверху окремо, а не разом із меню внизу */}
      <BrandHeader className="w-full desk:hidden" />

      {/* Меню: до 820px — фіксоване знизу; 820–1079px — 250px; від 1080px — 300px */}
      <aside className="fixed inset-x-0 bottom-0 z-50 w-full shrink-0 bg-[#1b2b85] text-white shadow-[0_-6px_20px_rgba(0,0,0,0.25)] desk:sticky desk:top-0 desk:bottom-auto desk:left-auto desk:right-auto desk:order-first desk:h-screen desk:w-[250px] desk:overflow-y-auto desk:shadow-none wide:w-[300px]">
        <div className="flex h-full flex-col">
          <BrandHeader className="hidden desk:block" />

          <div className="flex flex-1 flex-col gap-8 p-3 desk:p-6">
            <MainNavigation />

            <p className="mt-auto hidden text-xs leading-relaxed text-blue-200/70 desk:block">
              NASA Hackathon 2026 · The Earth Information Jukebox
            </p>
          </div>
        </div>
      </aside>

      {/* Основний контент: решта ширини */}
      <main className="min-w-0 flex-1 p-5 desk:p-8">
        <Outlet />
      </main>
    </div>
  );
}
