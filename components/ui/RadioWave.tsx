export default function RadioWave() {
  return (
    <span className="relative flex h-4 w-4 items-center justify-center" aria-hidden="true">
      <span className="absolute h-2 w-2 rounded-full bg-live-red" />
      <span className="absolute h-2 w-2 animate-radio-wave rounded-full border border-live-red motion-reduce:animate-none" />
      <span
        className="absolute h-2 w-2 animate-radio-wave rounded-full border border-live-red motion-reduce:animate-none"
        style={{ animationDelay: "0.6s" }}
      />
    </span>
  );
}
