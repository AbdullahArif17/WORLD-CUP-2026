import RadioWave from "@/components/ui/RadioWave";

export default function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-sm border border-live-red/40 bg-live-red/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-live-red">
      <RadioWave />
      Live
    </span>
  );
}
