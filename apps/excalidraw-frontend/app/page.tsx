import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import CallToAction from "@/components/CallToAction";
import { FAQS } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { VideoPreivew } from "@/components/VideoPreivew";
import { FooterTopper } from "@/components/FooterTopper";
export default function Home() {
  return (
    <>
      <Header/>
      <Hero/>
      <CallToAction/>
      <VideoPreivew/>
      <FAQS/>
      <FooterTopper/>
      <Footer/>
      
      </>
  );
   

}
