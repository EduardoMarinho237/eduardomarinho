"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ContactButtons from "./ContactButtons";

interface HeroSectionProps {
  title?: string;
  titleContent?: React.ReactNode;
  subtitle?: string;
  backgroundImage: string;
  layerImage?: string;
  showScrollIndicator?: boolean;
  showBackButton?: boolean;
  backHref?: string;
  titleSize?: string;
}

export default function HeroSection({
  title,
  titleContent,
  subtitle,
  backgroundImage,
  layerImage,
  showScrollIndicator = true,
  showBackButton = false,
  backHref = "/",
  titleSize = "text-[2.5rem] sm:text-[3.375rem] md:text-[4.125rem] lg:text-[5.25rem]",
}: HeroSectionProps) {
  const [scrollIndicatorOpacity, setScrollIndicatorOpacity] = useState(1);
  const scrollIndicatorOpacityRef = useRef(1);

  useEffect(() => {
    if (!showScrollIndicator) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.scrollY > window.innerHeight) return;

      if (e.deltaY > 30) {
        scrollIndicatorOpacityRef.current = Math.max(
          0,
          scrollIndicatorOpacityRef.current - 0.5
        );
      } else if (e.deltaY < -30) {
        scrollIndicatorOpacityRef.current = Math.min(
          1,
          scrollIndicatorOpacityRef.current + 0.5
        );
      }
      setScrollIndicatorOpacity(scrollIndicatorOpacityRef.current);
    };

    const handleScroll = () => {
      if (window.scrollY === 0) {
        scrollIndicatorOpacityRef.current = 1;
        setScrollIndicatorOpacity(1);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [showScrollIndicator]);

  return (
    <>
      {/* Background section */}
      <section
        className="relative h-screen w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        {layerImage && (
          <div
            className="pointer-events-none absolute inset-0 z-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url('${layerImage}')` }}
          />
        )}

        {showBackButton && (
          <Link
            href={backHref}
            aria-label="Voltar"
            className="absolute left-8 top-[calc(20%-1rem)] z-30 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#261f76] bg-transparent text-[#261f76] shadow-md transition-all hover:bg-[#261f76] hover:text-white sm:top-[calc(20%-1.5rem)] md:top-[calc(20%-2rem)] lg:top-[calc(20%-2.5rem)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </Link>
        )}

        {showScrollIndicator && (
          <div
            className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-100"
            style={{ opacity: scrollIndicatorOpacity }}
          >
            <span className="font-sans text-sm font-medium tracking-wide text-[#261f76] sm:text-base">
              Arraste para baixo
            </span>
            <svg
              className="h-6 w-6 animate-bounce text-[#261f76]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}
      </section>

      {/* Fixed text content */}
      <div className="fixed left-1/2 top-[20%] z-10 -translate-x-1/2 -translate-y-1/2">
        {titleContent ? (
          <div className={`whitespace-nowrap font-sans font-extrabold tracking-tight text-[#261f76] ${titleSize}`}>
            {titleContent}
          </div>
        ) : (
          <h1
            className={`whitespace-nowrap font-sans font-extrabold tracking-tight text-[#261f76] ${titleSize}`}
          >
            {title}
          </h1>
        )}

        <div className="flex items-end justify-between">
          {subtitle && (
            <p className="-mt-1 font-sans text-base font-normal tracking-[0.25em] text-[#261f76] sm:text-lg md:text-xl lg:text-2xl">
              {subtitle}
            </p>
          )}

          <ContactButtons
            className={subtitle ? "" : "ml-auto"}
            iconClassName="h-6 w-6 sm:h-7 sm:w-7"
          />
        </div>
      </div>
    </>
  );
}
