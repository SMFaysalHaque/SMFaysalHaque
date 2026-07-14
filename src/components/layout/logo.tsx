import Image from "next/image";

import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";

/** Signature wordmark used in the navbar and footer. */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo-source.png"
      alt={profile.name}
      width={1536}
      height={496}
      priority
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
