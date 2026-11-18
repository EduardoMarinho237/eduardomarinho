"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import defaultData from "../data/projects.json";

export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  categories: string[];
  image: string;
  imageHover: string;
  path: string;
}

export interface CarouselConfig {
  cardCount: number;
  categories: string[];
}

export interface ProjectCarouselData {
  carousel: {
    config: CarouselConfig;
    cards: ProjectCard[];
  };
}

interface ProjectCarouselProps {
  data?: ProjectCarouselData;
  hideFilters?: boolean;
  hideArrows?: boolean;
  centered?: boolean;
  themeColor?: string;
}

function darkenHex(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  r = Math.max(0, Math.min(255, Math.round(r * (1 - amount))));
  g = Math.max(0, Math.min(255, Math.round(g * (1 - amount))));
  b = Math.max(0, Math.min(255, Math.round(b * (1 - amount))));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
  }),
};

export default function ProjectCarousel({
  data = defaultData as ProjectCarouselData,
  hideFilters = false,
  hideArrows = false,
  centered = false,
  themeColor = "#261f76",
}: ProjectCarouselProps) {
  const cardBackground = darkenHex(themeColor, 0.2);
  const { config, cards } = data.carousel;
  const cardCount = config.cardCount;
  const categories = config.categories;

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
    setPage(0);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPage(0);
  };

  const filteredCards = useMemo(() => {
    if (selectedCategories.length === 0) return cards;
    return cards.filter((card) =>
      selectedCategories.some((cat) => card.categories.includes(cat))
    );
  }, [cards, selectedCategories]);

  const totalPages = Math.max(1, Math.ceil(filteredCards.length / cardCount));

  const currentCards = useMemo(() => {
    const start = page * cardCount;
    return filteredCards.slice(start, start + cardCount);
  }, [filteredCards, page, cardCount]);

  const goToPrev = () => {
    setDirection(-1);
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex w-full flex-col gap-4 px-8">
      {!hideFilters && (
        <>
          {/* Filtros */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`cursor-pointer rounded-full border-2 px-5 py-2 text-sm font-bold capitalize transition-all ${
                    isSelected
                      ? "border-[#261f76] bg-[#261f76] text-white"
                      : "border-[#261f76] bg-transparent text-[#261f76] hover:bg-[#261f76]/10"
                  }`}
                >
                  {category}
                </button>
              );
            })}

            {selectedCategories.length > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="cursor-pointer rounded-full border-2 border-[#ff7a00] bg-transparent px-5 py-2 text-sm font-bold text-[#ff7a00] transition-all hover:bg-[#ff7a00] hover:text-white"
              >
                Limpar filtros
              </button>
            )}
          </div>
        </>
      )}

      {/* Carrossel */}
      <div className="flex items-center gap-4">
        {/* Seta anterior */}
        {!hideArrows && (
          <button
            type="button"
            onClick={goToPrev}
            aria-label="Anterior"
            className="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#261f76] text-white transition-all hover:bg-white hover:text-[#261f76]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}

        {/* Cards */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className={`grid gap-4 ${
                centered ? "grid-cols-3 justify-items-center" : "grid-cols-4"
              }`}
            >
              {currentCards.map((card) => (
                <Link
                  key={card.id}
                  href={card.path}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/10 p-4 backdrop-blur-sm transition-all hover:brightness-110"
                  style={{ backgroundColor: cardBackground }}
                >
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={card.image}
                      alt={card.title}
                      fill
                      className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                    />
                    <Image
                      src={card.imageHover}
                      alt={`${card.title} - hover`}
                      fill
                      className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h4 className="font-sans text-base font-bold text-white">
                      {card.title}
                    </h4>
                    <p className="line-clamp-2 font-sans text-sm font-light leading-snug text-white/80">
                      {card.description}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Seta próxima */}
        {!hideArrows && (
          <button
            type="button"
            onClick={goToNext}
            aria-label="Próximo"
            className="flex h-10 w-10 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#261f76] text-white transition-all hover:bg-white hover:text-[#261f76]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m8.25 4.5 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Contador de projetos */}
      {!hideFilters && (
        <div className="flex justify-center">
          <span className="rounded-full bg-[#261f76] px-4 py-2 font-sans text-sm font-bold text-white shadow-md">
            {filteredCards.length} projeto{filteredCards.length !== 1 ? "s" : ""} de um total de{" "}
            {cards.length}
          </span>
        </div>
      )}

      {/* Indicadores de página */}
      <div className="flex items-center justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => {
              setDirection(index > page ? 1 : -1);
              setPage(index);
            }}
            aria-label={`Ir para página ${index + 1}`}
            className={`h-2 rounded-full transition-all ${
              index === page
                ? "w-6 bg-white"
                : "w-2 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
