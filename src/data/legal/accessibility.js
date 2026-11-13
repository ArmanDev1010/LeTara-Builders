import { EmailLink, ExternalLink, PhoneLink } from "./links";

// List only what's really in place: a statement that overstates is worse
// than none. "What we've done" maps to: the <label>s wrapping the form's
// fields (Quote/EstimateForm); the text descriptions on every image and on
// the drawn scenes (their canvases' role="img" and aria-label); Reduce
// Motion (UI/MotionPreferences, globals.css, and the calm versions in
// HeroIntro, ServiceHero, the reviews, the page transition and the reveals:
// the animations still play, calmer and slower, with no zoom, fades for
// slides, and only pure atmosphere such as the hero's dust stopped); the
// phone and email beside every form. Keep the motion wording true whenever
// motion changes (CLAUDE.md).
const accessibility = {
  intro: (
    <p>
      LeTara Builders, Inc. wants everyone, including people with disabilities, to be able to use letarabuilders.com (the
      &ldquo;Site&rdquo;) and reach us easily.
    </p>
  ),
  sections: [
    {
      id: "our-standard",
      heading: "Our standard",
      body: (
        <p>
          We&rsquo;re working to make the Site meet the{" "}
          <ExternalLink href="https://www.w3.org/TR/WCAG21/">Web Content Accessibility Guidelines (WCAG) 2.1</ExternalLink>
          , Level AA. These guidelines explain how to make websites easier to use for people who are blind or have low
          vision, are deaf or hard of hearing, or have mobility, cognitive or other disabilities. The Site may not meet
          every guideline yet, and we keep improving it.
        </p>
      ),
    },
    {
      id: "what-we-have-done",
      heading: "What we’ve done",
      body: (
        <ul>
          <li>Labeled the form&rsquo;s fields, so screen readers announce what each one asks for.</li>
          <li>Given the photos, and the animated drawings of houses, text descriptions.</li>
          <li>
            Followed your device&rsquo;s &ldquo;reduce motion&rdquo; setting: the animations play calmer, slower versions,
            with fades in place of slides and no zooming, and purely decorative movement stops.
          </li>
          <li>Given our phone number beside the quote form, and our email with it on the page, so the form is never the only way to reach us.</li>
          <li>Checked new pages and features for accessibility as we build them.</li>
        </ul>
      ),
    },
    {
      id: "known-limitations",
      heading: "Known limitations",
      body: (
        <>
          <p>Some content, such as the Google map of the areas we serve and our Instagram page, comes from other companies and is outside our control.</p>
          <p>
            If anything on the Site gets in your way, the quote form included, call us at <PhoneLink /> or email{" "}
            <EmailLink /> and we&rsquo;ll take your request directly.
          </p>
        </>
      ),
    },
    {
      id: "feedback",
      heading: "Feedback and help",
      body: (
        <p>
          If you have trouble with any part of the Site, or ideas to make it easier to use, contact us at <PhoneLink /> or{" "}
          <EmailLink />. Please tell us which page you were on and what went wrong, and we&rsquo;ll get back to you.
        </p>
      ),
    },
  ],
};

export default accessibility;
