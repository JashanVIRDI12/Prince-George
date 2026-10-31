// Home page copy. Business details, service areas and questions come from
// src/data.js so every page stays in step.
export { business, areas, faqs } from "../data";
import { homePhotography as photos } from "./photography";

// The five services, in the order most callers need them. Each new scene is
// an illustration based on the company's real truck and supplied logo.
export const homeServices = [
  {
    id: "towing",
    title: "Car towing",
    line: "Cars, SUVs, pickups and vans. Across town or long distance, on a flatbed when the vehicle needs it.",
    image: photos.towing,
    alt: "Prince George Towing’s white and burgundy wrecker lifting a navy sedan",
  },
  {
    id: "heavy",
    title: "Heavy-duty towing",
    line: "Buses, coaches, semi trucks and commercial fleets, planned around weight, load and access.",
    image: photos.heavy,
    alt: "The company’s heavy wrecker towing a white passenger coach by a spruce forest",
  },
  {
    id: "equipment",
    title: "Heavy equipment transport",
    line: "Excavators, machinery and commercial equipment moved between yards and job sites.",
    image: photos.equipment,
    alt: "The company’s recovery truck beside a yellow excavator on an equipment trailer",
  },
  {
    id: "offloading",
    title: "Offloading",
    line: "Machinery and suitable loads lifted off trucks and trailers and set where you need them.",
    image: photos.offloading,
    alt: "The company’s burgundy recovery boom lifting machinery from a low trailer",
  },
  {
    id: "roadside",
    title: "Roadside assistance",
    line: "Battery boosts, tire changes, lockouts and fuel delivery, when a tow isn’t needed.",
    image: photos.roadside,
    alt: "An operator boosting a car battery with the company’s white and burgundy truck behind",
  },
];

// What a call looks like. These happen in this order, so they are numbered.
export const steps = [
  {
    title: "Tell us where you are",
    text: "Your location, the vehicle, and what happened. On the highway, a kilometre marker or the last place you passed is enough.",
    image: photos.hero,
    alt: "The company’s recovery truck heading down a forested highway",
  },
  {
    title: "Agree on the plan",
    text: "We confirm the equipment, the destination and the cost with you before any work starts.",
    image: photos.offloading,
    alt: "The company’s burgundy recovery boom and rigging beside a trailer",
  },
  {
    title: "Get moving",
    text: "Sorted at the roadside when that’s possible, or towed to the shop, yard or address you choose.",
    image: photos.wrecker,
    alt: "The company’s white and burgundy wrecker at a northern forest edge",
  },
];

// Three lines of large type, each holding a small photo between its words.
// Every line is something the company does.
export const statementLines = [
  {
    before: "We tow cars",
    after: "",
    image: photos.towing,
    alt: "A sedan on the company’s recovery truck’s wheel lift",
  },
  {
    before: "coaches",
    after: "& semis",
    image: photos.heavy,
    alt: "The company’s heavy wrecker towing a passenger coach",
  },
  {
    before: "and move",
    after: "machinery",
    image: photos.equipment,
    alt: "An excavator loaded on a low trailer beside the company’s truck",
  },
];

// The details that let dispatch plan a heavy job before the truck leaves.
export const heavyChecklist = [
  "Approximate weight and dimensions",
  "What it’s carrying, if anything",
  "Whether it rolls and steers",
  "Access at the pickup",
  "Where it needs to go",
];
