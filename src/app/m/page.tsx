import type { Metadata } from "next";
import ContactButtons from "../components/ContactButtons";

export const metadata: Metadata = {
  title: "Manutenção | Eduardo Marinho",
  description: "Versão mobile em manutenção. Acesse pelo computador ou notebook.",
};

export default function MobileMaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-6 py-8 text-center">
      <header className="flex w-full flex-col items-center gap-1 pt-2">
        <h2 className="font-sans text-lg font-extrabold tracking-tight text-[#261f76]">
          Eduardo Marinho
        </h2>
        <span className="font-sans text-xs font-normal tracking-[0.25em] text-[#261f76]/80">
          Desenvolvedor FullStack
        </span>
      </header>

      <div className="flex w-full max-w-md flex-1 flex-col items-center justify-center gap-8 py-8">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="z-10 h-16 w-16 text-[#261f76]"
            fill="currentColor"
            viewBox="0 0 512 512"
            aria-hidden="true"
          >
            <path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C81.5 273.8 80.9 265.3 80.9 256s.6-17.1 1.7-25.4L39.3 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C182.7 1.2 196.9 0 211.4 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z" />
          </svg>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-[#261f76]">
            Manutenção
          </h1>
        </div>

        <p className="font-sans text-lg font-medium leading-relaxed text-[#261f76]/90">
          Acesse o site pelo computador ou notebook, atualmente ainda estou
          implementando esta tela para celulares.
        </p>

        <div className="flex flex-col items-center gap-3">
          <span className="font-sans text-sm font-normal tracking-wide text-[#261f76]/70">
            Entre em contato
          </span>
          <ContactButtons iconClassName="h-8 w-8" />
        </div>
      </div>
    </main>
  );
}
