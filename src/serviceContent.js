import { services } from "./data";
import { additionalServices } from "./additionalServices";

export const serviceDetails = [
  {
    id: "towing",
    number: "02",
    category: "CARS, SUVS, PICKUPS & VANS",
    indexCopy:
      "Towing for cars, SUVs, pickups, and vans, across town or long-distance.",
    image: "/images/fleet-heavy-equipment.webp",
    alt: "Prince George Towing’s white and burgundy heavy recovery truck with rear lifting equipment",
    description:
      "When your car, SUV, pickup, or van cannot continue, we help you move forward with safe and reliable towing. From local breakdowns to longer-distance transport, we plan every tow based on your vehicle, its condition, and where it needs to go.",
    features: [
      [
        "Local towing",
        "Whether your vehicle has broken down nearby or needs transport within Prince George, our local towing service provides safe and efficient vehicle movement with the right equipment for the situation.",
      ],
      [
        "Long-distance transport",
        "Need your vehicle moved beyond the local area? We provide dependable long-distance transport with careful planning to ensure your vehicle reaches its destination safely.",
      ],
      [
        "Flatbed transport",
        "Flatbed towing offers secure transportation for vehicles that require extra care, including damaged, non-operational, low-clearance, or all-wheel-drive vehicles.",
      ],
      [
        "Accident & vehicle recovery",
        "After an accident, safe recovery is important. Our team helps move vehicles from difficult situations while focusing on proper handling and secure transport.",
      ],
    ],
    prepare:
      "To help us respond quickly, have your location, vehicle details, current condition, and destination information ready when you call.",
    action: "Get towing help",
    imageLabel: "CAREFUL LOADING. THE RIGHT EQUIPMENT.",
  },
  {
    id: "roadside",
    number: "03",
    category: "HELP WHERE YOU’VE STOPPED",
    indexCopy:
      "Battery boosts, tire changes, lockouts, and roadside solutions to help you move again.",
    image: "/images/fleet-roadside.webp",
    alt: "A battery boost with Prince George Towing’s white and burgundy recovery truck in the background",
    description:
      "Sometimes a small issue can stop your entire day. Whether it’s a dead battery, flat tire, lockout, or fuel issue, we provide practical roadside support to help you get moving again.",
    features: [
      [
        "Battery boosts",
        "A dead battery does not always mean a tow is needed. Our battery boost service helps get your vehicle started so you can continue your journey.",
      ],
      [
        "Tire changes",
        "A flat tire can happen anywhere. We provide roadside tire assistance to help you safely replace your tire and get back on the road.",
      ],
      [
        "Vehicle lockouts",
        "Locked your keys inside your vehicle? Our team can provide assistance to help you regain access and continue your day.",
      ],
      [
        "Fuel delivery",
        "Running out of fuel can leave you stranded. We provide fuel delivery support to help you reach your next stop without unnecessary delays.",
      ],
    ],
    prepare:
      "Have your location, vehicle make and model, and details about the issue ready when you call. This helps us understand your situation and provide the right support.",
    action: "Get roadside help",
    imageLabel: "ROADSIDE HELP",
  },
  {
    id: "heavy",
    number: "01",
    category: "BUSES, TRUCKS & EQUIPMENT",
    indexCopy:
      "Heavy-duty towing for buses, coaches, semi trucks, commercial fleets, and equipment.",
    image: "/images/fleet-coach.webp",
    alt: "Prince George Towing’s white and burgundy wrecker towing a passenger coach beside a forested highway",
    description:
      "When a bus or semi truck stops, or equipment needs moving, the job needs the right setup and a clear plan. Prince George Towing provides heavy-duty towing, recovery, and equipment transport, with attention to weight, access, and the route to your destination.",
    features: [
      [
        "Bus & coach towing",
        "Towing support for passenger coaches, transit buses, and school buses. Tell us the vehicle’s length, weight, condition, and whether passengers have been safely moved before we plan the recovery.",
      ],
      [
        "Semi trucks & commercial fleets",
        "Recovery and towing for highway tractors, work trucks, and commercial vehicles. We review the tractor, trailer, load, and access conditions to prepare the right approach.",
      ],
      [
        "Heavy recovery & winching",
        "For a disabled vehicle, collision, or off-road situation, we assess the vehicle’s position and surroundings before planning a controlled recovery.",
      ],
      [
        "Equipment transport",
        "Transport planning for equipment, motorhomes, and larger vehicles. Share the dimensions, weight, pickup conditions, and destination so we can confirm availability and requirements.",
      ],
    ],
    prepare:
      "Have your bus, truck, or equipment details ready: approximate weight and dimensions, load, vehicle condition, pickup access, and destination. These details help us plan the right response.",
    action: "Get heavy-duty help",
    imageLabel: "BUS & COACH TOWING",
  },
  ...additionalServices,
].sort((a, b) => Number(a.number) - Number(b.number)).map((detail) => ({
  ...services.find((service) => service.id === detail.id),
  ...detail,
  path: `/services/${detail.id}/`,
}));
