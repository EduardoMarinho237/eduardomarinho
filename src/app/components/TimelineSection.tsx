"use client";

import { useState } from "react";
import defaultData from "../data/timeline-data.json";

export interface TimelineExperience {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  keywords: string[];
  topics: string[];
}

export interface TimelineData {
  experiences: TimelineExperience[];
}

interface TimelineSectionProps {
  data?: TimelineData;
  title?: string;
}

const MAX_VISIBLE_TOPICS = 3;

const MESES: Record<string, number> = {
  jan: 0,
  fev: 1,
  mar: 2,
  abr: 3,
  mai: 4,
  jun: 5,
  jul: 6,
  ago: 7,
  set: 8,
  out: 9,
  nov: 10,
  dez: 11,
};

function parseDate(dateString: string): number {
  const normalized = dateString.trim().toLowerCase();

  if (normalized === "atual" || normalized === "presente") {
    return Number.MAX_SAFE_INTEGER;
  }

  const parts = normalized.split(" ");
  if (parts.length !== 2) return 0;

  const [monthStr, yearStr] = parts;
  const month = MESES[monthStr];
  const year = parseInt(yearStr, 10);

  if (month === undefined || isNaN(year)) return 0;

  return year * 12 + month;
}

function sortExperiences(
  experiences: TimelineExperience[]
): TimelineExperience[] {
  return [...experiences].sort((a, b) => {
    const endA = parseDate(a.endDate);
    const endB = parseDate(b.endDate);

    if (endA !== endB) {
      return endB - endA;
    }

    const startA = parseDate(a.startDate);
    const startB = parseDate(b.startDate);

    return startA - startB;
  });
}

export default function TimelineSection({
  data = defaultData as TimelineData,
  title = "Minha trajetória",
}: TimelineSectionProps) {
  const experiences = sortExperiences(data.experiences);
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="relative mx-auto w-full max-w-6xl px-8 py-16">
      <h2 className="mb-16 text-center font-sans text-4xl font-extrabold text-white md:text-5xl">
        {title}
      </h2>

      <div className="relative">
        {/* Linha vertical central */}
        <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 rounded-full bg-white/30" />

        {experiences.map((experience, index) => {
          const isExpanded = expandedIds[experience.id] || false;
          const isLeft = index % 2 === 0;
          const visibleTopics = isExpanded
            ? experience.topics
            : experience.topics.slice(0, MAX_VISIBLE_TOPICS);
          const hasMoreTopics =
            experience.topics.length > MAX_VISIBLE_TOPICS;

          return (
            <div
              key={experience.id}
              className={`relative mb-12 flex w-full items-center ${
                isLeft ? "justify-start" : "justify-end"
              }`}
            >
              {/* Ponto na linha */}
              <div className="absolute left-1/2 top-6 z-10 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-[#261f76] bg-white shadow-lg" />

              {/* Card */}
              <div
                className={`relative w-[45%] rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/15 ${
                  isLeft ? "mr-auto pr-8" : "ml-auto pl-8"
                }`}
              >
                {/* Setinha para a linha */}
                <div
                  className={`absolute top-6 h-0 w-0 border-y-8 border-y-transparent ${
                    isLeft
                      ? "-right-4 border-l-8 border-l-white/10"
                      : "-left-4 border-r-8 border-r-white/10"
                  }`}
                />

                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-sans text-xl font-bold text-white">
                    {experience.title}
                  </h3>
                  <span className="font-sans text-sm font-medium text-white/70">
                    {experience.startDate} — {experience.endDate}
                  </span>
                </div>

                <div className="mb-4 flex flex-wrap gap-2">
                  {experience.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-[#261f76] px-3 py-1 text-xs font-bold text-white"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                <ul className="flex flex-col gap-2">
                  {visibleTopics.map((topico, topicoIndex) => (
                    <li
                      key={topicoIndex}
                      className="flex gap-2 font-sans text-base font-light leading-relaxed text-white/90"
                    >
                      <span className="flex-shrink-0 text-white/90">-</span>
                      <span>{topico}</span>
                    </li>
                  ))}
                </ul>

                {hasMoreTopics && (
                  <button
                    type="button"
                    onClick={() => toggleExpand(experience.id)}
                    className="mt-3 cursor-pointer font-sans text-sm font-bold text-white underline underline-offset-4 transition-opacity hover:opacity-80"
                  >
                    {isExpanded ? "Ler menos" : "Ler mais"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
