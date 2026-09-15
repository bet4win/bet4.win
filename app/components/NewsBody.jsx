import React from "react";

// Renders a post's block list (see data/news.js for the shape).
//
// The wrapper is `.b4w-prose`, the same long-form typography the policy pages
// use — a news post and a terms page are both columns of running text, and
// having two sets of prose rules to keep in step is how they drift apart.
//
// The default branch renders unknown blocks as plain paragraphs rather than
// dropping them. A typo in a `type` should show up as copy in the wrong style,
// which someone will notice, and not as a paragraph that silently never
// appeared, which nobody will.
export default function NewsBody({ blocks }) {
  return (
    <div className="b4w-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "h2":
            return <h2 key={i}>{block.text}</h2>;
          case "ul":
            return (
              <ul key={i}>
                {block.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            );
          case "pull":
            // The one display-face moment in the body. Not a quotation — there
            // is nobody to attribute it to — so it is set as a statement with a
            // rule beside it rather than in quote marks.
            return (
              <p
                key={i}
                className="my-8 border-l-2 border-accent py-1 pl-5 b4w-display !text-[clamp(1.15rem,0.95rem+0.7vw,1.45rem)] !leading-[1.15] !text-ink"
              >
                {block.text}
              </p>
            );
          case "p":
          default:
            return <p key={i}>{block.text}</p>;
        }
      })}
    </div>
  );
}
