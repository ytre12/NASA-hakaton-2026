import { Link } from "react-router";

import { PageHero, SectionTitle } from "../assets/ui";

export default function SongOne() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <PageHero badge="Мелодія" title="Трек 1">
        Зразок мелодії, згенерованої з відео викидів CO₂.
      </PageHero>

      <section className="rounded-2xl bg-white p-6 shadow-md sm:p-8">
        <SectionTitle>Аудіо</SectionTitle>
        <audio controls preload="metadata" className="mt-5 w-full">
          <source
            src={`${import.meta.env.BASE_URL}songs/output_music.mp3`}
            type="audio/mpeg"
          />
          Ваш браузер не підтримує відтворення цього файлу.
        </audio>
      </section>

      <Link
        to="/songs"
        className="inline-flex w-fit items-center gap-2 rounded-xl border-2 border-[#1b2b85] bg-white px-5 py-2.5 font-bold text-[#1b2b85] transition hover:-translate-y-0.5 hover:bg-[#1b2b85] hover:text-[#e7f434] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1b2b85]"
      >
        ← Назад до мелодій
      </Link>
    </div>
  );
}
