import { DocLink, EmailLink, PhoneLink } from "./links";

// Covers what the carriers' A2P 10DLC review and the CTIA guidelines look
// for: the program's name and what it sends, how people opt in, how often,
// "message and data rates may apply", STOP and HELP, the carriers line, and
// the privacy link. Keep it in step with the quote form's opt-in
// (SmsConsent in components/UI/FormConsent.jsx) and, once it's registered,
// with the A2P campaign for the business number (through Andranik's
// customer management provider): the ways to opt in under "Signing up"
// must match what's registered.
const smsTerms = {
  intro: (
    <p>
      These terms apply to the text messages LeTara Builders, Inc. (&ldquo;LeTara Builders,&rdquo; &ldquo;we&rdquo; or
      &ldquo;us&rdquo;) sends to people who ask us for a quote and to our clients. By agreeing to receive our texts, you
      agree to them.
    </p>
  ),
  sections: [
    {
      id: "what-we-send",
      heading: "What we send",
      body: (
        <>
          <p>
            <strong>Program name:</strong> LeTara Builders Customer Text Messages.
          </p>
          <p>
            We send text messages about your quote request and your project: answers to your questions, scheduling and
            reminders for your site visit and other appointments, updates while we build, and customer support. We
            don&rsquo;t send advertising texts.
          </p>
        </>
      ),
    },
    {
      id: "signing-up",
      heading: "Signing up",
      body: (
        <p>
          You can agree to our texts by ticking the text-message box when you ask for a quote on our website, by asking us
          to text you, by saying yes when we ask (for example, on a call), or by texting us first at <PhoneLink />.
          Agreeing to texts is never a condition of buying anything from us.
        </p>
      ),
    },
    {
      id: "how-often",
      heading: "How often",
      body: <p>How many messages we send depends on your request and your project.</p>,
    },
    {
      id: "cost",
      heading: "Cost",
      body: <p>Message and data rates may apply. Your mobile carrier can tell you what your plan includes.</p>,
    },
    {
      id: "stopping",
      heading: "Stopping texts",
      body: (
        <p>
          Reply <strong>STOP</strong> to any message to stop our texts. You&rsquo;ll get one last message confirming it,
          and nothing after that. You can also tell us by phone or email. If you change your mind, reply{" "}
          <strong>START</strong> or let us know.
        </p>
      ),
    },
    {
      id: "help",
      heading: "Help",
      body: (
        <p>
          Reply <strong>HELP</strong> to any message for help, or reach us at <PhoneLink /> or <EmailLink />.
        </p>
      ),
    },
    {
      id: "carriers",
      heading: "Carriers",
      body: <p>Mobile carriers are not liable for delayed or undelivered messages.</p>,
    },
    {
      id: "your-number",
      heading: "Your number",
      body: (
        <p>
          To sign up you must be at least 18, and the account holder for the mobile number or have their permission. If
          you change or give up your number, tell us or reply STOP from it first, so its next owner doesn&rsquo;t get our
          texts.
        </p>
      ),
    },
    {
      id: "privacy",
      heading: "Privacy",
      body: (
        <p>
          We handle your mobile number and your consent as our <DocLink slug="privacy-policy">Privacy Policy</DocLink>{" "}
          describes. No mobile information will be shared with third parties or affiliates for marketing or promotional
          purposes. Text messaging opt-in data and consent will not be shared with any third parties.
        </p>
      ),
    },
    {
      id: "changes",
      heading: "Changes to these terms",
      body: (
        <p>
          We may update these terms from time to time. When we do, we&rsquo;ll post the new version here and change the
          &ldquo;Last updated&rdquo; date at the top. Our <DocLink slug="terms-of-service">Terms of Service</DocLink> also
          apply.
        </p>
      ),
    },
  ],
};

export default smsTerms;
