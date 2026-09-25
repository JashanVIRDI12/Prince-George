export const business = {
  name: "Prince George Towing",
  phone: import.meta.env.VITE_DISPATCH_PHONE?.trim() || "",
  phoneHref: `tel:${(import.meta.env.VITE_DISPATCH_PHONE || "").replace(/[^+\d]/g, "")}`,
};

// The three services keep their ids so the request flow and the service
// dialog still resolve. `problem` is the visitor's own words, `response` is
// what actually happens. They face each other across the divider.
export const services = [
  {
    id: "roadside",
    number: "01",
    title: "Roadside assistance",
    icon: "battery",
    problem: "The battery is dead and nothing is turning over.",
    response:
      "A boost, a test, and a straight answer about whether it starts again tomorrow.",
    description:
      "A flat tire. An empty tank. Keys on the wrong side of a locked door. Sometimes a little roadside help is all it takes to get your day moving again.",
    tags: ["Battery boosts", "Tire changes", "Lockouts & fuel delivery"],
    detail:
      "Let us know your vehicle's make and model and what happened. For a tire change, mention whether you have a usable spare. We'll help you choose the right service.",
  },
  {
    id: "towing",
    number: "02",
    title: "Towing & recovery",
    icon: "truck",
    problem: "It is off the road and I cannot tell what it is sitting on.",
    response:
      "Recovery with the equipment the ground actually needs, and a price before the winch moves.",
    description:
      "A breakdown shouldn't derail your whole day. From a car that won't start to a vehicle that needs a careful recovery, we help you figure out the next move.",
    tags: ["Local & long-distance", "Flatbed transport", "Accident recovery"],
    detail:
      "Tell us where you are, what you drive, and where you need to go. We'll confirm the right equipment and discuss the cost before arranging your tow.",
  },
  {
    id: "heavy",
    number: "03",
    title: "Heavy-duty hauling",
    icon: "heavy",
    problem: "It is a work truck, it is loaded, and it is not going anywhere.",
    response:
      "Heavy transport planned around the load and the route, not around the truck.",
    description:
      "When your workhorse stops working, every minute matters. Get help planning transport for commercial vehicles, RVs, and the equipment you rely on.",
    tags: ["Trucks & commercial", "RVs & motorhomes", "Equipment transport"],
    detail:
      "Have your vehicle's dimensions, approximate weight, pickup location, and destination ready. Our team will confirm equipment availability and the best transport option.",
  },
];

// Map points identify communities, not company offices or coverage boundaries.
// Coordinates: BC Geographical Names / Natural Resources Canada.
// Source links and map setup are recorded in design/REAL-MAP.md.
export const areas = [
  {
    id: "pg",
    name: "Prince George",
    route: "City and the roads right around it",
    bearing: "LOCAL",
    detail:
      "From a downtown parking lot to the edge of town. Give us the nearest intersection or a landmark you can see from where you are standing.",
    map: { center: [53.913056, -122.745278], zoom: 11, place: "Prince George" },
  },
  {
    id: "west",
    name: "Highway 16 West",
    route: "Toward Vanderhoof",
    bearing: "WEST",
    detail:
      "Heading west on the Yellowhead. Share the nearest kilometre marker, intersection, or town and we will confirm whether we can reach you.",
    map: {
      center: [54.017222, -124.0075],
      zoom: 12,
      place: "Vanderhoof · Highway 16 West",
    },
  },
  {
    id: "north",
    name: "Highway 97 North",
    route: "North toward the Hart",
    bearing: "NORTH",
    detail:
      "Northern road, northern weather. Tell us your route and the last thing you passed, and we will confirm the right help for the situation.",
    map: {
      center: [53.983333, -122.8],
      zoom: 12,
      place: "Hart Highlands · Highway 97 North",
    },
  },
  {
    id: "south",
    name: "Highway 97 South",
    route: "Toward Quesnel",
    bearing: "SOUTH",
    detail:
      "The Cariboo Highway. Tell us your direction of travel and exactly where you are so we can talk through availability and what happens next.",
    map: {
      center: [52.979722, -122.493611],
      zoom: 12,
      place: "Quesnel · Highway 97 South",
    },
  },
];

export const faqs = [
  [
    "What do I do while I wait?",
    "If it is safe, get out of traffic and put your hazards on. Keep your exact location and vehicle details ready for dispatch. If anyone is hurt or in danger, call 911 first.",
  ],
  [
    "Can you come out for just a jump-start?",
    "Yes. Roadside help covers battery boosts, tire changes, lockouts, and fuel delivery. Tell us what happened and we will sort out the right call.",
  ],
  [
    "What is this going to cost me?",
    "It depends on the vehicle, where it is, where it is going, and what equipment the job needs. Give us those four things and you get a number before anything moves.",
  ],
  [
    "Do you go long-distance?",
    "We can talk through local and long-distance transport. We need your pickup point, destination, vehicle type, and when you need it.",
  ],
  [
    "Will you take a truck, an RV, or a loaded commercial vehicle?",
    "Tell us the type, rough weight, dimensions, and condition. We confirm the right equipment and whether it is available before anything is scheduled.",
  ],
];

// The winch markers. One per act, stamped on the cable as the visitor
// passes, and clickable afterwards. `label` is what the marker reads.
export const stops = [
  { id: "situation", label: "YOU ARE HERE" },
  { id: "services", label: "WHAT WENT WRONG" },
  { id: "coverage", label: "HOW FAR IT GOES" },
  { id: "questions", label: "WHAT YOU ASKED" },
  { id: "tow", label: "THE TOW" },
  { id: "close", label: "HOME" },
];
