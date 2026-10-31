import { additionalServices } from "./additionalServices";

// Every help action on the site calls this number. VITE_DISPATCH_PHONE can
// override it for a different deployment.
const phone = import.meta.env.VITE_DISPATCH_PHONE?.trim() || "778-281-0200";
const digits = phone.replace(/\D/g, "");

export const business = {
  name: "Prince George Towing",
  // As registered on the Google Business Profile.
  legalName: "Prince George Towing & Recovery Inc.",
  phone,
  phoneHref: `tel:+${digits.length === 10 ? `1${digits}` : digits}`,
  // The Google Business Profile listing. It is a service-area listing, so it
  // shows no street address.
  mapsUrl:
    "https://www.google.com/maps/place/PRINCE+GEORGE+TOWING+%26+RECOVERY+INC./@54.1386854,-126.5578556,5z/data=!4m6!3m5!1s0x6d071a1b8a2ce27f:0xfc20f614a90feafe!8m2!3d54.1386854!4d-126.5578556!16s%2Fg%2F11zz8603cm",
};

// Services keep their ids so the service dialog and the service
// pages still resolve. `description` and `tags` feed the home page service
// showcase; `modal` is the copy the service dialog shows.
export const services = [
  {
    id: "heavy",
    number: "01",
    title: "Heavy-duty towing",
    icon: "heavy",
    description:
      "Heavy-duty towing and recovery for buses, coaches, semi trucks, and commercial fleets, plus equipment transport in Prince George. We plan around the vehicle or equipment’s weight, condition, and access to bring the right setup to the job.",
    tags: ["Buses & coaches", "Semi trucks & commercial fleets", "Heavy recovery & equipment transport"],
  },
  {
    id: "towing",
    number: "02",
    title: "Car towing",
    icon: "truck",
    description:
      "Towing for cars, SUVs, pickups, and vans in Prince George. From a breakdown in town to a collision on the highway, we move your vehicle safely to the repair shop, home, or destination you choose.",
    tags: ["Cars, SUVs, pickups & vans", "Local & long-distance towing", "Flatbed transport & accident recovery"],
    modal: {
      title: "Car towing",
      description:
        "A breakdown or collision can stop any vehicle without warning. We tow cars, SUVs, pickups, and vans in Prince George and surrounding areas, with flatbed transport for vehicles that need extra care.",
      tags: ["Cars, SUVs, pickups & vans", "Local & long-distance towing", "Flatbed transport & accident recovery"],
      detail:
        "Tell us your location, vehicle make and model, its condition, and where it needs to go. We’ll confirm the right equipment and the next step before we move it.",
      action: "Get help with towing",
    },
  },
  {
    id: "roadside",
    number: "03",
    title: "Roadside assistance",
    icon: "battery",
    description:
      "Battery trouble, a flat tire, locked keys, or an empty tank can interrupt any trip. Call with your vehicle details so we can confirm roadside support or arrange towing when needed.",
    tags: ["Battery boosts", "Tire changes", "Lockouts & fuel delivery"],
    modal: {
      title: "Roadside assistance",
      description:
        "Not every breakdown needs a tow. We help with battery boosts, tire changes, lockouts, and fuel delivery, with assistance matched to the vehicle and roadside conditions.",
      tags: ["Battery boosts", "Tire changes", "Lockouts & fuel delivery"],
      detail:
        "Share your location, vehicle make and model, and the problem. For a bus or commercial truck, let us know the vehicle size and requirements so we can confirm suitable assistance.",
      action: "Get help with roadside assistance",
    },
  },
  ...additionalServices,
];

// Map points identify communities, not company offices or coverage boundaries.
// Coordinates: BC Geographical Names / Natural Resources Canada.
// Source links and map setup are recorded in design/REAL-MAP.md.
// `detail` is the contact page note, `aboutDetail` the about page note, and
// `home` replaces the Prince George panel copy on the home page.
export const areas = [
  {
    id: "pg",
    name: "Prince George",
    route: "City and the roads right around it",
    bearing: "LOCAL",
    detail:
      "From downtown streets to the edges of the city, we provide car towing, heavy-duty bus and truck recovery, equipment transport, and roadside support. Share your nearest intersection, landmark, or location so we can understand where you are.",
    aboutDetail:
      "From city streets to nearby highways, share your location using an address, intersection, or visible landmark so we can understand where you are.",
    home: {
      name: "Prince George & surrounding areas",
      route: "Reliable help across the city and nearby roads",
      detail:
        "From downtown streets to highways around Prince George, our team helps with car towing, heavy-duty recovery, equipment transport, and roadside assistance. Share your location, nearby landmark, or destination, and we’ll help confirm availability.",
    },
    map: { center: [53.913056, -122.745278], zoom: 11, place: "Prince George" },
  },
  {
    id: "west",
    name: "Highway 16 West",
    route: "Toward Vanderhoof",
    bearing: "WEST",
    detail:
      "Heading west on the Yellowhead? Tell us your direction, nearest kilometre marker, or the last place you passed. We’ll confirm availability and the right response for your situation.",
    aboutDetail:
      "Travelling west? Share your location, highway marker, or nearest town so we can confirm availability and guide the response.",
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
      "Whether you are travelling through town or heading north, share your route and location details. We’ll help determine the best way to reach you.",
    aboutDetail:
      "Heading north from Prince George, share your direction of travel, nearest community, or kilometre marker so we can understand your location and help determine the right response.",
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
      "Travelling south on the Cariboo Highway? Let us know where you are and what happened. We’ll discuss the available options and what happens next.",
    aboutDetail:
      "The Cariboo Highway route connects communities south of Prince George. Share your direction of travel, nearest town, or kilometre marker so we can understand your location and confirm the next step.",
    map: {
      center: [52.979722, -122.493611],
      zoom: 12,
      place: "Quesnel · Highway 97 South",
    },
  },
];

// Home page questions.
export const faqs = [
  [
    "What should I do while I wait for a tow truck?",
    "If it is safe, move your vehicle away from traffic and turn on your hazard lights. Stay in a safe location and keep your phone available so our team can reach you easily.",
  ],
  [
    "Can you provide a jump-start without towing my vehicle?",
    "Yes, if the issue is a dead battery and the situation can be safely resolved roadside, we can provide battery boost assistance.",
  ],
  [
    "How much does towing cost?",
    "The cost depends on factors such as your location, vehicle type, distance, and the service required. We discuss the details before arranging the job.",
  ],
  [
    "Do you offer local and long-distance towing?",
    "Yes, we provide towing support for local trips and longer-distance vehicle transport based on your requirements.",
  ],
  [
    "What kinds of vehicles do you tow?",
    "Everyday cars, SUVs, pickups, and vans, as well as buses, coaches, semi trucks, and commercial vehicles. For a heavy vehicle, share the vehicle type, approximate weight, condition, and location so we can confirm the right equipment.",
  ],
  [
    "How quickly can you reach my location?",
    "Response times depend on your location, road conditions, traffic, and equipment availability. We’ll provide the most accurate information when you contact us.",
  ],
  [
    "What information should I provide when calling?",
    "Share your location, vehicle make and model, what happened, and the destination. For a bus, semi truck, or loaded commercial vehicle, also include approximate weight, dimensions, and whether it can roll or steer.",
  ],
];

export const serviceFaqs = [
  [
    "What is this going to cost me?",
    "The cost depends on the service required, your location, vehicle type, distance, and the equipment needed. We’ll discuss the details with you before arranging the service so you know what to expect.",
  ],
  [
    "Do you provide local and long-distance towing?",
    "Yes, we provide towing solutions for both local and longer-distance vehicle transport. Share your pickup location and destination, and we’ll help determine the right option.",
  ],
  [
    "Can you come out for just a battery boost or roadside issue?",
    "Yes. Not every situation requires a tow. For issues like a dead battery, flat tire, lockout, or fuel delivery, we can provide roadside assistance when appropriate.",
  ],
  [
    "What kinds of vehicles can you tow?",
    "Cars, SUVs, pickups, and vans, plus buses and coaches, semi trucks, commercial fleets, and RVs. For larger vehicles, share the size, weight, condition, and access details so we can plan the right response.",
  ],
  [
    "What information should I have ready when I call?",
    "Having your location, vehicle make and model, current condition, and details about what happened helps us understand your situation and arrange the right support faster.",
  ],
];

export const contactFaqs = [
  [
    "What should I do while I wait for help?",
    "If it is safe, move away from traffic and turn on your hazard lights. Keep your location, vehicle details, and any important information ready for dispatch. If there is an immediate safety concern, contact emergency services first.",
  ],
  [
    "How do I know if I need roadside assistance or a tow?",
    "Tell us what happened and where you are. We’ll help understand the situation and determine whether a roadside solution or vehicle transport is the right next step.",
  ],
  [
    "How quickly can you reach my location?",
    "Response times depend on your location, road conditions, traffic, and the equipment required. Once we have your details, we’ll provide the best available option.",
  ],
  [
    "Do you provide service outside Prince George?",
    "Yes, we assist drivers in Prince George and surrounding areas. Share your exact location and route, and we’ll confirm availability.",
  ],
  [
    "What kinds of vehicles do you help with?",
    "Everyday cars, SUVs, pickups, and vans, as well as buses, coaches, semi trucks, RVs, and commercial equipment. Let us know the vehicle type and situation so we can plan the right response.",
  ],
  [
    "What information should I have when I call?",
    "Having your location, vehicle make and model, what happened, and your destination ready helps us understand the situation and arrange the right service faster.",
  ],
  [
    "Can I choose where my vehicle is taken?",
    "Yes. Let us know your preferred destination, such as a repair shop, home, or another location. We’ll discuss the available options before moving the vehicle.",
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
