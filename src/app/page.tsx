import Image from "next/image";
import styles from "./page.module.css";
import Header from "@/components/layout/Header"
import Hero from "@/components/home/Hero"
import Collection from "@/components/home/Collection"
import About from "@/components/home/About"
import Footer from "@/components/layout/Footer"

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <Collection />
      <About />
      <Footer />
    </main>
  );
}
