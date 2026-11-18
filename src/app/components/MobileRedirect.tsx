"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface MobileRedirectProps {
  children: React.ReactNode;
}

const MOBILE_BREAKPOINT = 1024;
const MOBILE_ROUTE = "/m";

export default function MobileRedirect({ children }: MobileRedirectProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const isMobileRoute = pathname === MOBILE_ROUTE || pathname.startsWith("/m/");

    if (isMobileRoute) return;

    const checkScreenSize = () => {
      if (window.innerWidth < MOBILE_BREAKPOINT) {
        router.push(MOBILE_ROUTE);
      }
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [pathname, router]);

  return <>{children}</>;
}
