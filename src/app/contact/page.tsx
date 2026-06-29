import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/sections/footer";
import { Header } from "@/components/sections/header";

export const metadata: Metadata = {
  title: "Contact | ReSuply",
  description: "Contact ReSuply for customer, shopper, partnership, and privacy questions.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
