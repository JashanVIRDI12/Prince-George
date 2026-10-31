// Copy for the services page and the five service pages.
//
// Every claim here is one the business already makes elsewhere on the site:
// the services, what each covers, and that cost and equipment are confirmed
// before work starts. Nothing about response times, prices, certifications
// or fleet size, which have not been confirmed.
import { homePhotography as photos } from "../home/photography";
import { serviceFaqs } from "../data";

export { business, serviceFaqs } from "../data";

// Each photo is an illustrative scene based on the company's real truck.
export const services = [
  {
    id: "towing",
    title: "Car towing",
    path: "/services/towing/",
    action: "Get towing help",
    image: photos.towing,
    alt: "Prince George Towing’s white and burgundy wrecker lifting a navy sedan",
    promise: "Cars, SUVs, pickups and vans, moved to the shop, home or wherever you choose.",
    lead:
      "A breakdown, a collision or a car that won’t start. Across Prince George or further down the highway, we tow it on its wheels or on a flatbed, whichever the vehicle needs.",
    handles: [
      ["Local tows", "Breakdowns and no-starts around Prince George, taken to your mechanic, dealer or driveway."],
      ["Long-distance transport", "Longer moves planned around the route, the vehicle’s condition and where it has to end up."],
      ["Flatbed loading", "For all-wheel-drive, low, damaged or non-running vehicles that shouldn’t roll on their own wheels."],
      ["Accident recovery", "After a collision, the vehicle is recovered carefully and taken where it needs to go."],
    ],
    statement: "Tell us where it is. We’ll work out where it goes and what it costs before anything moves.",
    prepare: [
      ["Where you are", "An address, intersection, highway marker or nearby landmark."],
      ["The vehicle", "Make, model and condition, and whether it can roll or steer."],
      ["Where it’s going", "Your repair shop, home, or another destination you choose."],
    ],
    questions: [
      ["Can you take my vehicle to a repair shop?", "Yes. We take vehicles to the repair shop, home or other destination you choose. Share the pickup location and where it needs to go when you call."],
      ["What if the vehicle can’t roll or steer?", "Tell us its condition when you call. It decides the equipment and approach, including whether the vehicle goes on a flatbed."],
      ["Can you help after a collision?", "Yes. Share your location, the vehicle’s condition and any access concerns, and we’ll plan the safest way to recover and move it."],
      ["Do you do long-distance vehicle transport?", "Yes. Longer moves are arranged around the vehicle, the pickup location and the destination."],
      ["What should I have ready before arranging a tow?", "Your location, the vehicle’s make, model and condition, and where it needs to go."],
    ],
  },
  {
    id: "heavy",
    title: "Heavy-duty towing",
    path: "/services/heavy/",
    action: "Get heavy-duty help",
    image: photos.heavy,
    alt: "The company’s heavy wrecker towing a white passenger coach by a spruce forest",
    promise: "Buses, coaches, semi trucks and commercial fleets, recovered with a plan.",
    lead:
      "A stopped coach or a loaded semi needs more than a bigger truck. We plan the recovery around the vehicle’s weight, its load, how it’s sitting and how we can reach it.",
    handles: [
      ["Bus & coach towing", "Passenger coaches, transit buses and school buses, planned around length, weight and condition."],
      ["Semi trucks & fleets", "Highway tractors, trailers, work trucks and commercial vehicles, with the load and access reviewed first."],
      ["Recovery & winching", "Vehicles off the road or in a difficult position, assessed before a controlled recovery."],
      ["Long-distance heavy tows", "Longer moves reviewed for the vehicle, the route and the equipment it needs."],
    ],
    statement: "A stopped bus or a loaded semi needs a plan before it needs a truck. That plan starts with your call.",
    prepare: [
      ["Vehicle and load", "Bus or truck type, approximate weight and length, and what it’s carrying."],
      ["Location and access", "Highway, direction of travel, nearest kilometre marker, and room around the vehicle."],
      ["Destination", "The repair facility, depot or yard where it needs to go."],
    ],
    questions: [
      ["Can you tow buses and passenger coaches?", "Yes. Share the bus type, its approximate length and weight, its condition and location, and whether passengers have been safely moved."],
      ["Do you recover semi trucks and commercial vehicles?", "Yes. Tell us about the tractor, the trailer, the load and any damage so we can confirm the equipment and access the job needs."],
      ["Can you help with a vehicle off the road?", "Call with the vehicle’s position, the ground conditions, the access and any damage. We’ll talk through winching and recovery options."],
      ["Can you arrange a longer-distance heavy tow?", "Share the pickup point and destination. We’ll review the vehicle, the route and equipment availability before confirming the move."],
    ],
  },
  {
    id: "equipment",
    title: "Heavy equipment transport",
    path: "/services/equipment/",
    action: "Get equipment transport help",
    image: photos.equipment,
    alt: "The company’s recovery truck beside a yellow excavator on an equipment trailer",
    promise: "Excavators, machinery and commercial equipment, moved between yards and job sites.",
    lead:
      "Moving a machine starts with the machine and the site. We plan the transport around its size, weight and condition, the loading access at each end and the route between.",
    handles: [
      ["Equipment transport", "Construction machinery and commercial equipment, with the setup matched to its size and weight."],
      ["Disabled equipment recovery", "Machines that can’t move under their own power, assessed for recovery and loading."],
      ["Site-to-site moves", "Yard to job site and back, with access, space and ground conditions checked first."],
      ["Local & long-distance", "Short hops across town and longer moves planned around the route."],
    ],
    statement: "The machine, the site and the route. Tell us about all three and we’ll plan the move around them.",
    prepare: [
      ["The equipment", "Machine type, dimensions, approximate weight, and whether it can drive, roll or steer."],
      ["The site", "Loading access, available space, ground conditions and any restrictions."],
      ["The destination", "Where it’s going and what the access is like at that end."],
    ],
    questions: [
      ["Can you help move heavy machinery?", "Yes. Share the equipment type, dimensions, approximate weight, condition, pickup point and destination so we can confirm suitable transport."],
      ["What if the equipment can’t move under its own power?", "Tell us whether it can roll or steer, where it’s sitting and the access available. We’ll review recovery and loading before confirming the move."],
      ["Can you arrange a longer-distance equipment move?", "Share the pickup point, destination and equipment details. We’ll discuss the route, the requirements and availability."],
      ["What helps you plan the transport?", "The equipment type, dimensions, weight, operating condition, site access and destination."],
    ],
  },
  {
    id: "offloading",
    title: "Offloading",
    path: "/services/offloading/",
    action: "Get offloading help",
    image: photos.offloading,
    alt: "The company’s burgundy recovery boom lifting machinery from a low trailer",
    promise: "Machinery and suitable loads lifted off trucks and trailers and set where you need them.",
    lead:
      "When a delivery arrives without a way to unload it, we bring the lift. The setup is planned around the load, its lifting points, the truck or trailer and the ground where it lands.",
    handles: [
      ["Truck & trailer offloading", "Suitable equipment and loads lifted off trucks and trailers, with the setup confirmed first."],
      ["Machinery handling", "Loads assessed for dimensions, weight, condition and lifting points."],
      ["Delivery coordination", "Timing, the truck or trailer, the placement area and who’s on site, agreed ahead."],
      ["Site & access checks", "Working space, ground conditions and access reviewed before the lift."],
    ],
    statement: "A load is only delivered once it’s on the ground, in the right place. Tell us where that is.",
    prepare: [
      ["The load", "What it is, its dimensions, approximate weight and lifting points."],
      ["The delivery", "Truck or trailer details, delivery timing and the site contact."],
      ["The placement", "Access, ground conditions, working space and where the load needs to sit."],
    ],
    questions: [
      ["Can you offload a truck or trailer?", "Yes. Share the load type, its approximate weight and dimensions, the truck or trailer details and the site access so we can confirm a suitable plan."],
      ["What do you need to know about the load?", "Its dimensions, weight, condition and the lifting or handling points available."],
      ["Can offloading be timed with a delivery?", "Tell us the expected delivery time, the truck or trailer details, the site contact and where the load should go."],
      ["What if access or the ground is difficult?", "Describe narrow access, uneven ground or limited space when you call, and we’ll review the site before confirming."],
    ],
  },
  {
    id: "roadside",
    title: "Roadside assistance",
    path: "/services/roadside/",
    action: "Get roadside help",
    image: photos.roadside,
    alt: "An operator boosting a car battery with the company’s white and burgundy truck behind",
    promise: "Battery boosts, tire changes, lockouts and fuel delivery, when a tow isn’t needed.",
    lead:
      "Not every breakdown needs a tow. If it can be sorted where you’ve stopped, we sort it there. If it can’t, we arrange the tow on the same call.",
    handles: [
      ["Battery boosts", "A vehicle that won’t start, checked and boosted so you can carry on."],
      ["Tire changes", "A flat swapped for your spare, at the roadside or in a lot."],
      ["Lockouts", "Keys locked inside, with help getting you back in."],
      ["Fuel delivery", "Enough fuel to get you to the next station."],
    ],
    statement: "Not every breakdown needs a tow. Tell us what stopped you, and we’ll bring what fixes it.",
    prepare: [
      ["Where you are", "Street address, highway marker or a nearby landmark."],
      ["The vehicle", "Make, model, and anything unusual about it."],
      ["What happened", "Battery, flat tire, lockout or fuel, and whether you have a usable spare."],
    ],
    questions: [
      ["What roadside help do you offer?", "Battery boosts, tire changes, vehicle lockouts and fuel delivery."],
      ["Can you help on the highway or somewhere remote?", "Yes. Give us your exact location or nearest landmark and we’ll confirm the best way to reach you."],
      ["What if it can’t be fixed at the roadside?", "Then we arrange a tow to the shop, home or wherever you choose."],
      ["Do I need my own spare tire?", "If you have a usable spare, tell us when you call. We’ll talk through the next step for your vehicle."],
    ],
  },
];

// The services page "What happened?" finder: the visitor picks the
// situation that sounds like theirs, and the matching service answers.
export const situations = [
  { label: "It won’t start", service: "roadside", answer: "Often a battery boost does it. If not, we tow it on the same call." },
  { label: "Flat tire, lockout or no fuel", service: "roadside", answer: "Roadside assistance sorts these where you’ve stopped." },
  { label: "My car, SUV or pickup needs a tow", service: "towing", answer: "A tow to your shop, home or wherever you choose, on a flatbed if it needs one." },
  { label: "It’s been in a collision", service: "towing", answer: "We recover the vehicle carefully and take it where it needs to go." },
  { label: "It’s a bus, coach or semi", service: "heavy", answer: "Heavy-duty recovery, planned around the weight, the load and the access." },
  { label: "A machine needs moving", service: "equipment", answer: "Equipment transport between yards and job sites, planned around the machine and the site." },
  { label: "A load needs to come off a truck", service: "offloading", answer: "We lift it off the truck or trailer and set it where you need it." },
];

// What the price depends on, as the questions on this site already put it:
// the service, the location, the vehicle, the distance and the equipment.
// The cost is discussed before the job is arranged.
export const priceFactors = [
  ["The job", "A battery boost, a tow, a recovery or an equipment move."],
  ["Location", "Where the vehicle is, and how easily we can reach it."],
  ["The vehicle", "Its size, weight and condition, and what it’s carrying."],
  ["Distance", "From the pickup to where it’s going."],
  ["Equipment", "Wheel lift, flatbed, winch or boom, whatever the job needs."],
];

export const servicesIndexQuestions = serviceFaqs;

export const findService = (id) => services.find((service) => service.id === id);
