import { posts } from "@/data/news";
import { newsArt } from "@/data/newsArt";

// Newest first. Everything that lists posts goes through this rather than
// reading `posts` directly, so the order is decided in one place and a post
// added at the bottom of the data file still appears at the top of the page.
export function allPosts() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
}

export function latestPosts(count) {
  return allPosts().slice(0, count);
}

export function postBySlug(slug) {
  return posts.find((p) => p.slug === slug) || null;
}

// Every post has one, and the filename is looked up rather than stored on the
// post: scripts/generate-news-images.mjs writes the image AND data/newsArt.js in
// the same pass, so the name in the map is always the file that is on disk. A
// `src` typed into data/news.js would be a second place for the same string to
// be wrong.
//
// The name carries a hash of the image's own bytes (news-art.1a2b3c4d.jpg).
// That is the cache key: browsers, the CDN and every social scraper that has
// unfurled the URL all cache this file hard, and under a stable name none of
// them would ever look again. Re-cut a card and the URL changes by itself.
//
// A slug with no entry has never been generated. It resolves to a path that
// 404s, on purpose — a visibly broken picture is louder than a post quietly
// shipping without art, and the fix is one command.
//
// 1200x630 is the Open Graph size: the card art and the share card are
// deliberately the same file.
export function featuredImage(post) {
  return {
    src: `/assets/img/news/${newsArt[post.slug] || `${post.slug}.NOT-GENERATED.jpg`}`,
    alt: post.image?.alt || post.title,
    width: 1200,
    height: 630,
  };
}

// Rendered on the server AND on a hydrated client, so the timezone has to be
// pinned: "2026-09-08" parsed as local time is 7 September in anything west of
// UTC, and the server and the reader are rarely in the same place. Parsing as
// UTC midnight and formatting in UTC makes the string the same everywhere.
export function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Counts the words a reader actually reads — headings and list items included,
// pull quotes too, since they are set at display size and cost time to take in.
// 200wpm is the slow end of the usual range; overestimating the effort is the
// safer error for a page asking someone to start reading.
export function readingMinutes(post) {
  const words = post.body.reduce((n, block) => {
    const text =
      block.type === "ul" ? block.items.join(" ") : block.text || "";
    return n + text.split(/\s+/).filter(Boolean).length;
  }, post.title.split(/\s+/).length + post.dek.split(/\s+/).length);
  return Math.max(1, Math.round(words / 200));
}
