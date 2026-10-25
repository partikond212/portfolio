import { logout } from "../api/login";

export default function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="rounded-full border-2 border-ink px-5 py-2 font-semibold"
      >
        Выйти
      </button>
    </form>
  );
}
