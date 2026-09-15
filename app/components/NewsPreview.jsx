import React from "react";
import Link from "next/link";
import Section from "./Section";
import Reveal from "./Reveal";
import NewsCard from "./NewsCard";
import { ArrowRight } from "./Icons";
import { latestPosts } from "@/app/lib/news";

// The two most recent posts, on the way to the closing CTA.
//
// Placed here rather than higher up on purpose: an operator reading down the
// page has just been shown the catalogue, the roadmap and the diligence
// material. Integration news is the last piece of evidence — other people have
// already done this — and it sits immediately before the ask.
//
// "Recently shipped" deliberately mirrors the roadmap's "In production" above:
// the two sections are the same page read forwards and backwards, and the
// heading has to stay true when the newsroom carries a certification or a game
// release rather than an integration.
const POSTS = latestPosts(2);

export default function NewsPreview() {
  if (!POSTS.length) return null;

  return (
    <Section
      surface="base"
      rule
      aria-labelledby="news-heading"
      innerClassName="py-12 md:py-20"
    >
      <Reveal>
        {/* Not flex-wrap. The display face is wide enough that this heading
            fills a 1280px row on its own, so wrapping put "All news" on a line
            of its own under it with 60px of dead space above the cards. Letting
            the heading column shrink instead makes the headline wrap — which is
            what a headline is for — and keeps the link where the eye expects
            it, on the right of the rule it belongs to. */}
        <div className="flex flex-col items-start justify-between gap-1 md:flex-row md:items-end md:gap-8">
          <div className="min-w-0">
            <p className="font-SpaceGrotesk text-[12px] uppercase tracking-[0.08em] text-accent">
              Newsroom
            </p>
            <h2
              id="news-heading"
              className="mt-2 b4w-display !text-[clamp(2.1rem,1.3rem+2.4vw,3.1rem)] max-[359px]:!text-[1.8rem] !text-ink"
            >
              Recently shipped
            </h2>
          </div>
          {/* Negative margins cancel the quiet pill's own padding — 0.75rem
              horizontally so its text is flush with the gutter like everything
              else in this column, and 0.5rem vertically so it sits close to the
              heading it belongs to. The padding itself stays, so the tap target
              is the same size it was; only the box it reserves shrinks. */}
          <Link
            href="/news"
            className="b4w-btn b4w-btn--quiet -mx-3 -my-2 shrink-0 md:mx-0 md:my-0"
          >
            All news
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      <Reveal>
        <div className="mt-5 grid gap-5 md:mt-10 md:gap-6 md:grid-cols-2">
          {POSTS.map((post) => (
            <NewsCard key={post.slug} post={post} />
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
