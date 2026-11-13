import { DocLink, ExternalLink } from "./links";

// Keep it true to what the site does. Update it (and its date in
// data/legalPages.js) whenever a form field, a provider or a script is added
// or removed:
// - Providers are named by category (the website host, the customer
//   management and scheduling provider, the email provider, the phone and
//   text messaging provider), as on HB Links. Google is named for the map,
//   which it serves itself.
// - There are no analytics yet (11-13: they come after launch). When they're
//   added (HB Links' Google Analytics, without Google signals or ads
//   personalization), add them to "Information collected automatically",
//   the providers and "Cookies", and name Google Analytics (its terms
//   require it). Turning on signals or ads, or adding an ad pixel, would
//   also break "we don't sell or share".
// - The two sentences about mobile information in "Text messages" are the
//   carriers' A2P 10DLC wording; keep them word for word.
const privacyPolicy = {
  intro: (
    <p>
      This policy explains what information LeTara Builders, Inc. (&ldquo;LeTara Builders,&rdquo; &ldquo;we,&rdquo;
      &ldquo;us&rdquo; or &ldquo;our&rdquo;) collects through letarabuilders.com (the &ldquo;Site&rdquo;) and when you
      get in touch with us, what we do with it, who we share it with, and the choices you have.
    </p>
  ),
  sections: [
    {
      id: "what-we-collect",
      heading: "What we collect",
      body: (
        <>
          <h3>What you tell us</h3>
          <p>When you ask for a quote or book a site visit through the Site, we collect:</p>
          <ul>
            <li>
              <strong>Your contact details:</strong> your name, phone number and email address.
            </li>
            <li>
              <strong>Your project:</strong> the kind of project, the property&rsquo;s address, the day and time you pick
              for a site visit, and anything else you write to us.
            </li>
            <li>
              <strong>Your text-message choice:</strong> whether you agreed to receive texts from us, and when.
            </li>
          </ul>
          <p>
            We also keep records of the calls, texts and emails we exchange with you. If you hire us, we collect what we
            need to design, permit, build and bill your project, such as plans, measurements, photos of the property,
            permit records and payment details.
          </p>
          <h3>Information collected automatically</h3>
          <p>
            Like most websites, the Site&rsquo;s host automatically records technical information when you visit, such as
            your IP address, your browser and device, the pages you open, the page that sent you to us, and the date and
            time. We use it to keep the Site running and secure.
          </p>
        </>
      ),
    },
    {
      id: "how-we-use-it",
      heading: "How we use it",
      body: (
        <>
          <p>We use your information to:</p>
          <ul>
            <li>answer your request, schedule and confirm your site visit, and prepare your quote;</li>
            <li>reach you by phone or email about your request, and by text if you agreed to texts;</li>
            <li>design, permit, build and bill your project if you hire us, and look after it afterward;</li>
            <li>keep the Site working, and protect it from spam, fraud and abuse;</li>
            <li>keep the records our license, our taxes and the law require; and</li>
            <li>enforce our agreements and protect our rights.</li>
          </ul>
        </>
      ),
    },
    {
      id: "text-messages",
      heading: "Text messages",
      body: (
        <>
          <p>
            We text you only if you agree to it: by ticking the text-message box on our quote form, by asking us to text
            you, by saying yes when we ask, or by texting us first. We use your mobile number for messages about your
            request and your project, such as scheduling your site visit, reminders, and updates while we build. How
            often we text depends on your project, and message and data rates may apply. Reply STOP to any message to
            stop, or HELP for help. Our <DocLink slug="sms-terms">SMS Terms</DocLink> have the details.
          </p>
          <p>
            No mobile information will be shared with third parties or affiliates for marketing or promotional purposes.
            All the categories of sharing described in this policy exclude text messaging originator opt-in data and
            consent; this information will not be shared with any third parties.
          </p>
        </>
      ),
    },
    {
      id: "who-we-share-it-with",
      heading: "Who we share it with",
      body: (
        <>
          <p>
            We don&rsquo;t sell your personal information, and we don&rsquo;t share it for cross-context behavioral
            advertising. We share it only:
          </p>
          <ul>
            <li>
              <strong>With the companies that help us run our business and the Site:</strong> our website host, our
              customer management and scheduling provider, our email provider, and our phone and text messaging provider.
              They may use it only to provide their services to us.
            </li>
            <li>
              <strong>With the people who help build your project:</strong> such as architects, engineers, designers and
              licensed subcontractors, when they need it to plan or do the work.
            </li>
            <li>
              <strong>With government offices:</strong> such as the City of Los Angeles&rsquo; Department of Building and
              Safety or your city&rsquo;s building department, for permits and inspections.
            </li>
            <li>
              <strong>When the law requires it:</strong> to answer a subpoena or court order, or to protect the rights,
              property or safety of LeTara Builders, our clients or others.
            </li>
            <li>
              <strong>If our business changes hands:</strong> as part of a merger, sale or transfer of all or part of it.
            </li>
            <li>
              <strong>When you ask us to,</strong> or agree to it.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies-and-maps",
      heading: "Cookies and maps",
      body: (
        <>
          <p>The Site doesn&rsquo;t use cookies of its own for advertising or to track you across other websites.</p>
          <p>
            The map of the areas we serve is provided by Google. When it loads, Google receives information such as your
            IP address and may set cookies of its own, under{" "}
            <ExternalLink href="https://policies.google.com/privacy">Google&rsquo;s Privacy Policy</ExternalLink>. Most
            browsers let you block or delete cookies; if you do, the map may not work.
          </p>
          <p>
            <strong>Do Not Track.</strong> There&rsquo;s no common standard for answering a browser&rsquo;s &ldquo;Do Not
            Track&rdquo; signal, so the Site doesn&rsquo;t respond to it.
          </p>
        </>
      ),
    },
    {
      id: "how-long-we-keep-it",
      heading: "How long we keep it",
      body: (
        <p>
          We keep quote requests and the messages about them for as long as we need to answer and follow up. We keep the
          records of projects we build, such as contracts, plans, permits, invoices and warranty records, for as long as
          our license, our taxes, our warranties and the law require, which can be ten years or more after a project is
          finished. When we no longer need information, we delete it or remove what identifies you.
        </p>
      ),
    },
    {
      id: "keeping-it-safe",
      heading: "Keeping it safe",
      body: (
        <p>
          We take reasonable steps to protect your information, in how we handle it and in the services we use. No website
          or system is completely secure, so we can&rsquo;t promise that nothing will ever go wrong. If a breach affects
          your personal information, we&rsquo;ll tell you as the law requires.
        </p>
      ),
    },
    {
      id: "your-choices",
      heading: "Your choices",
      body: (
        <>
          <p>You can ask us to:</p>
          <ul>
            <li>tell you what personal information we have about you;</li>
            <li>correct anything that&rsquo;s wrong; or</li>
            <li>delete it.</li>
          </ul>
          <p>
            Call or email us using the details below. We&rsquo;ll confirm it&rsquo;s you before we act, and answer within
            45 days. We may keep what the law requires us to keep, such as contracts, permit records and tax records.
          </p>
          <p>You can stop our texts at any time by replying STOP to any of them.</p>
        </>
      ),
    },
    {
      id: "california",
      heading: "Your California rights",
      body: (
        <p>
          California&rsquo;s &ldquo;Shine the Light&rdquo; law (Civil Code &sect; 1798.83) lets California residents ask
          whether a business has shared their personal information with other companies for those companies&rsquo; own
          marketing. We don&rsquo;t. For any question about your privacy rights under California law, contact us using the
          details below.
        </p>
      ),
    },
    {
      id: "children",
      heading: "Children",
      body: (
        <p>
          The Site is meant for adults planning a project, not for children. We don&rsquo;t knowingly collect personal
          information from anyone under 16. If you believe a child has sent us theirs, contact us and we&rsquo;ll delete
          it.
        </p>
      ),
    },
    {
      id: "other-sites",
      heading: "Other websites",
      body: (
        <p>
          The Site links to other websites and services, such as Google Maps and Instagram. Their own privacy policies,
          not this one, cover what they do with your information.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      body: (
        <p>
          We may update this policy from time to time. When we do, we&rsquo;ll post the new version here and change the
          &ldquo;Last updated&rdquo; date at the top. If a change is significant, we&rsquo;ll also note it on the Site.
        </p>
      ),
    },
  ],
};

export default privacyPolicy;
