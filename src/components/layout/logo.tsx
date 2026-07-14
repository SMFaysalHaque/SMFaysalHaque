import Image from "next/image";

import { cn } from "@/lib/utils";
import { profile } from "@/data/profile";

/** Signature wordmark used in the navbar and footer. */
export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt={profile.name}
      width={1536}
      height={441}
      priority
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
