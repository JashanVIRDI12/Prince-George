import { services } from "./data";

export const serviceDetails = [
  {
    id: "towing",
    number: "01",
    category: "VEHICLE RECOVERY & TRANSPORT",
    indexCopy:
      "Safe vehicle transport and recovery support when your vehicle cannot continue.",
    image: "/images/recovery-detail.webp",
    alt: "A recovery operator securing a vehicle wheel to a flatbed with an orange strap",
    description:
      "When your vehicle cannot continue, we help you move forward with safe and reliable towing solutions. From local breakdowns to longer-distance transport, we plan every tow based on your vehicle, its condition, and where it needs to go.",
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
        "Flatbed towing offers secure transportation for vehicles that require extra care, including damaged, non-operational, or specialty vehicles.",
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
    number: "02",
    category: "HELP WHERE YOU’VE STOPPED",
    indexCopy:
      "Battery boosts, tire changes, lockouts, and roadside solutions to help you move again.",
    image: "/images/roadside-detail.webp",
    alt: "A roadside professional connecting a jump starter under a vehicle hood",
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
    imageLabel: "PRACTICAL HELP. RIGHT AT THE ROADSIDE.",
  },
  {
    id: "heavy",
    number: "03",
    category: "COMMERCIAL VEHICLES & EQUIPMENT",
    indexCopy:
      "Reliable transport solutions for larger vehicles, RVs, and specialized equipment.",
    image: "/images/heavy-recovery.webp",
    alt: "A blue heavy-duty recovery truck transporting a semi truck on a northern highway",
    description:
      "A larger vehicle requires the right equipment and careful planning. We provide transport solutions for commercial vehicles, RVs, and specialized equipment, with the right approach based on the vehicle, location, and destination.",
    features: [
      [
        "Commercial vehicles",
        "From work trucks to larger commercial vehicles, we provide reliable hauling support designed around your vehicle’s size, condition, and transport requirements.",
      ],
      [
        "RVs & motorhomes",
        "RVs and motorhomes require careful handling and the right equipment. We help transport larger recreational vehicles safely to their required destination.",
      ],
      [
        "Equipment transport",
        "If you need help with specialized equipment or oversized loads, we help coordinate transport solutions with attention to secure loading and safe movement.",
      ],
      [
        "Transport planning",
        "Every heavy-duty move starts with understanding the details. We consider vehicle type, pickup location, destination, and equipment needs before arranging transport.",
      ],
    ],
    prepare:
      "Share your vehicle or equipment details, pickup location, destination, and any specific requirements so we can understand the right approach for your transport.",
    action: "Get heavy-duty help",
    imageLabel: "THE VEHICLE. THE LOAD. THE WHOLE JOB.",
  },
].map((detail) => ({
  ...services.find((service) => service.id === detail.id),
  ...detail,
  path: `/services/${detail.id}/`,
}));
