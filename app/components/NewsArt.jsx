import React from "react";
import Image from "next/image";
import { featuredImage } from "@/app/lib/news";
import { artFor } from "@/data/gameArt";

// A post's picture. A release post (`<game>-release`) is shown in that game's
// own room with its hero standing in it — the same composition the lobby and
// the game page use, so the newsroom looks like the rest of the site. Anything
// else (a partner integration) keeps its generated card.
//
// featuredImage() is untouched and still feeds the post's og:image: a social
// card needs one flat file, and that is what the generator produces.
export default function NewsArt({ post, priority = false, sizes, className = "", alt = "" }) {
  const game = post.slug.endsWith("-release") ? artFor(post.slug.slice(0, -"-release".length)) : null;

  if (!game) {
    const art = featuredImage(post);
    return (
      <div className={`relative aspect-[1200/630] overflow-hidden bg-bg ${className}`}>
        <Image src={art.src} alt={alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`relative isolate aspect-[1200/630] overflow-hidden bg-bg ${className}`}>
      <Image
        src={game.scene}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="-z-10 object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <Image
        src={game.art}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="!inset-y-[8%] !h-[84%] object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:-translate-y-1.5"
      />
    </div>
  );
}
