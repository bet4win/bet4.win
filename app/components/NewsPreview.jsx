import React from "react";
import Link from "next/link";
import Section from "./Section";
import NewsCard from "./NewsCard";
import { ArrowRight } from "./Icons";
import { latestPosts } from "@/app/lib/news";

const POSTS = latestPosts(2);

// The two most recent posts. Release announcements and partner integrations,
// so it is the last piece of evidence before the ask: other people have already
// done this integration.
export default function NewsPreview() {
  if (!POSTS.length) return null;

  return (
    <Section
      surface="raised"
      aria-labelledby="news-heading"
      innerClassName="py-14 md:py-20"
    >
      <div className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end md:gap-8">
        <h2
          id="news-heading"
          className="b4w-display !mb-0 !text-[clamp(1.7rem,1.2rem+1.6vw,2.4rem)] !text-ink"
        >
          Recently shipped
        </h2>
        <Link href="/news" className="b4w-btn b4w-btn--quiet -ml-1 shrink-0 md:ml-0">
          All news
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2">
        {POSTS.map((post) => (
          <NewsCard key={post.slug} post={post} />
        ))}
      </div>
    </Section>
  );
}
