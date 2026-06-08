import { HikeFinder } from "@/components/HikeFinder";
import { HikingResources } from "@/components/HikingResources";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-100">
      <HikeFinder />
      <div className="pb-12">
        <HikingResources />
      </div>
    </div>
  );
}
