import React from "react";
import PageShell from "@/app/components/PageShell";
import PageHeader from "@/app/components/PageHeader";
import NewsTabs from "@/app/components/NewsTabs";
import ClosingCta from "@/app/components/ClosingCta";
import Reveal from "@/app/components/Reveal";
import { allPosts, featuredImage } from "@/app/lib/news";
import { SITE_URL, SITE_NAME } from "@/app/lib/site";

const posts = allPosts();

export const metadata = {
  title: "News",
  description:
    "Integrations, game launches and casino launches from Bet4.win — the provably-fair remote gaming server for iGaming operators.",
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
        title="News"
        scene="keno-party"
        intro="Integrations, new originals and the casinos that launch them. Everything here is something that shipped — there are no announcements of announcements."
      />

      <section
        aria-labelledby="all-news"
        className="mx-auto max-w-[1280px] px-5 pb-20 pt-6 md:px-12"
      >
        {/* The tabs carry the counts; this names the section for assistive tech. */}
        <h2 id="all-news" className="sr-only">
          All news
        </h2>
        <Reveal>
          <NewsTabs posts={posts} />
        </Reveal>
      </section>

      <ClosingCta />
    </PageShell>
  );
}
