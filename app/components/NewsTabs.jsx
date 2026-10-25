"use client";
import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import { POST_TYPES } from "@/app/lib/news";

// The /news grid with a switch between kinds of post. The pick is kept in the
// URL (?type=games) so a filtered list can be linked to, and read back after
// mount rather than through useSearchParams, which would take the whole page
// off static rendering.
export default function NewsTabs({ posts }) {
  const tabs = [
    { id: "all", label: "All", posts },
    ...POST_TYPES.map((t) => ({ ...t, posts: posts.filter((p) => p.kicker === t.kicker) })),
  ].filter((t) => t.posts.length > 0);
  const [type, setType] = useState("all");

  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get("type");
    if (tabs.some((t) => t.id === asked)) setType(asked);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (id) => {
    setType(id);
    const url = new URL(window.location.href);
    if (id === "all") url.searchParams.delete("type");
    else url.searchParams.set("type", id);
    window.history.replaceState(null, "", url);
  };

  const shown = tabs.find((t) => t.id === type) ?? tabs[0];

  return (
    <>
      <div
        role="group"
        aria-label="Show posts of one kind"
        className="mb-8 grid grid-cols-2 gap-1 rounded-lg border border-white/15 bg-black/40 p-1 sm:flex sm:w-fit"
      >
        {tabs.map((t) => {
          const on = t.id === shown.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => pick(t.id)}
              aria-pressed={on}
              className={`flex shrink-0 items-center justify-center gap-2 rounded-md px-3 py-2 font-Text text-[13px] font-semibold transition-colors md:text-[14px] ${
                on ? "bg-white text-bg" : "text-ink/75 hover:bg-white/10 hover:text-ink"
              }`}
            >
              {t.label}
              <span className={`b4w-figure text-[12px] ${on ? "text-bg/60" : "text-ink/50"}`}>{t.posts.length}</span>
            </button>
          );
        })}
      </div>

      <div key={shown.id} className="grid gap-6 md:grid-cols-2">
        {shown.posts.map((post) => (
          <NewsCard key={post.slug} post={post} headingLevel="h3" />
        ))}
      </div>
    </>
  );
}
