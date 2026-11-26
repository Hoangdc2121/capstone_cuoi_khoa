export default function AuthBackground() {
  return (
    <section
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 hidden bg-background lg:block"
    >
      <img
        src="/img/light_auth.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-700 dark:opacity-0"
      />

      <img
        src="/img/dark_auth.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-700 dark:opacity-100"
      />
    </section>
  );
}
