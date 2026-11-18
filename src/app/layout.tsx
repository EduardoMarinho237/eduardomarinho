import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins } from "next/font/google";
import "./globals.css";
import MobileRedirect from "./components/MobileRedirect";
import CustomCursor from "./components/CustomCursor";
import { CursorThemeProvider } from "./components/CursorThemeContext";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Eduardo Marinho | Desenvolvedor FullStack",
  description: "Portfólio de Eduardo Marinho, desenvolvedor FullStack.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
        <CursorThemeProvider>
          <Suspense fallback={null}>
            <CustomCursor />
          </Suspense>
          <Suspense fallback={children}>
            <MobileRedirect>{children}</MobileRedirect>
          </Suspense>
        </CursorThemeProvider>
      </body>
    </html>
  );
}
