"use client";

import { MotionConfig } from "framer-motion";

// Honors the visitor's "reduce motion" OS setting across every framer-motion
// animation on the site: slides, scales and rotations are skipped, while
// fades still play. The Accessibility Statement (once there is one) will
// promise this ("turning off or toning down"). What carries meaning plays a
// calmer version instead of nothing, because the user's own iPhone has
// Reduce Motion on: the homepage intro (Hero/HeroIntro), the hero timelapse
// (HeroBuildSequence) and the testimonials wall (Home/Testimonials, at half
// speed). The scroll reveals (Home/Reveal) and the page transition's line
// are CSS and tone themselves down.
export default function MotionPreferences({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
