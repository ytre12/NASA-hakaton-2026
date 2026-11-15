import { MediaPlaceholder, PageHero } from "../assets/ui";

const SONGS = [
  {
    title: "Перша мелодія",
    description:
      "Global CO2 ppm for January-March of 2020. This camera move orbits the Earth from a distance.",
    audio: "main.mp3",
    video: { type: "file", src: "main.mp4" },
  },
  {
    title: "Друга мелодія",
    description:
      "Global CO2 ppm for January-March of 2020. This camera move zooms in on the eastern United States.",
    audio: "videoeastedit.mp3",
    video: { type: "youtube", id: "Kz6TuIggX-E" },
  },
  {
    title: "Третя мелодія",
    description:
      "Global CO2 ppm for January-March of 2020. This camera move zooms in on the western United States.",
    audio: "videowestedit.mp3",
    video: { type: "youtube", id: "2_LgGxUnqls" },
  },
  {
    title: "Четверта мелодія",
    description:
      "Global CO2 ppm for January-March of 2020. This camera move is more experimental and attempts to fly through the data, starting from the East coast and heading west. The middle of the video is quite dark because of the density of the CO2.",
    audio: "prorotypeedit.mp3",
    video: { type: "youtube", id: "tr93XeWa1cs" },
  },
];

function SongVideo({ song }) {
  if (song.video?.type === "youtube") {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
        <iframe
          className="size-full"
          src={`https://www.youtube-nocookie.com/embed/${song.video.id}`}
          title={`Відео мелодії: ${song.title}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }

  if (song.video?.type === "file") {
    return (
      <video
        controls
        preload="metadata"
        className="w-full rounded-2xl"
        src={`${import.meta.env.BASE_URL}video/${song.video.src}`}
      >
        Ваш браузер не підтримує відтворення цього відео.
      </video>
    );
  }

  return (
    <MediaPlaceholder
      kind="video"
      title="Відео ще не додано"
      note="Відео з'явиться після завершення обробки."
    />
  );
}

export default function SongsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <PageHero badge="Результати" title="Всі мелодії">
        Тут зібрані мелодії, згенеровані з відео викидів CO₂.
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
                <SongVideo song={song} />
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
