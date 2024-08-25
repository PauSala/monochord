import { Monochord } from "./components/Monochord";
import { megrim } from "./font";

export default function Home() {
  const className = megrim.className + " text-4xl";
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className={className}>Monochord</h1>
      <Monochord></Monochord>
    </main>
  );
}
