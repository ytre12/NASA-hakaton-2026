import { createBrowserRouter, RouterProvider, Link } from "react-router";

import MainPage from "./pages/Main";
import SongsPage from "./pages/Songs";
import RootLayout from "./pages/Root";
import AlgoritmDescription from "./pages/Algoritm";
import SongOne from "./pages/SongOne";

// BASE_URL на GitHub Pages = "/NASA-hakaton-2026/", а basename
// очікує шлях без завершального слеша.
const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { path: "/", element: <MainPage /> },
        {
          path: "/songs",
          children: [
            { index: true, element: <SongsPage /> },
            { path: "song-1", element: <SongOne /> },
          ],
        },
        { path: "/tehnology", element: <AlgoritmDescription /> },
      ],
    },
  ],
  {
    // На GitHub Pages застосунок лежить у підпапці /NASA-hakaton-2026/,
    // тому роутер має відрізати цей префікс перед зіставленням маршрутів.
    basename,
  }
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
