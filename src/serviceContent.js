import { services } from "./data";

export const serviceDetails = [
  {
    id: "towing",
    number: "01",
    category: "VEHICLE RECOVERY & TRANSPORT",
    indexCopy: "A careful move to the place you need to be.",
    image: "/images/recovery-detail.webp",
    alt: "A recovery operator securing a vehicle wheel to a flatbed with an orange strap",
    description:
      "When your vehicle can’t make the trip, we’ll help with the next move. From a breakdown in town to a longer journey, we plan the tow around your vehicle, its condition, and where it needs to go.",
    features: [
      [
        "Local towing",
        "Transport to your repair shop, home, or agreed destination.",
      ],
      [
        "Long-distance transport",
        "Pickup and delivery planned around the route and vehicle.",
      ],
      [
        "Flatbed transport",
        "Discuss loading requirements and the right equipment for your vehicle.",
      ],
      [
        "Accident & vehicle recovery",
        "Share the vehicle’s condition and position so we can assess the job.",
      ],
    ],
    prepare:
      "Have your pickup location, vehicle make and model, and destination ready. Let us know if the vehicle can roll or steer, has damage, or is difficult to access.",
    action: "Get towing help",
    imageLabel: "CAREFUL LOADING. THE RIGHT EQUIPMENT.",
  },
  {
    id: "roadside",
    number: "02",
    category: "HELP WHERE YOU’VE STOPPED",
    indexCopy: "A boost, tire, lockout, or fuel call at the roadside.",
    image: "/images/roadside-detail.webp",
    alt: "A roadside professional connecting a jump starter under a vehicle hood",
    description:
      "Sometimes you need a little help at the roadside. Tell us what happened and what you drive, and we’ll help you work out whether roadside assistance or a tow is the right next step.",
    features: [
      [
        "Battery boosts",
        "A vehicle that won’t start? Describe the symptoms when you call.",
      ],
      [
        "Tire changes",
        "Let us know your vehicle type and whether you have a usable spare.",
      ],
      [
        "Vehicle lockouts",
        "Share the make and model so we can confirm the appropriate assistance.",
      ],
      [
        "Fuel delivery",
        "Tell us your location, vehicle, and the type of fuel it requires.",
      ],
    ],
    prepare:
      "Have your exact location and vehicle details ready. For a tire change, mention whether a usable spare is available. For fuel delivery, confirm the correct fuel type.",
    action: "Get roadside help",
    imageLabel: "PRACTICAL HELP. RIGHT AT THE ROADSIDE.",
  },
  {
    id: "heavy",
    number: "03",
    category: "COMMERCIAL VEHICLES & EQUIPMENT",
    indexCopy: "A planned response for larger vehicles and loads.",
    image: "/images/heavy-recovery.webp",
    alt: "A blue heavy-duty recovery truck transporting a semi truck on a northern highway",
    description:
      "A bigger vehicle needs a carefully planned response. We help arrange transport for work trucks, RVs, and equipment, with availability and loading requirements confirmed before the job.",
    features: [
      [
        "Commercial vehicles",
        "Discuss the vehicle, load, and equipment needed for transport.",
      ],
      [
        "RVs & motorhomes",
        "Share dimensions and condition so we can plan a suitable move.",
      ],
      [
        "Equipment transport",
        "Pickup access, weight, and dimensions help us assess the job.",
      ],
      [
        "Transport planning",
        "Confirm the route, destination, and equipment availability together.",
      ],
    ],
    prepare:
      "Have the approximate weight, height, length, and width available, along with the pickup point and destination. Tell us about any cargo, damage, or access restrictions.",
    action: "Arrange heavy-duty help",
    imageLabel: "THE VEHICLE. THE LOAD. THE WHOLE JOB.",
  },
].map((detail) => ({
  ...services.find((service) => service.id === detail.id),
  ...detail,
  path: `/services/${detail.id}/`,
}));
