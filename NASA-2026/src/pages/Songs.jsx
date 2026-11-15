import { MediaPlaceholder, PageHero } from "../assets/ui";

const SONGS = [
  {
    title: "First melody",
    description:
      "Global CO2 ppm for January-March of 2020. This camera move orbits the Earth from a distance.",
    audio: "main.mp3",
    video: { type: "file", src: "main.mp4" },
  },
  {
    title: "Second melody",
    description:
      "Global CO2 ppm for January-March of 2020. This camera move zooms in on the eastern United States.",
    audio: "videoeastedit.mp3",
    video: { type: "youtube", id: "Kz6TuIggX-E" },
  },
  {
    title: "Third melody",
    description:
      "Global CO2 ppm for January-March of 2020. This camera move zooms in on the western United States.",
    audio: "videowestedit.mp3",
    video: { type: "youtube", id: "2_LgGxUnqls" },
  },
  {
    title: "Fourth melody",
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
          title={`Melody video: ${song.title}`}
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
        Your browser does not support video playback.
      </video>
    );
  }

  return (
    <MediaPlaceholder
      kind="video"
      title="Video not added yet"
      note="The video will appear once processing is complete."
    />
  );
}

export default function SongsPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <PageHero badge="Results" title="All melodies">
        Melodies generated from CO₂ emissions videos are collected here.
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
                  Melody video
                </h3>
                <SongVideo song={song} />
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Melody audio
                </h3>
                {song.audio ? (
                  <audio controls preload="metadata" className="w-full">
                    <source
                      src={`${import.meta.env.BASE_URL}songs/${song.audio}`}
                      type="audio/mpeg"
                    />
                    Your browser does not support playback of this file.
                  </audio>
                ) : (
                  <MediaPlaceholder
                    kind="audio"
                    title="Audio not added yet"
                    note="The music track will appear after generation."
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
