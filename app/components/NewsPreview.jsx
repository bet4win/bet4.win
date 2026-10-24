import React from "react";
import Link from "next/link";
import Section from "./Section";
import NewsArt from "./NewsArt";
import Arrive from "./Arrive";
import { ArrowRight } from "./Icons";
import { formatDate, latestPosts, readingMinutes } from "@/app/lib/news";

const [LEAD, ...REST] = latestPosts(4);

const facts = (post) =>
  [post.kicker, post.partner?.name, `${readingMinutes(post)} min read`].filter(Boolean);

// The latest post leads, at the size of a front page story; the next three
// run down the side as a list. Release announcements and partner
// integrations, so it is the last piece of evidence before the ask: other
// people have already done this integration.
export default function NewsPreview() {
  if (!LEAD) return null;

  return (
    <Section surface="base" aria-labelledby="news-heading" innerClassName="py-14 md:py-16">
      <div className="flex items-end justify-between gap-4 md:gap-8">
        <h2
          id="news-heading"
          className="b4w-display !mb-0 !text-[clamp(1.8rem,1.2rem+2vw,3rem)] !text-ink"
        >
          Recent news
        </h2>
        <Link href="/news" className="b4w-btn b4w-btn--quiet shrink-0">
          All news
          <span className="b4w-arrow-loop">
            <ArrowRight className="h-4 w-4" />
            <ArrowRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <Arrive className="mt-8 grid gap-10 md:mt-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-12">
        <article>
          <Link
            href={`/news/${LEAD.slug}`}
            className="group flex flex-col gap-5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
          >
            <NewsArt
              post={LEAD}
              sizes="(min-width:992px) 680px, 92vw"
              aspect="aspect-[1200/630] lg:aspect-[16/9]"
              className="rounded-lg"
            />
            <div className="flex flex-col gap-3">
              <p className="!mb-0 font-Text text-[14px] text-muted">
                <time dateTime={LEAD.date} className="b4w-figure text-ink">
                  {formatDate(LEAD.date)}
                </time>
                {facts(LEAD).map((f) => (
                  <span key={f}> · {f}</span>
                ))}
              </p>
              <h3 className="!mb-0 font-Display !text-[clamp(1.4rem,1.1rem+1.1vw,2.1rem)] font-extrabold !leading-[1.08] tracking-[-0.02em] !text-ink underline decoration-transparent decoration-2 underline-offset-[6px] transition-colors [font-stretch:115%] [text-wrap:balance] group-hover:decoration-white/40">
                {LEAD.title}
              </h3>
              <p className="!mb-0 line-clamp-3 max-w-2xl b4w-copy--lead font-Text text-ink/75">{LEAD.dek}</p>
            </div>
          </Link>
        </article>

        <ol className="!mb-0 flex list-none flex-col p-0 lg:justify-between">
          {REST.map((post, i) => (
            <li key={post.slug} className="border-t border-line py-5 first:border-t-0 first:pt-0 last:pb-0">
              <Link
                href={`/news/${post.slug}`}
                className="group grid grid-cols-[112px_minmax(0,1fr)] items-center gap-4 rounded-lg sm:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] sm:gap-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand"
              >
                <NewsArt
                  post={post}
                  index={i + 1}
                  sizes="(min-width:992px) 200px, (min-width:576px) 40vw, 112px"
                  aspect="aspect-[4/3]"
                  className="rounded-lg"
                />
                <div className="flex min-w-0 flex-col gap-2">
                  <p className="!mb-0 font-Text text-[13px] text-muted">
                    <time dateTime={post.date} className="b4w-figure text-ink">
                      {formatDate(post.date)}
                    </time>
                    {post.kicker && <span> · {post.kicker}</span>}
                  </p>
                  <h3 className="!mb-0 font-Text !text-[15px] font-bold sm:!text-[clamp(1rem,0.92rem+0.35vw,1.15rem)] !leading-snug !text-ink underline decoration-transparent underline-offset-4 transition-colors [text-wrap:balance] group-hover:decoration-white/40">
                    {post.title}
                  </h3>
                  <p className="!mb-0 hidden font-Text text-[14px] leading-snug text-muted sm:line-clamp-2">{post.dek}</p>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </Arrive>
    </Section>
  );
}
