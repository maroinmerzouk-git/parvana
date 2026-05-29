import Image from "next/image";
import { cn } from "@/lib/utils";

type Photo = { src: string; alt: string };

const colsClass: Record<number, string> = {
  1: "max-w-sm mx-auto",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

/**
 * A responsive band of photos. Each tile keeps a 4/5 portrait crop (the
 * orientation of most of the restaurant's photos) via object-cover.
 */
export function PhotoStrip({
  photos,
  className,
}: {
  photos: Photo[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4",
        colsClass[photos.length] ?? "sm:grid-cols-3",
        className,
      )}
    >
      {photos.map((p) => (
        <figure
          key={p.src}
          className="relative aspect-[4/5] overflow-hidden border border-ink/10 bg-sand"
        >
          <Image
            src={p.src}
            alt={p.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover"
          />
        </figure>
      ))}
    </div>
  );
}
