import type { Metadata } from "next";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";
import { InfoPage } from "@/components/info-page";

export const metadata: Metadata = {
  title: "Privacy Policy | ReSuply",
  description: "How ReSuply collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <InfoPage
        eyebrow="Privacy"
        title="Privacy Policy"
        updatedAt="June 29, 2026"
        intro="This policy explains how ReSuply handles information from customers, shoppers, and visitors who join our waitlist or contact us."
        sections={[
          {
            title: "Information We Collect",
            body: [
              "We may collect your name, email address, phone number, city, and the markets or stores you know when you join the waitlist or apply to become a shopper.",
              "We may also collect basic technical information such as device type, browser, pages visited, and referral source to understand how people use the site.",
            ],
          },
          {
            title: "How We Use Information",
            body: [
              "We use your information to manage the waitlist, contact you about launch updates, review shopper applications, and improve ReSuply.",
              "For shopper applications, market and store information may help us organize shoppers by the locations they know when ReSuply launches.",
            ],
          },
          {
            title: "Sharing",
            body: [
              "We do not sell your personal information. We may share information with service providers who help us operate the website, manage communications, or prepare for launch.",
              "We may also disclose information if required by law, to protect users, or to protect ReSuply from fraud, abuse, or security risks.",
            ],
          },
          {
            title: "Retention And Choices",
            body: [
              "We keep information only for as long as it is useful for the waitlist, launch preparation, legal, safety, or operational purposes.",
              "You can ask us to update or remove your information by contacting hello@useresuply.com.",
            ],
          },
          {
            title: "Contact",
            body: [
              "For privacy questions, email hello@useresuply.com.",
            ],
          },
        ]}
      />
      <Footer />
    </>
  );
}
