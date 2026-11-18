"use client";

import { useRef, useEffect } from "react";

interface AboutCarouselProps {
  showProjects: boolean;
  onShowProjects: () => void;
  onGoBack: () => void;
  onTimeline: () => void;
  onExperience: () => void;
}

export default function AboutCarousel({
  showProjects,
  onShowProjects,
  onGoBack,
  onTimeline,
  onExperience,
}: AboutCarouselProps) {
  const section2Ref = useRef<HTMLDivElement>(null);
  const opacityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = section2Ref.current;
    if (!section) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      const start = windowHeight * 0.85;
      const end = windowHeight * 0.35;
      const progress = (start - rect.top) / (start - end);
      const newOpacity = Math.min(Math.max(progress, 0), 1);

      if (opacityRef.current) {
        opacityRef.current.style.opacity = String(newOpacity);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative z-30 h-screen w-full overflow-hidden bg-white">
      <div
        className={`flex h-full w-[200%] transition-transform duration-700 ease-in-out ${
          showProjects ? "-translate-x-1/2" : "translate-x-0"
        }`}
      >
        {/* Seção 2 */}
        <div
          ref={section2Ref}
          className="relative h-full w-1/2 flex-shrink-0 bg-white px-[10%] py-[15vh] md:px-[20%]"
        >
          {/* Título */}
          <h2 className="absolute left-[10%] top-[15vh] text-left font-sans text-3xl font-extrabold text-[#261f76] md:left-[20%] md:text-4xl lg:text-5xl">
            Quem sou eu?
          </h2>

          {/* Texto central com opacidade ligada ao scroll */}
          <div
            ref={opacityRef}
            className="absolute left-[10%] top-1/2 w-[80%] -translate-y-1/2 transition-opacity duration-75 md:left-[20%] md:w-[60%]"
          >
            <p className="text-left font-sans text-base font-light leading-relaxed text-[#261f76] md:text-lg lg:text-xl">
              Desenvolvedor backend com experiência em sistemas em produção
              usando{" "}
              <span className="font-bold">
                Java/Spring Boot, PHP e Python
              </span>
              , com foco em segurança de aplicações, rastreabilidade e
              automação de deploy. Migrei{" "}
              <span className="font-bold">
                ~1.300 senhas de MD5/SHA1 para Argon2id
              </span>{" "}
              sem downtime, construí um{" "}
              <span className="font-bold">SQL Agent com IA (RAG)</span>{" "}
              usado por mais de 90 clientes e desenvolvi uma{" "}
              <span className="font-bold">
                API financeira multi-tenant com JWT, RBAC, rate limiting e
                auditoria
              </span>
              . Graduando em Ciência da Computação, buscando vaga de
              Desenvolvedor Backend.
            </p>
          </div>

          {/* Botão no canto inferior direito */}
          <button
            type="button"
            onClick={onShowProjects}
            className="absolute bottom-[15vh] right-[10%] flex cursor-pointer items-center gap-2 rounded-full border-2 border-[#261f76] bg-white px-6 py-3 font-sans text-sm font-bold text-[#261f76] shadow-md transition-all hover:bg-[#261f76] hover:text-white md:right-[20%] md:text-base"
          >
            Ver projetos
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>

        {/* Seção 3 */}
        <div className="relative h-full w-1/2 flex-shrink-0 bg-[#261f76] px-[10%] py-[15vh]">
          <h2 className="absolute right-[10%] top-[15vh] px-6 text-right font-sans text-2xl font-extrabold text-white md:text-3xl lg:text-4xl">
            Escolha como me conhecer!
          </h2>

          <div className="flex h-full w-full flex-col items-start">
            <button
              type="button"
              onClick={onGoBack}
              className="mb-8 flex cursor-pointer items-center gap-2 rounded-full border-2 border-white bg-white px-6 py-3 font-sans text-sm font-bold text-[#261f76] shadow-md transition-all hover:bg-[#261f76] hover:text-white md:text-base"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Voltar
            </button>

            <div className="flex flex-1 flex-col items-start justify-start pt-[8vh]">
              <p className="text-left font-sans text-lg font-light leading-relaxed text-white md:text-xl lg:text-2xl">
                Neste site, você poderá visualizar meus{" "}
                <span className="font-bold">projetos, trabalhos e experiências</span>
                , e eu proponho duas experiências: uma mais linear, rolando a
                tela para baixo, e outra mais{" "}
                <span className="font-bold">
                  acertiva, detalhada e completa
                </span>
                ...
              </p>
            </div>

            <div className="flex w-full items-center justify-center gap-4 pb-[8vh]">
              <button
                type="button"
                onClick={onTimeline}
                className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-white bg-[#261f76] px-5 py-2.5 font-sans text-sm font-bold text-white shadow-md transition-all hover:bg-white hover:text-[#261f76] md:px-6 md:py-3 md:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4 md:h-5 md:w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                Linha do tempo
              </button>
              <button
                type="button"
                onClick={onExperience}
                className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-white bg-[#261f76] px-5 py-2.5 font-sans text-sm font-bold text-white shadow-md transition-all hover:bg-white hover:text-[#261f76] md:px-6 md:py-3 md:text-base"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="h-4 w-4 md:h-5 md:w-5"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                  />
                </svg>
                Experiência completa
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
