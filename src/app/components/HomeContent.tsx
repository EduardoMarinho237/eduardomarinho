"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HeroSection from "./HeroSection";
import AboutCarousel from "./AboutCarousel";
import TimelineSection from "./TimelineSection";
import EducationSection from "./EducationSection";
import Footer from "./Footer";
import TechCarousel from "./TechCarousel";

export default function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSection = searchParams.get("section");
  const [showProjects, setShowProjects] = useState(initialSection === "3");

  useEffect(() => {
    if (initialSection === "3") {
      window.scrollTo({ top: window.innerHeight, behavior: "auto" });
    }
  }, [initialSection]);

  useEffect(() => {
    if (showProjects) {
      document.documentElement.style.overflowY = "";
      document.body.style.overflowY = "";
      document.body.style.height = "";
    } else {
      document.documentElement.style.overflowY = "scroll";
      document.body.style.overflowY = "scroll";
      document.body.style.height = "200vh";
    }

    return () => {
      document.documentElement.style.overflowY = "";
      document.body.style.overflowY = "";
      document.body.style.height = "";
    };
  }, [showProjects]);

  const handleGoBack = () => {
    if (window.scrollY > window.innerHeight + 50) {
      window.scrollTo({ top: window.innerHeight, behavior: "auto" });
    }
    setShowProjects(false);
  };

  const handleTimeline = () => {
    if (!showProjects) {
      setShowProjects(true);
    }
    window.scrollTo({
      top: window.innerHeight * 2,
      behavior: "smooth",
    });
  };

  const handleExperience = () => {
    router.push("/projects");
  };

  return (
    <>
      <HeroSection
        title="Eduardo Marinho"
        subtitle="Desenvolvedor FullStack"
        backgroundImage="/images/hero-bg.webp"
        layerImage="/images/hero-layer.webp"
        showScrollIndicator
      />

      <AboutCarousel
        showProjects={showProjects}
        onShowProjects={() => setShowProjects(true)}
        onGoBack={handleGoBack}
        onTimeline={handleTimeline}
        onExperience={handleExperience}
      />

      {showProjects && (
        <>
          {/* Seção 4 - Linha do tempo */}
          <section className="relative z-30 min-h-screen w-full bg-[#261f76] px-[5%] py-[10vh] md:px-[10%]">
            <div className="relative z-10 -mx-[5.5%] mb-8 w-[calc(100%+11%)] md:-mx-[11.2%] md:w-[calc(100%+22.4%)]">
              <TechCarousel />
            </div>
            <TimelineSection />
          </section>

          {/* Seção 5 - Escolaridade e Idiomas */}
          <section className="relative z-30 min-h-screen w-full bg-white px-[5%] py-[10vh] md:px-[10%]">
            <div className="relative z-10">
              <EducationSection />
            </div>
            <div
              className="absolute bottom-0 left-0 z-0 h-[20%] w-full bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/images/forest-bg.webp')" }}
            />
          </section>

          {/* Seção 6 - Rodapé */}
          <section className="relative z-30 h-auto min-h-[40vh] w-full bg-[#261f76] px-[5%] py-16 md:px-[10%]">
            <Footer />
          </section>
        </>
      )}
    </>
  );
}
