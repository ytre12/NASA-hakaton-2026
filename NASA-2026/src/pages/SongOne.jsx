import { Link } from "react-router";

export default function SongOne() {
  return (
    <main>
      <h1>Трек 1</h1>
      <p>Зразок пісні</p>
      <audio controls preload="metadata" className="w-full max-w-2xl">
        <source
          src={`${import.meta.env.BASE_URL}songs/output_music.mp3`}
          type="audio/mpeg"
        />
        Ваш браузер не підтримує відтворення цього файлу.
      </audio>

      <p>
        <Link to="/songs">← Назад до мелодій</Link>
      </p>
    </main>
  );
}
