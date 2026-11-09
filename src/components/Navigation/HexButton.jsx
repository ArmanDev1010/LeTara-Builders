import { BsInstagram } from "react-icons/bs";
import { BUSINESS } from "@/data/business";

// A hexagon, point up, like the logo's mark (viewBox 0 0 40 46).
export const HEX = "20,1.5 38.5,12 38.5,34 20,44.5 1.5,34 1.5,12";

// An icon button on a hexagon outline (Instagram, the menu). Size it with
// `className`.
export function HexButton({ as: Tag = "button", className = "", children, ...props }) {
  return (
    <Tag
      {...props}
      className={`relative grid place-items-center shrink-0 text-white/85 hover:text-third transition-colors duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-third ${className}`}
    >
      <svg aria-hidden="true" viewBox="0 0 40 46" className="absolute inset-0 w-full h-full">
        <polygon points={HEX} fill="none" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.5" />
      </svg>
      {children}
    </Tag>
  );
}

export function InstagramButton({ className = "", iconClassName = "" }) {
  return (
    <HexButton
      as="a"
      href={BUSINESS.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${BUSINESS.name} on Instagram`}
      className={className}
    >
      <BsInstagram aria-hidden="true" className={`relative ${iconClassName}`} />
    </HexButton>
  );
}
