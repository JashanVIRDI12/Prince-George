import { additionalServices } from "./additionalServices";

// Copy for the individual service pages. `features` and `fieldCopy` replace
// the services page versions in serviceContent.js on these pages.
export const servicePageContent = {
  towing: {
    heroAlt: "Prince George Towing’s heavy-duty recovery truck and lifting equipment",
    heroLead:
      "Towing for cars, SUVs, pickups, and vans in Prince George, planned around your vehicle, location, and destination.",
    introHeading: "When your vehicle cannot make the trip.",
    introCopy:
      "A breakdown, collision, or dead battery can leave your car or pickup stuck when you least expect it. Tell us what happened, where your vehicle is located, and what condition it’s in. We’ll help determine the right towing approach, equipment, and destination before arranging the move.",
    capabilityLead:
      "From a simple local tow to a more involved recovery, every situation requires a different approach. We assess your vehicle, location, and needs to arrange the right solution.",
    features: [
      [
        "Local towing",
        "Transport your vehicle safely to your repair shop, home, or preferred destination within the local area.",
      ],
      [
        "Long-distance transport",
        "Need your vehicle moved further away? We help plan transport around your route, vehicle condition, and destination.",
      ],
      [
        "Flatbed transport",
        "For vehicles requiring extra care, flatbed transport provides a secure way to move your vehicle with proper loading support.",
      ],
      [
        "Accident & vehicle recovery",
        "After a collision or difficult roadside situation, we help assess the vehicle and arrange safe recovery based on the circumstances.",
      ],
    ],
    fieldImage: "/images/fleet-heavy-equipment.webp",
    fieldAlt: "Rear lifting equipment on Prince George Towing’s heavy-duty wrecker",
    fieldCaption: "RECOVERY EQUIPMENT MATCHED TO THE JOB",
    fieldHeading: "Start with where it is. We’ll plan where it goes.",
    fieldCopy:
      "Having the right details ready helps us understand the situation and arrange the right support. Share your location, vehicle information, and where it needs to be taken.",
    steps: [
      ["Your location", "Provide your address, intersection, highway marker, or a nearby landmark so we can identify where help is needed."],
      ["The vehicle", "Tell us the make, model, condition, and whether the vehicle can roll, steer, or needs special handling."],
      ["The next stop", "Share where the vehicle needs to go, whether it’s a repair shop, home address, or another destination."],
    ],
    questions: [
      ["Can you take my vehicle to a repair shop?", "Yes. We can transport your vehicle to your preferred repair shop, home, or another agreed destination. Share the pickup location and where you need the vehicle taken, and we’ll help arrange the right solution."],
      ["What if the vehicle cannot roll or steer?", "Let us know the vehicle’s condition when you call. This helps us understand the situation and determine the appropriate equipment and approach for safe recovery."],
      ["Can you help after a collision?", "Yes. We provide accident and vehicle recovery support. Share your location, vehicle condition, and any access concerns so we can plan the safest way to move the vehicle."],
      ["Do you provide long-distance vehicle transport?", "Yes. We can help arrange longer-distance transport based on your vehicle, pickup location, and destination requirements."],
      ["What information should I provide before arranging a tow?", "Have your location, vehicle make and model, condition of the vehicle, and destination details ready. This helps us understand your needs and prepare the right service."],
    ],
  },
  roadside: {
    heroAlt: "A roadside technician providing a battery boost beside Prince George Towing’s white and burgundy truck",
    heroLead:
      "Practical help when your vehicle needs a little support. Battery issues, flat tires, lockouts, or running out of fuel. We’ll help assess the situation and provide the right roadside solution to get you moving again.",
    introHeading: "When a small problem stops the journey.",
    introCopy:
      "A dead battery, flat tire, lockout, or empty fuel tank can leave you stuck when you least expect it. Tell us where you are and what happened, and we’ll help find the right solution to get you moving again.",
    capabilityLead:
      "From quick roadside fixes to getting you back on the road, we help handle the unexpected problems that stop your journey.",
    features: [
      [
        "Battery boosts",
        "A vehicle that won’t start can happen anytime. We’ll assess the issue and help get your battery running again.",
      ],
      [
        "Tire changes",
        "A flat tire does not have to ruin your trip. Let us know your vehicle details and spare tire availability, and we’ll help with the change.",
      ],
      [
        "Vehicle lockouts",
        "Locked out of your vehicle? Share your make and model, and we’ll provide the right assistance to help you regain access.",
      ],
      [
        "Fuel delivery",
        "Running low or out of fuel? Tell us your location and vehicle requirements, and we’ll help get you what you need.",
      ],
    ],
    fieldImage: "/images/fleet-recovery-profile.webp",
    fieldAlt: "Prince George Towing’s white and burgundy heavy recovery truck",
    fieldCaption: "ROADSIDE HELP, WITH A PLAN FOR WHAT FOLLOWS",
    fieldHeading: "Tell us what happened. We’ll take it from there.",
    fieldCopy:
      "Share your location, vehicle details, and what went wrong. A few simple details help us understand the situation and arrange the right roadside support.",
    steps: [
      ["Your location", "Share your street address, highway marker, or a nearby landmark so we know where to reach you."],
      ["Your vehicle", "Tell us your vehicle make, model, and condition so we can understand what assistance may be needed."],
      ["The issue", "Explain what happened, whether it is a flat tire, battery problem, lockout, or fuel issue."],
    ],
    questions: [
      ["What roadside assistance services do you provide?", "We help with common roadside issues including battery boosts, tire changes, vehicle lockouts, and fuel delivery."],
      ["What information should I provide when I call?", "Share your location, vehicle make and model, and details about the issue so we can understand the situation and arrange the right support."],
      ["Can you help if I am on a highway or remote location?", "Yes. Provide your exact location or nearest landmark, and we’ll confirm the best way to assist you."],
      ["What if my vehicle cannot be fixed at the roadside?", "If a roadside solution is not possible, we can help determine whether towing or further vehicle transport is needed."],
      ["Do I need to provide a spare tire for a tire change?", "If you have a usable spare available, let us know when you call. We’ll guide you through the next steps based on your vehicle situation."],
    ],
  },
  heavy: {
    heroAlt: "Prince George Towing’s white and burgundy Kenworth heavy-duty recovery truck",
    heroLead:
      "Heavy-duty towing and recovery for buses, coaches, semi trucks, and commercial fleets, plus equipment transport in Prince George and surrounding areas.",
    introHeading: "Big vehicles. A carefully planned recovery.",
    introCopy:
      "A bus breakdown or disabled semi truck calls for more than a standard tow. We plan the response around the vehicle’s weight, condition, load, and location. From a highway shoulder to a commercial yard, we discuss equipment, access, and the destination before the job starts.",
    capabilityLead:
      "Alongside car towing, we handle heavy-duty recovery for buses and commercial trucks, plus equipment transport planned around size, weight, access, and destination.",
    fieldImage: "/images/fleet-coach.webp",
    fieldAlt: "Prince George Towing’s white and burgundy wrecker towing a passenger coach at a forested highway turnout",
    fieldCaption: "BUS & COACH TOWING",
    fieldHeading: "Tell us about the bus, the truck, and the road.",
    fieldCopy:
      "The right vehicle details help us prepare the right recovery. Tell dispatch what has stopped, where it is, and whether it can roll or steer. For a bus, let us know whether passengers are still on board; for a truck, describe the trailer and load.",
    steps: [
      ["Vehicle and load", "Share the bus or truck type, approximate weight and length, trailer or load details, and any damage or mechanical issues."],
      ["Location and access", "Give your highway, direction of travel, nearest kilometre marker, and room for recovery equipment. Mention soft ground, narrow access, or blocked lanes."],
      ["Destination and handoff", "Tell us the repair facility, depot, or yard you need. We’ll discuss the route, equipment availability, and service details before arranging the move."],
    ],
    questions: [
      ["Can you tow buses and passenger coaches?", "Yes. We provide heavy-duty towing support for buses and coaches. Share the bus type, approximate length and weight, condition, location, and passenger situation so we can confirm the right recovery plan."],
      ["Do you recover semi trucks and commercial vehicles?", "Yes. We assist with semi trucks, highway tractors, work trucks, and commercial fleets. Tell us about the tractor, trailer, load, and any damage so we can determine the equipment and access needed."],
      ["Can you help with a vehicle off the road?", "Call with the vehicle’s position, ground conditions, access, and any damage. We’ll discuss winching and recovery options based on the situation and available equipment."],
      ["Can you move equipment or a motorhome?", "We can discuss transport for equipment, RVs, and motorhomes. Have the dimensions, approximate weight, condition, pickup location, and destination ready so we can confirm requirements."],
      ["Can you arrange a longer-distance heavy-duty tow?", "Share the pickup point and destination with dispatch. We’ll review the vehicle, route, distance, and equipment availability before confirming the move."],
    ],
  },
  ...Object.fromEntries(additionalServices.map((service) => [service.id, service])),
};
