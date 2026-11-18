"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShareFromSquare, faEye } from "@fortawesome/free-solid-svg-icons";
import ProjectCarousel from "./ProjectCarousel";
import Footer from "./Footer";
import { useCursorTheme, type CursorThemeColor } from "./CursorThemeContext";
import manifest from "../data/project-manifest.json";

export interface ProjectAbordagem {
  title: string;
  subtitle: string;
  cta: string;
}

export interface ProjectCard {
  id: string;
  title: string;
  description: string;
  categories: string[];
  image: string;
  imageHover: string;
  path: string;
  folder?: string;
  approaches?: {
    prod: ProjectAbordagem;
    tec: ProjectAbordagem;
    pers: ProjectAbordagem;
  };
}

type AbordagemType = "prod" | "tec" | "pers";

interface ProjectManifest {
  [projectFolder: string]: {
    prod: string[];
    tec: string[];
    pers: string[];
  };
}

interface ProjectDetailPageProps {
  project: ProjectCard;
  allProjects: ProjectCard[];
}

const ABORDAGENS: { key: AbordagemType; label: string }[] = [
  { key: "prod", label: "Produto" },
  { key: "tec", label: "Técnico" },
  { key: "pers", label: "Pessoal" },
];

const ABORDAGEM_COLORS: Record<AbordagemType, CursorThemeColor> = {
  prod: "#261f76",
  tec: "#ff7a00",
  pers: "#1f763d",
};

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.max(0, Math.min(255, x)).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

function isTransparentBg(bg: string): boolean {
  if (!bg) return true;
  if (bg === "transparent" || bg === "rgba(0, 0, 0, 0)") return true;
  const values = bg.match(/\d+\.?\d*/g);
  if (values && values.length >= 4) {
    const alpha = parseFloat(values[3]);
    if (alpha < 0.1) return true;
  }
  return false;
}

function hasVisibleBackgroundImage(style: CSSStyleDeclaration): boolean {
  const bgImage = style.backgroundImage;
  return !!bgImage && bgImage !== "none";
}

function isOverSameColorElement(
  x: number,
  y: number,
  targetColor: string,
  ignoreElement?: HTMLElement | null
): boolean {
  const elements = document.elementsFromPoint(x, y);

  for (const element of elements) {
    if (!(element instanceof HTMLElement)) continue;
    if (ignoreElement && (element === ignoreElement || ignoreElement.contains(element))) {
      continue;
    }

    // Se há uma imagem ocupando a área, o fundo sólido não é visível
    if (element.tagName.toLowerCase() === "img") {
      return false;
    }

    const style = window.getComputedStyle(element);
    const bg = style.backgroundColor;

    if (hasVisibleBackgroundImage(style)) {
      return false;
    }

    if (!isTransparentBg(bg) && bg.startsWith("rgb")) {
      const values = bg.match(/\d+/g);
      if (values && values.length >= 3) {
        const hex = rgbToHex(
          parseInt(values[0], 10),
          parseInt(values[1], 10),
          parseInt(values[2], 10)
        );
        if (hex.toLowerCase() === targetColor.toLowerCase()) {
          return true;
        }
      }
    }
  }

  return false;
}

export default function ProjectDetailPage({
  project,
  allProjects,
}: ProjectDetailPageProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialPov = searchParams.get("pov") as AbordagemType | null;
  const validPov = initialPov && ["prod", "tec", "pers"].includes(initialPov) ? initialPov : "prod";

  const [abordagem, setAbordagem] = useState<AbordagemType>(validPov);
  const [isCtaHovered, setIsCtaHovered] = useState(false);
  const [headerOverThemeColor, setHeaderOverThemeColor] = useState(false);
  const [isPovOpen, setIsPovOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [rememberFullscreenChoice, setRememberFullscreenChoice] = useState(false);
  const [showEyeTutorial, setShowEyeTutorial] = useState(false);
  const [eyeButtonRect, setEyeButtonRect] = useState<{ top: number; left: number; size: number } | null>(null);
  const eyeButtonRef = useRef<HTMLButtonElement>(null);
  const [hoveredPov, setHoveredPov] = useState<string | null>(null);
  const [backHover, setBackHover] = useState(false);
  const [eyeHover, setEyeHover] = useState(false);
  const [helpHover, setHelpHover] = useState(false);
  const [shareHover, setShareHover] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const { setColor, setDisableInteractionColors } = useCursorTheme();

  const projectManifest = (manifest as ProjectManifest)[project.folder || project.id] || {
    prod: [],
    tec: [],
    pers: [],
  };

  const imagens = projectManifest[abordagem] || [];
  const abordagemData = project.approaches?.[abordagem];
  const themeColor = ABORDAGEM_COLORS[abordagem];

  useEffect(() => {
    setColor(themeColor);
  }, [themeColor, setColor]);

  useEffect(() => {
    setDisableInteractionColors(true);
    return () => setDisableInteractionColors(false);
  }, [setDisableInteractionColors]);

  useEffect(() => {
    const checkHeaderBackground = () => {
      if (!headerRef.current) return;
      const rect = headerRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      setHeaderOverThemeColor(isOverSameColorElement(x, y, themeColor, headerRef.current));
    };

    checkHeaderBackground();

    window.addEventListener("scroll", checkHeaderBackground, { passive: true });
    window.addEventListener("mousemove", checkHeaderBackground, { passive: true });

    return () => {
      window.removeEventListener("scroll", checkHeaderBackground);
      window.removeEventListener("mousemove", checkHeaderBackground);
    };
  }, [themeColor]);

  const maybeShowEyeTutorial = () => {
    if (localStorage.getItem("eduardo-eye-tutorial") === "done") return;
    setTimeout(() => setShowEyeTutorial(true), 450);
  };

  useEffect(() => {
    const choice = localStorage.getItem("eduardo-fullscreen-choice");
    if (choice === "never") {
      queueMicrotask(maybeShowEyeTutorial);
      return;
    }
    if (choice === "auto") {
      document.documentElement.requestFullscreen?.().catch(() => {});
      queueMicrotask(maybeShowEyeTutorial);
      return;
    }
    queueMicrotask(() => setShowFullscreenModal(true));
  }, []);

  const handleFullscreenConfirm = () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
    if (rememberFullscreenChoice) {
      localStorage.setItem("eduardo-fullscreen-choice", "auto");
    }
    setShowFullscreenModal(false);
    maybeShowEyeTutorial();
  };

  const handleFullscreenCancel = () => {
    if (rememberFullscreenChoice) {
      localStorage.setItem("eduardo-fullscreen-choice", "never");
    }
    setShowFullscreenModal(false);
    maybeShowEyeTutorial();
  };

  const handleEyeTutorialUnderstand = () => {
    localStorage.setItem("eduardo-eye-tutorial", "done");
    setShowEyeTutorial(false);
  };

  useEffect(() => {
    if (!showEyeTutorial || !eyeButtonRef.current) return;
    const rect = eyeButtonRef.current.getBoundingClientRect();
    setEyeButtonRect({
      top: rect.top + rect.height / 2,
      left: rect.left + rect.width / 2,
      size: Math.max(rect.width, rect.height) + 24,
    });
  }, [showEyeTutorial]);

  const suggestedProjects = useMemo(() => {
    return allProjects
      .filter((p) => p.id !== project.id)
      .map((p) => ({
        project: p,
        commonCategories: p.categories.filter((cat) =>
          project.categories.includes(cat)
        ).length,
      }))
      .sort((a, b) => b.commonCategories - a.commonCategories)
      .slice(0, 3)
      .map((item) => item.project);
  }, [allProjects, project]);

  const scrollToSection = (index: number) => {
    const element = document.getElementById(`project-sec-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSetAbordagem = (key: AbordagemType) => {
    setAbordagem(key);
    const params = new URLSearchParams(searchParams.toString());
    params.set("pov", key);
    router.replace(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  const handleShare = async () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pov", abordagem);
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <main className="relative w-full">
      {/* Header fixo com botão de voltar e controle de POV */}
      <div
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-[5%] py-4 md:px-[10%]"
      >
        <Link
          href="/projects"
          onMouseEnter={() => setBackHover(true)}
          onMouseLeave={() => setBackHover(false)}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 shadow-md transition-all duration-[400ms]"
          style={{
            borderColor: backHover ? themeColor : headerOverThemeColor ? "#ffffff" : themeColor,
            backgroundColor: backHover ? themeColor : "transparent",
            color: backHover ? "#ffffff" : headerOverThemeColor ? "#ffffff" : themeColor,
          }}
          aria-label="Voltar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>

        {/* Controle de POV */}
        <div className="flex items-center gap-3">
          <AnimatePresence initial={false}>
            {isPovOpen && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setIsHelpModalOpen(true)}
                  onMouseEnter={() => setHelpHover(true)}
                  onMouseLeave={() => setHelpHover(false)}
                  className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-2 text-sm font-bold shadow-md transition-all duration-[400ms]"
                  style={{
                    borderColor: helpHover ? themeColor : headerOverThemeColor ? "#ffffff" : themeColor,
                    backgroundColor: helpHover ? themeColor : "transparent",
                    color: helpHover ? "#ffffff" : headerOverThemeColor ? "#ffffff" : themeColor,
                  }}
                  aria-label="Ajuda"
                >
                  ?
                </button>

                {ABORDAGENS.map(({ key, label }) => {
                  const isSelected = abordagem === key;
                  const isHovered = hoveredPov === key;
                  const buttonColor = ABORDAGEM_COLORS[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSetAbordagem(key)}
                      onMouseEnter={() => setHoveredPov(key)}
                      onMouseLeave={() => setHoveredPov(null)}
                      className="cursor-pointer whitespace-nowrap rounded-full border-2 px-4 py-1.5 text-sm font-bold transition-all duration-[400ms]"
                      style={{
                        borderColor: isSelected || isHovered
                          ? buttonColor
                          : headerOverThemeColor
                            ? "#ffffff"
                            : themeColor,
                        backgroundColor: isSelected || isHovered ? buttonColor : "transparent",
                        color: isSelected || isHovered
                          ? "#ffffff"
                          : headerOverThemeColor
                            ? "#ffffff"
                            : themeColor,
                      }}
                    >
                      {label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={handleShare}
                  onMouseEnter={() => setShareHover(true)}
                  onMouseLeave={() => setShareHover(false)}
                  className="flex h-9 w-9 flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-2 shadow-md transition-all duration-[400ms]"
                  style={{
                    borderColor: shareHover ? themeColor : headerOverThemeColor ? "#ffffff" : themeColor,
                    backgroundColor: shareHover ? themeColor : "transparent",
                    color: shareHover ? "#ffffff" : headerOverThemeColor ? "#ffffff" : themeColor,
                  }}
                  aria-label="Compartilhar"
                >
                  <FontAwesomeIcon icon={faShareFromSquare} className="h-4 w-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            ref={eyeButtonRef}
            type="button"
            onClick={() => setIsPovOpen((prev) => !prev)}
            onMouseEnter={() => setEyeHover(true)}
            onMouseLeave={() => setEyeHover(false)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 shadow-md transition-all duration-[400ms]"
            style={{
              borderColor: eyeHover ? themeColor : headerOverThemeColor ? "#ffffff" : themeColor,
              backgroundColor: eyeHover ? themeColor : "transparent",
              color: eyeHover ? "#ffffff" : headerOverThemeColor ? "#ffffff" : themeColor,
            }}
            aria-label="Abrir POV"
          >
            <FontAwesomeIcon icon={faEye} className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Seção 1 - Cabeçalho */}
      <section
        id="project-sec-0"
        className="relative z-30 flex h-screen w-full items-center justify-center overflow-hidden transition-colors duration-[400ms]"
        style={{ backgroundColor: themeColor }}
      >
        <AnimatePresence mode="sync">
          {imagens[0] && (
            <motion.div
              key={`bg-${abordagem}-0`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 z-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${imagens[0]}')` }}
            />
          )}
        </AnimatePresence>

        <div className="z-10 flex h-full w-full flex-col justify-center px-[5%] md:px-[10%]">
          <div className="flex flex-col items-start">
            <h1
              className="font-sans text-4xl font-extrabold tracking-tight transition-colors duration-[400ms] sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ color: themeColor }}
            >
              {abordagemData?.title || project.title}
            </h1>
            <p
              className="mt-4 max-w-2xl text-start font-sans text-lg font-light tracking-wide transition-colors duration-[400ms] sm:text-xl md:text-2xl"
              style={{ color: themeColor, opacity: 0.9 }}
            >
              {abordagemData?.subtitle || project.description}
            </p>
          </div>
          {imagens.length > 1 && (
            <button
              type="button"
              onClick={() => scrollToSection(1)}
              onMouseEnter={() => setIsCtaHovered(true)}
              onMouseLeave={() => setIsCtaHovered(false)}
              className="absolute bottom-12 right-[5%] cursor-pointer self-end rounded-full border-2 px-8 py-3 font-sans text-sm font-bold transition-all duration-[400ms] md:right-[10%]"
              style={{
                borderColor: themeColor,
                color: isCtaHovered ? "#ffffff" : themeColor,
                backgroundColor: isCtaHovered ? themeColor : "transparent",
              }}
            >
              {abordagemData?.cta || "Ver mais"}
            </button>
          )}
        </div>
      </section>

      {/* Seções de imagens */}
      {imagens.slice(1).map((imagem, index) => (
        <section
          key={index}
          id={`project-sec-${index + 1}`}
          className="relative z-30 h-screen w-full overflow-hidden transition-colors duration-[400ms]"
          style={{ backgroundColor: themeColor }}
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={`${abordagem}-${index + 1}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${imagem}')` }}
            />
          </AnimatePresence>
        </section>
      ))}

      {/* Carrossel de sugestões */}
      {suggestedProjects.length > 0 && (
        <section
          className="relative z-30 flex min-h-[45vh] w-full flex-col items-center justify-end px-[5%] pb-0 pt-[5vh] transition-colors duration-[400ms] md:px-[10%]"
          style={{ backgroundColor: themeColor }}
        >
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="mb-6 text-center font-sans text-2xl font-extrabold text-white md:text-3xl">
              Projetos que você também pode gostar
            </h2>
            <ProjectCarousel
              data={{
                carousel: {
                  config: { cardCount: 3, categories: [] },
                  cards: suggestedProjects,
                },
              }}
              hideFilters
              hideArrows
              centered
              themeColor={themeColor}
            />
          </div>
        </section>
      )}

      {/* Rodapé */}
      <section
        className="relative z-30 flex min-h-[45vh] w-full flex-col justify-end px-[5%] pb-8 pt-8 transition-colors duration-[400ms] md:px-[10%]"
        style={{ backgroundColor: themeColor }}
      >
        <Footer />
      </section>

      {/* Modal de tela cheia */}
      <AnimatePresence>
        {showFullscreenModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
            >
              <h2 className="mb-4 font-sans text-2xl font-extrabold" style={{ color: themeColor }}>
                Essa página é melhor em tela cheia, quer ter essa experiência?
              </h2>
              <p className="mb-4 font-sans text-sm leading-relaxed text-gray-600">
                Obs: Para tirar de tela cheia basta apertar Esc ou F11.
              </p>
              <label className="mb-6 flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={rememberFullscreenChoice}
                  onChange={(e) => setRememberFullscreenChoice(e.target.checked)}
                  className="h-5 w-5 cursor-pointer accent-current"
                  style={{ color: themeColor }}
                />
                <span className="font-sans text-sm font-medium text-gray-700">
                  Lembrar minha escolha
                </span>
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleFullscreenConfirm}
                  className="flex-1 cursor-pointer rounded-full px-6 py-3 font-sans text-sm font-bold text-white transition-all hover:brightness-110"
                  style={{ backgroundColor: themeColor }}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={handleFullscreenCancel}
                  className="flex-1 cursor-pointer rounded-full border-2 px-6 py-3 font-sans text-sm font-bold transition-all hover:bg-black/5"
                  style={{ borderColor: themeColor, color: themeColor }}
                >
                  Cancelar, prefiro não
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal de ajuda */}
      <AnimatePresence>
        {isHelpModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setIsHelpModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-lg rounded-3xl bg-white p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="mb-4 font-sans text-2xl font-extrabold" style={{ color: themeColor }}>
                Como usar
              </h2>
              <p className="mb-4 font-sans text-base leading-relaxed text-gray-700">
                Este projeto pode ser visualizado por três pontos de vista. Clique no ícone de olho
                para abrir o menu e escolha entre Produto, Técnico ou Pessoal. Cada abordagem
                destaca aspectos diferentes do trabalho.
              </p>
              <h3 className="mb-2 font-sans text-lg font-bold" style={{ color: themeColor }}>
                Por que três abordagens?
              </h3>
              <ul className="mb-6 list-disc space-y-2 pl-5 font-sans text-base text-gray-700">
                <li>
                  <strong>Produto:</strong> foco no problema resolvido, objetivos e resultados de
                  negócio.
                </li>
                <li>
                  <strong>Técnico:</strong> detalhes da implementação, stack e decisões de
                  arquitetura.
                </li>
                <li>
                  <strong>Pessoal:</strong> aprendizados, desafios e o lado humano do projeto.
                </li>
              </ul>
              <button
                type="button"
                onClick={() => setIsHelpModalOpen(false)}
                className="w-full rounded-full px-6 py-3 font-sans text-sm font-bold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: themeColor }}
              >
                Entendi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast de link copiado */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 left-1/2 z-[70] -translate-x-1/2 rounded-full px-8 py-3 font-sans text-sm font-bold text-white shadow-lg"
            style={{ backgroundColor: themeColor }}
          >
            Link copiado!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tutorial do botão de olho */}
      <AnimatePresence>
        {showEyeTutorial && eyeButtonRect && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[65]"
          >
            <div
              className="pointer-events-none absolute rounded-full"
              style={{
                top: eyeButtonRect.top - eyeButtonRect.size / 2,
                left: eyeButtonRect.left - eyeButtonRect.size / 2,
                width: eyeButtonRect.size,
                height: eyeButtonRect.size,
                boxShadow: "0 0 0 9999px rgba(0,0,0,0.75)",
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="absolute max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
              style={{
                top: eyeButtonRect.top + eyeButtonRect.size / 2 + 16,
                right: Math.max(16, window.innerWidth - eyeButtonRect.left - eyeButtonRect.size / 2),
              }}
            >
              <p className="mb-5 font-sans text-sm leading-relaxed text-gray-700">
                Clicando aqui, você pode ter mais perspectivas deste projeto, para mais informações,
                clique no botão &quot;?&quot; que será habilitado após clicar neste
              </p>
              <button
                type="button"
                onClick={handleEyeTutorialUnderstand}
                className="w-full cursor-pointer rounded-full px-6 py-3 font-sans text-sm font-bold text-white transition-all hover:brightness-110"
                style={{ backgroundColor: themeColor }}
              >
                Entendi
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
