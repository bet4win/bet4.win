import React from "react";
import Link from "next/link";
import Section from "./Section";
import NewsCard from "./NewsCard";
import Arrive from "./Arrive";
import { ArrowRight } from "./Icons";
import { latestPosts } from "@/app/lib/news";

const POSTS = latestPosts(4);

// The four most recent posts — a full screen has room for a row of four. Release announcements and partner integrations,
// so it is the last piece of evidence before the ask: other people have already
// done this integration.
export default function NewsPreview() {
  if (!POSTS.length) return null;

  return (
    <Section
      surface="base"
      aria-labelledby="news-heading"
      innerClassName="py-16 md:py-24"
    >
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end md:gap-8">
        <h2
          id="news-heading"
          className="b4w-display !mb-0 !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
        >
          Recent news
        </h2>
        <Link href="/news" className="b4w-btn b4w-btn--quiet -ml-1 shrink-0 md:ml-0">
          All news
          <span className="b4w-arrow-loop">
            <ArrowRight className="h-4 w-4" />
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <Arrive className="mt-8 grid gap-x-6 gap-y-10 md:mt-10 md:grid-cols-2 lg:grid-cols-4">
        {POSTS.map((post, i) => (
          <NewsCard key={post.slug} post={post} compact index={i} />
        ))}
      </Arrive>
    </Section>
  );
}
