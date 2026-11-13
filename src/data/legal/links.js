import Link from "next/link";
import { BUSINESS, emailHref, phoneDisplay, phoneHref } from "@/data/business";

// Links for the legal pages' text, so the phone, the email and the pages'
// addresses come from one place (data/business.js, data/legalPages.js)
// instead of being typed into every document.

export function PhoneLink() {
  return <a href={phoneHref()}>{phoneDisplay()}</a>;
}

export function EmailLink() {
  return <a href={emailHref()}>{BUSINESS.email}</a>;
}

export function DocLink({ slug, children }) {
  return <Link href={`/${slug}`}>{children}</Link>;
}

export function ExternalLink({ href, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
