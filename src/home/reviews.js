// Customer reviews for the home page.
//
// Only paste real reviews, copied word for word from the Google Business
// Profile (or another public source) with the customer's name as it appears
// there. Publishing invented reviews misleads customers and breaks Canada's
// Competition Act rules on fake reviews.
//
// Entries marked `sample: true` are placeholders so the design can be seen
// during development. They never reach the live site: the production build
// leaves them out, and the reviews section disappears until at least one
// real review is added. Replace them, and delete `sample: true`.
//
// `photo` is one of the job photos below, chosen to match the review; the
// photos are illustrative scenes based on the company's truck, not portraits
// of the reviewer or documentary photographs of their job.
import { homePhotoUrl } from "./photography";

const photos = {
  heavy: {
    src: homePhotoUrl("heavy-towing-960"),
    alt: "The company’s heavy wrecker towing a passenger coach",
  },
  towing: {
    src: homePhotoUrl("car-towing-960"),
    alt: "The company’s white and burgundy wrecker towing a sedan",
  },
  roadside: {
    src: homePhotoUrl("roadside-960"),
    alt: "An operator boosting a car battery beside the company’s truck",
  },
  highway: {
    src: homePhotoUrl("hero-960"),
    alt: "The company’s recovery truck beside a forested highway",
  },
};

const allReviews = [
  {
    sample: true,
    name: "Sample review",
    designation: "Replace with a real Google review",
    quote:
      "Paste a real customer review here, word for word. The best ones say what happened, how long the truck took to arrive and how the driver handled it.",
    photo: photos.towing,
  },
  {
    sample: true,
    name: "Sample review",
    designation: "Replace with a real Google review",
    quote:
      "A review from a fleet or bus operator works well here, since heavy-duty recovery is what sets the company apart. Keep it to two or three sentences.",
    photo: photos.heavy,
  },
  {
    sample: true,
    name: "Sample review",
    designation: "Replace with a real Google review",
    quote:
      "A roadside story fits here: a battery boost, a lockout or a flat tire on the highway. Ask happy customers for a Google review, then copy it in.",
    photo: photos.roadside,
  },
];

export const reviews = (
  import.meta.env.PROD ? allReviews.filter((review) => !review.sample) : allReviews
).map(({ photo, ...review }) => ({ ...review, src: photo.src, alt: photo.alt }));
