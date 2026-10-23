import React from "react";
import Link from "next/link";
import NewsArt from "./NewsArt";
import { formatDate, readingMinutes } from "@/app/lib/news";

// One post. Shared by the homepage strip and the /news index so a post looks
// the same wherever it is listed. No box around it: the picture, a line of
// facts, the headline and the dek, the way a newsroom lists a story.
export default function NewsCard({ post, headingLevel: H = "h3" }) {
  const facts = [post.kicker, post.partner?.name, `${readingMinutes(post)} min read`].filter(
    Boolean,
  );

  return (
    <article className="h-full">
      <Link
        href={`/news/${post.slug}`}
        className="group flex h-full flex-col gap-4 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
      >
        {/* `alt=""` because the headline directly underneath says the same
            thing. The post page, where the picture is the hero rather than a
            thumbnail, does describe it. */}
        <NewsArt
          post={post}
          sizes="(min-width:992px) 560px, (min-width:768px) 46vw, 92vw"
          className="rounded-lg"
        />

        <p className="!mb-0 font-Text text-[14px] text-muted">
          <time dateTime={post.date} className="b4w-figure text-ink">
            {formatDate(post.date)}
          </time>
          {facts.map((f) => (
            <span key={f}> · {f}</span>
          ))}
        </p>

        <H className="!mb-0 font-Text !text-[clamp(1.1rem,0.95rem+0.55vw,1.4rem)] font-bold !leading-snug !text-ink underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-line [text-wrap:balance]">
          {post.title}
        </H>

        <p className="!mb-0 b4w-copy font-Text text-muted">{post.dek}</p>
      </Link>
    </article>
  );
}
