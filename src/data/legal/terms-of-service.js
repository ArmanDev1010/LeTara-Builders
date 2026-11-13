import { BUSINESS } from "@/data/business";
import { DocLink, EmailLink } from "./links";

// These cover the website only. The building work is governed by each
// client's signed written contract, so nothing here (the website disclaimer,
// the liability limit, where disputes go) reaches the work; those sections
// each say so.
const termsOfService = {
  intro: (
    <p>
      These terms govern your use of letarabuilders.com (the &ldquo;Site&rdquo;), run by LeTara Builders, Inc.
      (&ldquo;LeTara Builders,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo; or &ldquo;our&rdquo;), a California corporation
      and licensed general contractor (CSLB #{BUSINESS.license}). By using the Site or sending us a request through it,
      you agree to these terms. If you don&rsquo;t, please don&rsquo;t use the Site.
    </p>
  ),
  sections: [
    {
      id: "the-site-not-the-work",
      heading: "The Site, not the work",
      body: (
        <p>
          These terms are about the Site only. Anything we design or build for you is governed by a separate written
          contract between you and LeTara Builders, described next.
        </p>
      ),
    },
    {
      id: "your-contract",
      heading: "Your project and your contract",
      body: (
        <>
          <p>
            The Site describes what we build: new homes, home additions, ADUs, remodels and outdoor living spaces. Asking
            for a quote, booking a site visit, getting a quote or talking with us about a project doesn&rsquo;t create a
            contract, and doesn&rsquo;t commit you or us to anything.
          </p>
          <p>
            We start work only once you and LeTara Builders have signed a written contract. That contract, not the Site,
            sets the scope of the work, the price, the payment schedule, the timeline and the warranties, and explains
            your rights, including any right to cancel that California law gives you. If the Site and your contract ever
            disagree, the contract wins.
          </p>
        </>
      ),
    },
    {
      id: "quotes-and-information",
      heading: "Quotes and project information",
      body: (
        <p>
          What the Site says about sizes, rules and how projects go, and any quote or estimate we give before a contract
          is signed, is for planning. It depends on your property, your design, engineering, what the permit office
          requires, the cost of materials, and conditions no one can see until we visit or open things up. Only the price
          and schedule in your signed contract are binding. Our <DocLink slug="disclaimer">Disclaimer</DocLink> says
          more.
        </p>
      ),
    },
    {
      id: "requests-and-site-visits",
      heading: "Requests and site visits",
      body: (
        <>
          <p>When you send us a request or book a site visit through the Site, you agree to:</p>
          <ul>
            <li>give accurate information, with a phone number and email address that are yours or that you may use;</li>
            <li>ask only about property you own or are allowed to act for; and</li>
            <li>not send a request for someone else without their permission.</li>
          </ul>
          <p>
            A site visit you book holds that time on our calendar. If we need to move it, we&rsquo;ll contact you to find
            another time, and you can ask us to move or cancel it the same way.
          </p>
          <p>
            By sending a request, you agree that we may call or email you about it. We text you only if you agree to it,
            as our <DocLink slug="sms-terms">SMS Terms</DocLink> explain. Our{" "}
            <DocLink slug="privacy-policy">Privacy Policy</DocLink> explains what we do with your information.
          </p>
        </>
      ),
    },
    {
      id: "using-the-site",
      heading: "Using the Site",
      body: (
        <>
          <p>Please don&rsquo;t:</p>
          <ul>
            <li>use the Site for anything unlawful;</li>
            <li>send false or spam requests, or pretend to be someone else;</li>
            <li>try to get into the Site, its servers or any connected system without permission;</li>
            <li>disrupt the Site, for example with malware or by overloading it; or</li>
            <li>copy content or data from the Site by automated means, such as scraping, without our written permission.</li>
          </ul>
        </>
      ),
    },
    {
      id: "our-content",
      heading: "Our content",
      body: (
        <>
          <p>
            The Site and what&rsquo;s on it, including its text, photos, drawings, animations, logo and the LeTara Builders
            name, belong to LeTara Builders or are used with permission, and are protected by copyright, trademark and
            other laws. You may view and print pages for your own personal use. Please don&rsquo;t copy, change, share or
            reuse them for anything else without our written permission.
          </p>
          <p>Clients&rsquo; reviews appear with their permission and remain theirs.</p>
        </>
      ),
    },
    {
      id: "copyright",
      heading: "Copyright concerns",
      body: (
        <p>
          If you believe something on the Site infringes your copyright, email us at <EmailLink /> with what the work is,
          where it appears on the Site, how to reach you, and a statement that you believe in good faith the use
          isn&rsquo;t authorized. We&rsquo;ll look into it and reply.
        </p>
      ),
    },
    {
      id: "other-services",
      heading: "Other companies' services",
      body: (
        <p>
          The Site links to and uses services run by other companies, such as Google Maps and Instagram. We don&rsquo;t
          control them and aren&rsquo;t responsible for their content or practices; their own terms and privacy policies
          apply when you use them.
        </p>
      ),
    },
    {
      id: "website-disclaimer",
      heading: "The Site as it is",
      body: (
        <>
          <p>
            The Site is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; As far as the law allows, we make no
            warranties about it, express or implied, including warranties of merchantability, fitness for a particular
            purpose and non-infringement, and we don&rsquo;t promise it will always be available, free of errors or free
            of harmful components.
          </p>
          <p>
            This is about the Site only. It doesn&rsquo;t limit any warranty in your contract, or any warranty or right
            the law gives you, for work we do.
          </p>
        </>
      ),
    },
    {
      id: "limitation-of-liability",
      heading: "Limitation of liability",
      body: (
        <>
          <p>
            As far as the law allows, LeTara Builders and its owners, employees and agents won&rsquo;t be liable for any
            indirect, incidental, special, consequential or punitive damages, or for lost data or profits, arising from
            your use of the Site or your inability to use it. Our total liability for any claim arising from your use of
            the Site is limited to one hundred dollars ($100).
          </p>
          <p>
            This too is about the Site only. Our responsibilities for work we do are set by your contract and the law.
          </p>
        </>
      ),
    },
    {
      id: "indemnification",
      heading: "Indemnification",
      body: (
        <p>
          You agree to indemnify and hold harmless LeTara Builders and its owners, employees and agents from any claims,
          losses and expenses, including reasonable attorneys&rsquo; fees, arising from your breaking these terms or
          misusing the Site.
        </p>
      ),
    },
    {
      id: "disputes",
      heading: "California law and disputes",
      body: (
        <p>
          These terms are governed by California law, without regard to its conflict-of-law rules. Any dispute arising
          from these terms or your use of the Site will be decided by the state or federal courts in Los Angeles County,
          California, and you and LeTara Builders agree to those courts&rsquo; jurisdiction. Disputes about work we do are
          resolved as your contract provides.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: (
        <p>
          We may update these terms from time to time. When we do, we&rsquo;ll post the new version here and change the
          &ldquo;Last updated&rdquo; date at the top. Changes apply from the day they&rsquo;re posted; using the Site after
          that means you accept them.
        </p>
      ),
    },
    {
      id: "general",
      heading: "General",
      body: (
        <p>
          If any part of these terms can&rsquo;t be enforced, the rest still applies. If we don&rsquo;t enforce a part, we
          can still enforce it later. These terms, with our <DocLink slug="privacy-policy">Privacy Policy</DocLink>,{" "}
          <DocLink slug="sms-terms">SMS Terms</DocLink> and <DocLink slug="disclaimer">Disclaimer</DocLink>, are the whole
          agreement between you and LeTara Builders about using the Site.
        </p>
      ),
    },
  ],
};

export default termsOfService;
