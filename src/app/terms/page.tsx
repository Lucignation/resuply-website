import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Terms | ReSuply",
  description: "Terms for using the ReSuply website and joining the waitlist.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <InfoPage
        eyebrow="Terms"
        title="Terms Of Use"
        updatedAt="June 29, 2026"
        intro="These terms apply to your use of the ReSuply website, waitlist, and shopper interest forms before the full service launches."
        sections={[
          {
            title: "Use Of The Website",
            body: [
              "You may use this website to learn about ReSuply, join the customer waitlist, or apply interest in becoming a shopper.",
              "You agree not to misuse the website, submit false information, attempt to disrupt the service, or use the site for unlawful purposes.",
            ],
          },
          {
            title: "Waitlist And Shopper Applications",
            body: [
              "Joining the waitlist does not guarantee access to ReSuply at launch. Shopper applications are expressions of interest and do not create employment, agency, or contractor status.",
              "If you apply as a shopper, you are responsible for providing accurate information about your city and the markets or stores you know.",
            ],
          },
          {
            title: "No Launch Guarantee",
            body: [
              "ReSuply is currently preparing for launch. Features, locations, availability, eligibility, and pricing may change before or after launch.",
            ],
          },
          {
            title: "Content And Brand",
            body: [
              "The ReSuply name, design, text, and visual materials belong to ReSuply or its licensors. You may not copy or reuse them without permission.",
            ],
          },
          {
            title: "Limitation Of Liability",
            body: [
              "The website is provided as-is for informational and waitlist purposes. To the fullest extent allowed by law, ReSuply is not liable for indirect, incidental, or consequential losses from using the website.",
            ],
          },
          {
            title: "Contact",
            body: [
              "Questions about these terms can be sent to hello@useresuply.com.",
            ],
          },
        ]}
      />
      <Footer />
    </>
  );
}
