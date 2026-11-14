import { MediaPlaceholder, PageHero } from "../assets/ui";

const SONGS = [
  {
    title: "Перша мелодія",
    description:
      "Опис відео та те, що воно означає, які результати демонструє ця мелодія.",
    audio: "main.mp3",
  },
  {
    title: "Друга мелодія",
    description:
      "Опис відео та те, що воно означає, які результати демонструє ця мелодія.",
    audio: "us-east.mp3",
  },
  {
    title: "Третя мелодія",
    description:
      "Опис відео та те, що воно означає, які результати демонструє ця мелодія.",
    audio: "us-west.mp3",
  },
];

export default function SongsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <PageHero badge="Результати" title="Всі мелодії">
        Тут зібрані мелодії, згенеровані з відео викидів CO₂. Відео та аудіо
        з&apos;являться тут одразу після обробки матеріалів.
      </PageHero>

      <div className="flex flex-col gap-8">
        {SONGS.map((song, index) => (
          <section
            key={song.title}
            className="rounded-2xl bg-white p-6 shadow-md sm:p-8"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#1b2b85] font-bold text-[#e7f434]">
                {index + 1}
              </span>
              <h2 className="text-2xl font-bold text-[#0050d8]">
                {song.title}
              </h2>
            </div>

            <p className="mt-4 text-slate-600">{song.description}</p>

            <div className="mt-6 flex flex-col gap-5">
              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Відео мелодії
                </h3>
                <MediaPlaceholder
                  kind="video"
                  title="Відео ще не додано"
                  note="Відео з'явиться після завершення обробки."
                />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Аудіо мелодії
                </h3>
                {song.audio ? (
                  <audio controls preload="metadata" className="w-full">
                    <source
                      src={`${import.meta.env.BASE_URL}songs/${song.audio}`}
                      type="audio/mpeg"
                    />
                    Ваш браузер не підтримує відтворення цього файлу.
                  </audio>
                ) : (
                  <MediaPlaceholder
                    kind="audio"
                    title="Аудіо ще не додано"
                    note="Музичний супровід з'явиться після генерації."
                  />
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
