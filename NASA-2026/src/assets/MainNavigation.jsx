import { Link } from "react-router";

export default function MainNavigation() {
  return (
    <nav className="flex justify-around">
      <Link to="/">Головна</Link>
      <Link to="/songs">Мелодії</Link>
      <Link to="/tehnology">Алгоритм обробки</Link>
    </nav>
  );
}
