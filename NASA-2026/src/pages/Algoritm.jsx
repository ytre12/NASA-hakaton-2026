import { ActionLink, PageHero, SectionTitle } from "../assets/ui";

const STEPS = [
  {
    title: "Покадровий аналіз відео",
    text: "Відео декодується через ffmpeg, кадри зменшуються та читаються попіксельно. Для кожного кадру визначається набір кольорів, присутніх на зображенні.",
  },
  {
    title: "Фільтрація кольорів",
    text: "Пікселі проходять перевірку за діапазоном червоного каналу, насиченістю та відтінком. Білі, сірі та холодні кольори відсікаються, щоб залишити лише теплі відтінки викидів.",
  },
  {
    title: "Чотири кольори → чотири ноти",
    text: "Кожен теплий піксель відноситься до найближчого з чотирьох цільових кольорів. Частка кожного кольору в кадрі визначає гучність відповідної ноти.",
  },
  {
    title: "Синтез музики",
    text: "Чотири голоси з плавними переходами між кадрами, м'яким тембром і стереопанорамою формують аудіодоріжку. Гучність нормалізується, а тиша залишається там, де кольорів немає.",
  },
  {
    title: "Збірка результату",
    text: "Готове аудіо додається до відео та зберігається як MP4. Додатково створюється окремий аудіофайл із згенерованою мелодією.",
  },
];

export default function AlgoritmDescription() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10">
      <PageHero badge="Технологія" title="Алгоритм обробки">
        Відео з викидами CO₂ перетворюється на музику: колір кадру визначає
        ноту, а його частка в кадрі — гучність. Уся обробка відбувається
        локально на Python.
      </PageHero>

      <section className="flex flex-col gap-5">
        <SectionTitle>Як це працює</SectionTitle>

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

      <section className="flex flex-col gap-5 rounded-2xl bg-white p-6 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="text-slate-700">
          Послухати згенеровані мелодії можна у вкладці результатів.
        </p>
        <ActionLink to="/songs">До мелодій</ActionLink>
      </section>
    </div>
  );
}
