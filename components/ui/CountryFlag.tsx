import Image from "next/image";
import { getCountryFlag } from "@/lib/images";

interface CountryFlagProps {
  countryName?: string | null;
  className?: string;
}

export default function CountryFlag({
  countryName,
  className = "",
}: CountryFlagProps) {
  const src = getCountryFlag(countryName);

  if (!src) return null;

  return (
    <Image
      src={src}
      alt={`${countryName} flag`}
      width={32}
      height={20}
      className={`h-5 w-8 rounded-sm object-cover ${className}`}
      unoptimized
    />
  );
}
