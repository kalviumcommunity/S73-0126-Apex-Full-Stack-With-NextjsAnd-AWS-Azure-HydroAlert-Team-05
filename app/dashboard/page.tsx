export const dynamic = "force-dynamic";

type WeatherResponse = {
  name: string;
  main: { temp: number };
};

async function getLiveWeather(): Promise<WeatherResponse> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=${process.env.OPENWEATHER_API_KEY}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return res.json();
}

export default async function DashboardPage() {
  console.log("SSR: Dashboard rendered at", new Date().toISOString());

  const data = await getLiveWeather();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Live Flood Dashboard</h1>

      <section>
        <p>
          <strong>City:</strong> {data.name}
        </p>
        <p>
          <strong>Temperature:</strong> {Math.round(data.main.temp - 273.15)}°C
        </p>
        <p>
          <strong>Flood Risk:</strong> 🔴 High
        </p>
      </section>
    </main>
  );
}
