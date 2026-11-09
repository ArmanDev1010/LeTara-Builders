import Link from "next/link";
import { BUSINESS } from "@/data/business";

// The legal pages open in a new tab from the forms, so following a link
// doesn't throw away a half-finished request.
function LegalLink({ slug, children }) {
  return (
    <Link
      href={`/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="underline underline-offset-2 hover:text-third"
    >
      {children}
    </Link>
  );
}

// The text-message opt-in that the TCPA and the carriers' A2P 10DLC rules
// require before LeTara texts a lead from the website: unchecked by default
// and optional (the form sends either way), naming who texts, about what, how
// often, the cost, and how to stop. It registers as `smsConsent`; the API
// route stamps the time and the lead notification says whether texting is
// allowed. Keep the wording in step with the SMS Terms and the Privacy
// Policy's text-message section (not built yet — the links below 404 until
// they are) and with the A2P campaign registration.
// `dark` sets the text for a dark background (the quote dialog).
export function SmsConsent({ register, dark = false, className = "" }) {
  return (
    <label className={`flex items-start gap-3 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        {...register("smsConsent")}
        className="mt-[3px] h-4 w-4 shrink-0 accent-third cursor-pointer"
      />
      <span className={`text-[12px] leading-relaxed ${dark ? "text-white/50" : "text-fourth"}`}>
        <span className={`font-semibold ${dark ? "text-white/85" : "text-black/80"}`}>
          Text me about my request.
        </span>{" "}
        I agree to receive text messages from {BUSINESS.legalName} at the number
        above about my estimate, scheduling, and project updates, which may be
        sent using automated technology. Consent is not a condition of purchase.
        Message frequency varies. Msg &amp; data rates may apply. Reply STOP to
        opt out, HELP for help. See our{" "}
        <LegalLink slug="sms-terms">SMS Terms</LegalLink> and{" "}
        <LegalLink slug="privacy-policy">Privacy Policy</LegalLink>.
      </span>
    </label>
  );
}

// The line under a form's submit button: agreeing to the Terms by sending,
// and where the Privacy Policy is.
export function FormLegalNote({ dark = false, className = "" }) {
  return (
    <p className={`text-[12px] leading-snug ${dark ? "text-white/50" : "text-fourth"} ${className}`}>
      By sending this request, you agree to our{" "}
      <LegalLink slug="terms-of-service">Terms of Service</LegalLink> and{" "}
      <LegalLink slug="privacy-policy">Privacy Policy</LegalLink>. We never
      sell your information.
    </p>
  );
}
