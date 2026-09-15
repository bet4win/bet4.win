import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "./Icons";
import { featuredImage, formatDate, readingMinutes } from "@/app/lib/news";

// One post, as a card. Shared by the homepage strip and the /news index so a
// post looks the same wherever it is listed.
export default function NewsCard({ post, headingLevel: H = "h3" }) {
  const art = featuredImage(post);

  return (
    <article className="h-full">
      <Link
        href={`/news/${post.slug}`}
        // Not `.b4w-card`: that family owns `transform` for the pointer tilt and
        // disables text selection, both of which belong to a piece of key art
        // you are about to launch rather than to a paragraph you are about to
        // read. A colour change on the border is the whole hover here.
        className="b4w-bezel group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-panel-high transition-colors duration-300 hover:border-accent/50 focus-visible:border-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {/* The generated lockup, at its native 1200x630. `alt=""` because the
            headline directly underneath says the same thing — announcing
            "Bet4.win and Revolver Gaming side by side" and then reading the
            title that states it in words is the same fact twice. The post page,
            where the image is the hero rather than a thumbnail, does describe
            it. */}
        <div className="relative aspect-[1200/630] overflow-hidden border-b border-line/70 bg-bg">
          <Image
            src={art.src}
            alt=""
            fill
            sizes="(min-width:992px) 560px, (min-width:768px) 46vw, 92vw"
            className="object-cover transition-[scale] duration-500 group-hover:scale-[1.03]"
          />
        </div>

        <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 font-SpaceGrotesk text-[10px] font-semibold uppercase tracking-[0.1em] text-accent">
              {post.kicker}
            </span>
            {post.partner && (
              <span className="font-SpaceGrotesk text-[11px] uppercase tracking-[0.07em] text-muted">
                {post.partner.name}
              </span>
            )}
            {/* Mono and pushed to the end: a date is a figure, and it is the one
                thing a reader scanning a list of posts sorts on. */}
            <time
              dateTime={post.date}
              className="ml-auto font-JetBrainsMono text-[11px] uppercase tracking-[0.04em] text-faint tabular-nums"
            >
              {formatDate(post.date)}
            </time>
          </div>

          <H className="!mb-0 b4w-display !text-[clamp(1.2rem,0.95rem+0.8vw,1.55rem)] !leading-[1.02] !text-ink [text-wrap:balance]">
            {post.title}
          </H>

          <p className="!mb-0 font-SpaceGrotesk text-[0.9rem] leading-[1.6] text-muted">
            {post.dek}
          </p>

          <div className="mt-auto flex items-center justify-between gap-3 border-t border-line/70 pt-4">
            <span className="inline-flex items-center gap-2 font-SpaceGrotesk text-[11px] font-semibold uppercase tracking-[0.08em] text-accent">
              Read
              <ArrowRight className="h-3.5 w-3.5 transition-[translate] duration-300 group-hover:translate-x-1" />
            </span>
            <span className="font-SpaceGrotesk text-[11px] uppercase tracking-[0.06em] text-faint">
              {readingMinutes(post)} min read
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
