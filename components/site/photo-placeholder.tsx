import Image from "next/image";
import { cn } from "@/lib/utils";

type AspectRatio = "16/9" | "4/5" | "3/4" | "1/1" | "5/4";

const aspectClass: Record<AspectRatio, string> = {
  "16/9": "aspect-[16/9]",
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "1/1": "aspect-square",
  "5/4": "aspect-[5/4]",
};

export function PhotoPlaceholder({
  description,
  aspectRatio = "4/5",
  className,
}: {
  description: string;
  aspectRatio?: AspectRatio;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden border border-ink/10 bg-sand",
        aspectClass[aspectRatio],
        className,
      )}
    >
      <Image
        src="/placeholders/sand-tile.svg"
        alt=""
        fill
        unoptimized
        className="object-cover"
        aria-hidden
      />
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-beige/95 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-soft">
          Photo à venir
        </span>
        <span className="max-w-[60%] truncate text-right font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft/80">
          {description}
        </span>
      </div>
    </figure>
  );
}
