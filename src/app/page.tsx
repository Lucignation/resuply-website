import { Header } from "@/components/sections/header";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CustomerBenefits } from "@/components/sections/customer-benefits";
import { ShopperOpportunity } from "@/components/sections/shopper-opportunity";
import { TrustSafety } from "@/components/sections/trust-safety";
import { UseCases } from "@/components/sections/use-cases";
import { Waitlist } from "@/components/sections/waitlist";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Problem />
        <HowItWorks />
        <CustomerBenefits />
        <ShopperOpportunity />
        <TrustSafety />
        <UseCases />
        <Waitlist />
      </main>
      <Footer />
    </>
  );
}
