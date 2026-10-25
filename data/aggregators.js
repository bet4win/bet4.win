// The aggregators and platforms the catalogue is integrated with, as shown on
// the homepage's "Get our games from" wall (app/components/Aggregators.jsx).
//
// `primary` partners get the large tiles: the ones an operator is most likely
// to already be on. Order within each group is the order on the wall.
//
// Logos are each company's own published file, unmodified — where each came
// from is in public/assets/img/partners/SOURCES.md. A partner whose only mark
// can't be drawn as a white silhouette (an opaque background, lettering cut out
// of a plate) is left off rather than shown wrong.
import revolver from "@/public/assets/img/partners/revolver-gaming.svg";
import upgaming from "@/public/assets/img/partners/upgaming.svg";
import relax from "@/public/assets/img/partners/relax-gaming.svg";
import digitain from "@/public/assets/img/partners/digitain.svg";
import alea from "@/public/assets/img/partners/alea.png";
import softswiss from "@/public/assets/img/partners/softswiss.svg";
import everymatrix from "@/public/assets/img/partners/everymatrix.svg";
import hub88 from "@/public/assets/img/partners/hub88.svg";
import softgamings from "@/public/assets/img/partners/softgamings.svg";
import betconstruct from "@/public/assets/img/partners/betconstruct.svg";
import playtech from "@/public/assets/img/partners/playtech.svg";
import groove from "@/public/assets/img/partners/groove.svg";
import bragg from "@/public/assets/img/partners/bragg-gaming.svg";
import oneGameHub from "@/public/assets/img/partners/1gamehub.png";
import uplatform from "@/public/assets/img/partners/uplatform.svg";
import nuxgame from "@/public/assets/img/partners/nuxgame.svg";
import salsa from "@/public/assets/img/partners/salsa-technology.png";
import virtualsoft from "@/public/assets/img/partners/virtualsoft.png";

export const aggregators = [
  { name: "Revolver Gaming", logo: revolver, primary: true },
  { name: "Upgaming", logo: upgaming, primary: true },
  { name: "Relax Gaming", logo: relax, primary: true },
  { name: "Digitain", logo: digitain, primary: true },
  { name: "Alea", logo: alea, primary: true },
  { name: "SOFTSWISS", logo: softswiss, primary: true },
  { name: "EveryMatrix", logo: everymatrix },
  { name: "Hub88", logo: hub88 },
  { name: "SoftGamings", logo: softgamings },
  { name: "BetConstruct", logo: betconstruct },
  { name: "Playtech", logo: playtech },
  { name: "Groove", logo: groove },
  // Oryx Gaming's hub; oryxgaming.com now redirects to its parent, Bragg.
  { name: "Bragg Gaming", logo: bragg },
  { name: "1GameHub", logo: oneGameHub },
  { name: "Uplatform", logo: uplatform },
  { name: "NuxGame", logo: nuxgame },
  { name: "Salsa Technology", logo: salsa },
  { name: "VirtualSoft", logo: virtualsoft },
];
