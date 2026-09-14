// Trade shows we're exhibiting at, shown in the strip above the header.
//
// `end` is the last day of the show, inclusive. upcomingEvents() keeps an event
// visible through the whole of that day and drops it afterwards, so the bar
// empties itself instead of advertising a show that finished last week. Both
// entries below close on 2026-10-01; without the expiry rule the strip would go
// stale on 2026-10-02 and stay that way until someone noticed.
//
// Dates and venues verified against the organisers' own sites on 2026-09-14.
export const events = [
  {
    id: "sbc-summit-2026",
    name: "SBC Summit",
    dates: "29 Sep – 1 Oct 2026",
    start: "2026-09-29",
    end: "2026-10-01",
    location: "Feira Internacional de Lisboa, Lisbon",
    url: "https://sbcevents.com/sbc-summit/?promo=sbcmrktng-kbM3Cea6",
  },
];

// Parsed as UTC midnight, then advanced to the end of that day, so an event is
// still "upcoming" while its final day is being held anywhere in the world.
function endOfShow(event) {
  return Date.parse(`${event.end}T23:59:59Z`);
}

export function upcomingEvents(now = Date.now()) {
  return events
    .filter((e) => endOfShow(e) >= now)
    .sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
}
