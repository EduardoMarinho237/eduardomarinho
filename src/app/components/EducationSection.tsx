"use client";

export default function EducationSection() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-center px-8 py-16">
      <div className="grid w-full gap-8 md:grid-cols-2">
        {/* Escolaridade */}
        <div className="p-8">
          <div className="mb-6">
            <h3 className="font-sans text-2xl font-bold text-[#261f76]">
              Formação
            </h3>
          </div>

          <ul className="space-y-6">
            <li className="flex flex-col gap-1">
              <span className="font-sans text-lg font-bold text-[#261f76]">
                Bacharelado em Ciência da Computação
              </span>
              <span className="font-sans text-base font-medium text-[#261f76]/80">
                Universidade Maurício de Nassau (UNINASSAU)
              </span>
              <span className="font-sans text-sm font-bold text-[#ff7a00]">
                2023 – previsão jul/2027
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="font-sans text-lg font-bold text-[#261f76]">
                Curso de Estrutura de Dados e Algoritmos em Java
              </span>
              <span className="font-sans text-base font-medium text-[#261f76]/80">
                Loiane Training
              </span>
              <span className="font-sans text-sm font-bold text-[#1f763d]">
                2026
              </span>
            </li>
          </ul>
        </div>

        {/* Idiomas */}
        <div className="p-8">
          <div className="mb-6">
            <h3 className="font-sans text-2xl font-bold text-[#261f76]">
              Idiomas
            </h3>
          </div>

          <ul className="space-y-6">
            <li className="flex flex-col gap-1">
              <span className="font-sans text-lg font-bold text-[#261f76]">
                Português
              </span>
              <span className="font-sans text-sm font-bold text-[#1f763d]">
                Nativo
              </span>
            </li>
            <li className="flex flex-col gap-1">
              <span className="font-sans text-lg font-bold text-[#261f76]">
                Inglês
              </span>
              <span className="font-sans text-sm font-bold text-[#ff7a00]">
                Intermediário
              </span>
              <span className="font-sans text-base font-medium text-[#261f76]/80">
                leitura técnica, documentação e comunicação
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
