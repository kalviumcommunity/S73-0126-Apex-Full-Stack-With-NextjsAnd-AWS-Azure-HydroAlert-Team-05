export const revalidate = 60;

type DistrictRisk = {
  id: number;
  name: string;
  risk: "LOW" | "MEDIUM" | "HIGH";
};

async function getDistrictRisks(): Promise<DistrictRisk[]> {
  return [
    { id: 1, name: "Aluva", risk: "HIGH" },
    { id: 2, name: "Kochi", risk: "MEDIUM" },
    { id: 3, name: "Thrissur", risk: "LOW" },
  ];
}

export default async function DistrictsPage() {
  console.log("ISR page generated at", new Date().toISOString());

  const districts = await getDistrictRisks();

  return (
    <main>
      <h1>District Flood Risk</h1>
      <ul>
        {districts.map((d) => (
          <li key={d.id}>
            {d.name} —{" "}
            {d.risk === "HIGH" ? "🔴" : d.risk === "MEDIUM" ? "🟡" : "🟢"}
          </li>
        ))}
      </ul>
    </main>
  );
}
