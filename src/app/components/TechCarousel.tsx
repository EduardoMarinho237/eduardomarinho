"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const TECHNOLOGIES = [
  {
    name: "Java",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  },
  {
    name: "Spring Boot",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg",
  },
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    name: "AWS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original.svg",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  },
  {
    name: "HTML5",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
  },
  {
    name: "CSS3",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
  },
  {
    name: "TailwindCSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  },
  {
    name: "Ionic",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ionic/ionic-original.svg",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg",
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg",
  },
  {
    name: "Linux",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
  },
];

export default function TechCarousel() {
  const duplicatedTechnologies = [...TECHNOLOGIES, ...TECHNOLOGIES];

  return (
    <div className="relative w-full overflow-hidden py-2">
      {/* Gradiente esquerdo */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[#261f76] to-transparent z-10" />
      {/* Gradiente direito */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#261f76] to-transparent z-10" />

      <motion.div
        className="flex gap-6"
        animate={{
          x: [0, -(TECHNOLOGIES.length * 72)],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 20,
            ease: "linear",
          },
        }}
      >
        {duplicatedTechnologies.map((tech, index) => (
          <div
            key={index}
            className="tech-carousel-icon flex-shrink-0 w-12 h-12 transition-all"
            title={tech.name}
          >
            <Image
              src={tech.icon}
              alt={tech.name}
              width={48}
              height={48}
              unoptimized
              className="w-full h-full object-contain filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
