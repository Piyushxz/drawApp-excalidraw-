import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import CallToAction from "@/components/CallToAction";
import { FAQS } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
export default function Home() {
  return (
    <>
      <Header/>
      <Hero/>
      <CallToAction/>
      <FAQS/>
      <Footer/>
      </>
  );
   

}
