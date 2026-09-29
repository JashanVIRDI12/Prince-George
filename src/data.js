export const business = {
  name: "Prince George Towing",
  phone: import.meta.env.VITE_DISPATCH_PHONE?.trim() || "",
  phoneHref: `tel:${(import.meta.env.VITE_DISPATCH_PHONE || "").replace(/[^+\d]/g, "")}`,
};

// The three services keep their ids so the request flow and the service
// dialog still resolve. `description` and `tags` feed the home page service
// showcase; `modal` is the copy the service dialog shows.
export const services = [
  {
    id: "roadside",
    number: "01",
    title: "Roadside assistance",
    icon: "battery",
    description:
      "A flat tire, dead battery, or locked keys can happen anytime. Our roadside assistance team provides quick solutions to help you get back on the road safely.",
    tags: ["Battery boosts", "Tire changes", "Lockout & fuel delivery support"],
    modal: {
      title: "Roadside assistance",
      description:
        "Not every roadside problem needs a tow. From a dead battery to a flat tire or locked keys, we provide quick assistance to help you get back on the road safely.",
      tags: ["Battery boosts", "Tire changes", "Lockouts & fuel delivery"],
      detail:
        "Tell us your location, vehicle details, and what went wrong. Our team will help determine the right roadside solution and get you the support you need.",
      action: "Get help with roadside assistance",
    },
  },
  {
    id: "towing",
    number: "02",
    title: "Towing & recovery",
    icon: "truck",
    description:
      "A breakdown, accident, or unexpected vehicle issue can leave you stuck. Our towing and recovery services are designed to safely move your vehicle and provide dependable support when you need it.",
    tags: ["Local & long-distance towing", "Flatbed vehicle transport", "Accident recovery"],
    modal: {
      title: "Towing & recovery",
      description:
        "When your vehicle cannot move, you need reliable support to handle the situation safely. From roadside breakdowns to accident recovery, we provide professional towing solutions across Prince George and surrounding areas.",
      tags: ["Local & long-distance towing", "Flatbed vehicle transport", "Accident recovery"],
      detail:
        "Share your location, vehicle details, and where you need assistance. We’ll help arrange the right equipment, explain the process, and provide a clear solution before starting the job.",
      action: "Get help with towing",
    },
  },
  {
    id: "heavy",
    number: "03",
    title: "Heavy-duty hauling",
    icon: "heavy",
    description:
      "When larger vehicles or equipment need transport, you need a team with the right capability and experience. We provide dependable hauling solutions for commercial vehicles, RVs, and specialized equipment.",
    tags: ["Trucks & commercial vehicles", "RVs & motorhomes", "Equipment transport"],
  },
];

// The first card in the home page service strip opens this dialog instead of
// the general towing one.
export const vehicleRecoveryModal = {
  title: "Towing & vehicle recovery",
  description:
    "When your car breaks down, you need a team that can respond quickly and handle it safely. From breakdowns and flatbeds to accident recovery, we provide dependable towing solutions across Prince George and nearby areas.",
  tags: ["Local & long-distance towing", "Flatbed vehicle transport", "Accident recovery support"],
  detail:
    "Whether your car, truck, or other vehicle needs a short-distance tow or transport to a repair facility, we’ll help coordinate the right solution with clear communication from start to finish.",
  action: "Get help",
};

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
      "From downtown streets to the edges of the city, we provide towing, recovery, and roadside support. Share your nearest intersection, landmark, or location so we can understand where you are.",
    aboutDetail:
      "From city streets to nearby highways, share your location using an address, intersection, or visible landmark so we can understand where you are.",
    home: {
      name: "Prince George & surrounding areas",
      route: "Reliable help across the city and nearby roads",
      detail:
        "From downtown streets to highways around Prince George, our team provides towing and roadside assistance where you need it. Share your location, nearby landmark, or destination, and we’ll help confirm availability.",
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
    "Can you tow trucks, RVs, and commercial vehicles?",
    "We provide solutions for different vehicle types. Contact us with your vehicle details so we can confirm the right equipment for your needs.",
  ],
  [
    "How quickly can you reach my location?",
    "Response times depend on your location, road conditions, traffic, and equipment availability. We’ll provide the most accurate information when you contact us.",
  ],
  [
    "What information should I provide when calling?",
    "Share your location, vehicle make and model, what happened, and where you need the vehicle transported. This helps us arrange the right support.",
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
    "Can you tow trucks, RVs, or commercial vehicles?",
    "We provide support for larger vehicles and specialized transport needs. Share your vehicle details so we can confirm the right equipment and approach.",
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
    "Can you help with commercial vehicles, trucks, or RVs?",
    "Yes. We handle a range of vehicles, including commercial vehicles, trucks, RVs, and heavier equipment. Let us know the vehicle type and situation so we can plan the right response.",
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
