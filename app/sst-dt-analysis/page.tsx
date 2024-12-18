import { JKD } from "./JKD";
import ParetoDtSst from "./ParetoDtSst";

const sampleData = [
  { Reason: "Механо", MTTR: 2.5, TotalEvents: 30 },
  { Reason: "Електро", MTTR: 1.8, TotalEvents: 45 },
  { Reason: "Технологични", MTTR: 3.2, TotalEvents: 20 },
  { Reason: "Системни", MTTR: 0.9, TotalEvents: 60 },
  { Reason: "ППР", MTTR: 4.5, TotalEvents: 15 },
];

export default function SstDowntimeAnalysisPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* <JKD data={sampleData} /> */}
      <ParetoDtSst sampleData={sampleData} />
    </main>
  );
}
