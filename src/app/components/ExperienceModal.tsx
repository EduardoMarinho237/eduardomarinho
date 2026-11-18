"use client";

import { useRouter } from "next/navigation";

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExperienceModal({ isOpen, onClose }: ExperienceModalProps) {
  const router = useRouter();

  const handleOk = () => {
    onClose();
    router.push("/projects");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#261f76]/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-3xl border border-[#261f76]/10 bg-white p-8 shadow-2xl md:p-10">
        <h3 className="mb-6 text-center font-sans text-2xl font-bold text-[#261f76] md:text-3xl">
          Atenção
        </h3>

        <p className="mb-8 text-justify font-sans text-base font-light leading-relaxed text-[#261f76] md:text-lg">
          A seguir você poderá visualizar meus projetos, trabalhos e
          experiências, e escolher entre três perspectivas:
        </p>

        <ul className="mb-8 space-y-4 font-sans text-base text-[#261f76] md:text-lg">
          <li>
            <span className="font-bold">Produto</span> — Propósito da
            aplicação, ideias, problemas identificados e resolvidos.
          </li>
          <li>
            <span className="font-bold">Técnica</span> — O porquê de cada
            tecnologia, como funciona por debaixo dos panos e por que não foi
            feito de outra forma.
          </li>
          <li>
            <span className="font-bold">Pessoal</span> — Meu ponto de vista,
            comentários sobre o projeto, dificuldades e conquistas.
          </li>
        </ul>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleOk}
            className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-[#261f76] bg-white px-8 py-3 font-sans text-sm font-bold text-[#261f76] shadow-md transition-all hover:bg-[#261f76] hover:text-white md:text-base"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
