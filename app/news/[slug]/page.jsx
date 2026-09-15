import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import NewsBody from "@/app/components/NewsBody";
import NewsCard from "@/app/components/NewsCard";
import ClosingCta from "@/app/components/ClosingCta";
import Reveal from "@/app/components/Reveal";
import { ArrowLeft, ArrowUpRight } from "@/app/components/Icons";
import {
  allPosts,
  featuredImage,
  formatDate,
  postBySlug,
  readingMinutes,
} from "@/app/lib/news";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};

  // The post's own featured image doubles as its share card — it is already
  // 1200x630 and already says which two names are involved, which is exactly
  // what a link preview needs to carry.
  const art = featuredImage(post);

  return {
    title: post.title,
    description: post.dek,
    alternates: { canonical: `/news/${post.slug}` },
    openGraph: {
      type: "article",
      url: `/news/${post.slug}`,
      title: post.title,
      description: post.dek,
      publishedTime: post.date,
      images: [{ url: art.src, width: art.width, height: art.height, alt: art.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.dek,
      images: [art.src],
    },
  };
}

export default async function NewsPostPage({ params }) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const others = allPosts().filter((p) => p.slug !== post.slug);
  const art = featuredImage(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.dek,
    datePublished: post.date,
    // No separate dateModified: nothing here is edited after publication, and
    // claiming a modification date we don't track would be worse than omitting
    // the field.
    url: `${SITE_URL}/news/${post.slug}`,
    image: `${SITE_URL}${art.src}`,
    // The organisation is the author. There are no bylines on this site, and
    // inventing a person to fill the field would put a fictional name in
    // structured data that search engines republish.
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}/news#blog` },
    inLanguage: "en",
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        eyebrow={post.kicker}
        title={post.title}
        intro={post.dek}
        titleSize="sm"
      >
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line/50 pt-5 font-SpaceGrotesk text-[11px] uppercase tracking-[0.07em] text-faint">
          <time
            dateTime={post.date}
            className="font-JetBrainsMono tracking-[0.04em] text-muted tabular-nums"
          >
            {formatDate(post.date)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{readingMinutes(post)} min read</span>
          {post.partner && (
            <>
              <span aria-hidden="true">·</span>
              <a
                href={post.partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 !text-muted transition-colors hover:!text-accent focus-visible:!text-accent focus-visible:outline-none"
              >
                {post.partner.name}
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </>
          )}
        </div>
      </PageHeader>

      {/* The body column is capped at a readable measure (~70 characters) but
          stays LEFT-aligned inside the site's own 1280 container rather than
          being centred in the viewport. Centring it put the first paragraph
          160px to the right of the headline directly above it, which reads as
          two unrelated pages stacked. */}
      <div className="mx-auto max-w-[1280px] px-5 pb-16 pt-10 md:px-12">
        {/* 720px — the same measure the policy pages settle at once their own
            container's padding is taken off, so the two long-form page types
            set to the same line length. */}
        <article className="max-w-[720px]">
          {/* Described here, unlike on the cards: as the hero it is the first
              thing on the page, and there is no adjacent headline yet doing the
              same job. `priority` because it is the LCP element. */}
          <Image
            src={art.src}
            alt={art.alt}
            width={art.width}
            height={art.height}
            priority
            sizes="(min-width:768px) 720px, 92vw"
            className="mb-10 h-auto w-full rounded-2xl border border-line"
          />

          <NewsBody blocks={post.body} />

          <div className="mt-12 border-t border-line/50 pt-6">
            <Link href="/news" className="b4w-btn b4w-btn--quiet !pl-0">
              <ArrowLeft className="h-4 w-4" />
              All news
            </Link>
          </div>
        </article>
      </div>

      {others.length > 0 && (
        <section
          aria-labelledby="more-news"
          className="mx-auto max-w-[1280px] px-5 pb-20 md:px-12"
        >
          <Reveal>
            <h2
              id="more-news"
              className="mb-6 font-SpaceGrotesk !text-[12px] !font-normal uppercase !tracking-[0.1em] !text-faint"
            >
              More news
            </h2>
          </Reveal>
          <Reveal>
            <div className="grid gap-6 md:grid-cols-2">
              {others.map((p) => (
                <NewsCard key={p.slug} post={p} headingLevel="h3" />
              ))}
            </div>
          </Reveal>
        </section>
      )}

      <ClosingCta />
    </PageShell>
  );
}
