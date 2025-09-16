import logo from "../assets/logo.svg";

const logoStyle =
  "mx-auto w-56 sm:w-64 md:w-96 lg:w-[28rem] transition-all duration-500 ease-in-out";

export default function Logo() {
  return (
    <header className="py-6">
      <img src={logo} alt="Game Logo" className={logoStyle} />
    </header>
  );
}
