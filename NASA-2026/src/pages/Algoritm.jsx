import { ActionLink, PageHero, SectionTitle } from "../assets/ui";

const STEPS = [
  {
    title: "Frame-by-frame video analysis",
    text: "The video is decoded with ffmpeg; frames are downscaled and read pixel by pixel. For each frame, the set of colors present in the image is determined.",
  },
  {
    title: "Color filtering",
    text: "Pixels are checked against the red channel range, saturation, and hue. White, gray, and cool colors are filtered out to keep only the warm shades of emissions.",
  },
  {
    title: "Four colors → four notes",
    text: "Each warm pixel is assigned to the nearest of the four target colors. The share of each color in the frame determines the volume of the corresponding note.",
  },
  {
    title: "Music synthesis",
    text: "Four voices with smooth transitions between frames, a soft timbre, and stereo panning form the audio track. Loudness is normalized, and silence remains wherever no colors are present.",
  },
  {
    title: "Result assembly",
    text: "The finished audio is added to the video and saved as MP4. A separate audio file with the generated melody is also created.",
  },
];

export default function AlgoritmDescription() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <PageHero badge="Technology" title="Processing algorithm">
        Video of CO₂ emissions is converted into music: the color of a frame
        determines the note, and its share in the frame determines the volume.
        All processing runs locally in Python.
      </PageHero>

      <section className="flex flex-col gap-5">
        <SectionTitle>How it works</SectionTitle>

        <ol className="flex flex-col gap-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="flex gap-4 rounded-2xl bg-white p-5 shadow-md sm:p-6"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#1b2b85] font-bold text-[#e7f434]">
                {index + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold text-[#1b2b85]">
                  {step.title}
                </h3>
                <p className="mt-1 leading-relaxed text-slate-600">
                  {step.text}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-[#1b2b85] to-[#0050d8] p-6 text-white shadow-xl sm:p-8">
        <h2 className="text-2xl font-bold text-[#e7f434]">
          Algorithm code is openly available
        </h2>
        <p className="max-w-3xl leading-relaxed text-blue-100">
          You are free to download this algorithm from the GitHub repository to
          run it locally, explore the implementation, or adapt it to your own
          videos and CO₂ emissions scenarios.
        </p>
        <a
          href="https://github.com/ytre12/NASA-hakaton-2026"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-xl bg-[#e7f434] px-6 py-3 font-bold text-[#1b2b85] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e7f434]"
        >
          Go to the GitHub repository
          <span aria-hidden="true">→</span>
        </a>
      </section>

      <section className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="text-slate-700">
          Generated melodies can be listened to in the results tab.
        </p>
        <ActionLink to="/songs">Browse melodies</ActionLink>
      </section>
    </div>
  );
}
