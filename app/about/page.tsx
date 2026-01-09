export const revalidate = false;

export default function AboutPage() {
  console.log("SSG: About page rendered at build time");

  return (
    <main>
      <h1>FloodGuard</h1>
      <p>
        FloodGuard is an early flood warning platform that visualizes flood risk
        using meteorological data and alerts residents in advance.
      </p>
    </main>
  );
}
