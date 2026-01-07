export const dynamic = "force-dynamic";

type WeatherResponse = {
  name: string;
  main: { temp: number };
};

async function getLiveWeather(): Promise<WeatherResponse> {
  const res = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=67b689a4575dbfc21068b28b8d054f47",
    { cache: "no-store" }
  );
  return res.json();
}

export default async function DashboardPage() {
  console.log("SSR: Dashboard rendered at", new Date().toISOString());

  const data = await getLiveWeather();

  return (
    <main>
      <h1>Live Flood Dashboard</h1>
      <p>City: {data.name}</p>
      <p>Temperature: {Math.round(data.main.temp - 273)}°C</p>
      <p>Flood Risk: 🔴 High</p>
    </main>
  );
}
