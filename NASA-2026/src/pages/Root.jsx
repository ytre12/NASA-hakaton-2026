import { Outlet } from "react-router";

import MainNavigation from "../assets/MainNavigation";

export default function RootLayout() {
  return (
    <>
      <header>Tetra-Solution</header>
      <MainNavigation />
      <Outlet />
    </>
  );
}
