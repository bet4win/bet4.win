// Thumbnails are statically imported (not referenced as /public string paths)
// so the build emits them to /_next/static/media with a content hash. That
// makes their URLs change whenever the bytes change, so they can be cached
// immutably (1yr) with no risk of serving stale art. next/image uses the
// hashed file as its optimization source.
import crash from "@/public/assets/img/icons/thumbnails3/crash.jpg";
import mines from "@/public/assets/img/icons/thumbnails3/mines.jpg";
import plinko from "@/public/assets/img/icons/thumbnails3/plinko.jpg";
import dice from "@/public/assets/img/icons/thumbnails3/dice.jpg";
import wheel from "@/public/assets/img/icons/thumbnails3/wheel.jpg";
import diamonds from "@/public/assets/img/icons/thumbnails3/diamonds.jpg";
import keno from "@/public/assets/img/icons/thumbnails3/keno.jpg";
import limbo from "@/public/assets/img/icons/thumbnails3/limbo.jpg";
import dragon from "@/public/assets/img/icons/thumbnails3/dragon2.jpg";
import chicken from "@/public/assets/img/icons/thumbnails3/chicken.jpg";
import hilo from "@/public/assets/img/icons/thumbnails3/hilo.jpg";
import punch from "@/public/assets/img/icons/thumbnails3/punch.jpg";

export const games = [
  {
    id: "15",
    category: "Originals",
    title: "Crash",
    image: crash,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=a444355ce84b419ea48869d9c15734ab&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win&branding=test",
  },
  {
    id: "9",
    category: "Originals",
    title: "Dragon",
    image: dragon,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=14fdde34d95011f08de90242ac120002&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    aspectRatio: "4/3",
  },
  {
    id: "16",
    category: "Originals",
    title: "Punch",
    image: punch,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=5539fc3e4671414fb3229a9eee641720&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
    aspectRatio: "16/9",
  },
  {
    id: "1",
    category: "Originals",
    title: "Mines",
    image: mines,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=9943920c44b211f0be34cdfe93e2b2d7&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "2",
    category: "Originals",
    title: "Plinko",
    image: plinko,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=78106d6ed4d247fbb7ac517ad8aa40d5&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "4",
    category: "Originals",
    title: "Dice",
    image: dice,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=5dcfc14083094c6b963d0dc6ad82ba68&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "6",
    category: "Originals",
    title: "Wheel",
    image: wheel,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=8d74f1b250c74e0ca003ca551ec9bd90&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "7",
    category: "Originals",
    title: "Diamonds",
    image: diamonds,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=e07d949ed84911f08de90242ac120002&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "8",
    category: "Originals",
    title: "Keno",
    image: keno,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=25eb025cd4bf11f08de90242ac120002&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "10",
    category: "Originals",
    title: "Limbo",
    image: limbo,
    status: "active",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game=17709360010649fa8f081e5c9920c42c&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "3",
    category: "Originals",
    title: "Chicken",
    image: chicken,
    status: "08/2026",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game={}&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
  {
    id: "5",
    category: "Originals",
    title: "Hilo",
    image: hilo,
    status: "09/2026",
    url: "https://remote-gaming-dev.systems.bet4.win/api/launch?game={}&token=DEMO&operator=5e41c28de3724d1290bbafbf6ee31cee&lang=en&site=bet4.win",
  },
];
