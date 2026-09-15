import React from "react";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import NewsCard from "@/app/components/NewsCard";
import ClosingCta from "@/app/components/ClosingCta";
import Reveal from "@/app/components/Reveal";
import { allPosts, featuredImage } from "@/app/lib/news";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";

const posts = allPosts();

export const metadata = {
  title: "News",
  description:
    "Integrations, platform releases and catalogue news from Bet4.win — the provably-fair remote gaming server for iGaming operators.",
  alternates: { canonical: "/news" },
};

// A Blog with its posts inlined, so a search engine can resolve the index and
// the individual articles as one publication rather than as five unrelated URLs.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_URL}/news#blog`,
  name: `${SITE_NAME} news`,
  url: `${SITE_URL}/news`,
  publisher: { "@id": `${SITE_URL}/#organization` },
  blogPost: posts.map((p) => ({
    "@type": "NewsArticle",
    headline: p.title,
    description: p.dek,
    datePublished: p.date,
    url: `${SITE_URL}/news/${p.slug}`,
    image: `${SITE_URL}${featuredImage(p).src}`,
  })),
};

export default function NewsIndexPage() {
  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageHeader
        eyebrow="Newsroom"
        title="News"
        intro="Integrations, platform releases and new originals. Everything here is something that shipped — there are no announcements of announcements."
      />

      <section
        aria-labelledby="all-news"
        className="mx-auto max-w-[1280px] px-5 pb-20 pt-6 md:px-12"
      >
        <Reveal>
          <h2
            id="all-news"
            className="mb-8 font-SpaceGrotesk !text-[12px] !font-normal uppercase !tracking-[0.1em] !text-faint"
          >
            {posts.length} {posts.length === 1 ? "post" : "posts"}
          </h2>
        </Reveal>
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post) => (
              <NewsCard key={post.slug} post={post} headingLevel="h3" />
            ))}
          </div>
        </Reveal>
      </section>

      <ClosingCta />
    </PageShell>
  );
}
