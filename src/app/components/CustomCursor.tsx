"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCursorTheme, type CursorThemeColor } from "./CursorThemeContext";

const VERDE_HEX = "#1f763d";
const VERMELHO_HEX = "#761f24";
const LARANJA_HEX = "#ff7a00";

const BORDER_WIDTH_DEFAULT = 2;
const BORDER_WIDTH_ACTIVE = 5;

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

function isPointInsideContainedImage(
  rect: DOMRect,
  x: number,
  y: number,
  aspectRatio = 16 / 9
): boolean {
  const scale = Math.min(rect.width / aspectRatio, rect.height);
  const imgWidth = scale * aspectRatio;
  const imgHeight = scale;
  const left = rect.left + (rect.width - imgWidth) / 2;
  const top = rect.top + (rect.height - imgHeight) / 2;
  return x >= left && x <= left + imgWidth && y >= top && y <= top + imgHeight;
}

function isOverSameColorElement(x: number, y: number, targetColor: CursorThemeColor): boolean {
  const elements = document.elementsFromPoint(x, y);

  for (const element of elements) {
    if (!(element instanceof HTMLElement)) continue;

    if (element.tagName.toLowerCase() === "img") {
      return false;
    }

    const style = window.getComputedStyle(element);
    const bg = style.backgroundColor;

    if (hasVisibleBackgroundImage(style)) {
      if (isPointInsideContainedImage(element.getBoundingClientRect(), x, y)) {
        return false;
      }
      continue;
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

function isOverPointerElement(x: number, y: number): boolean {
  const element = document.elementFromPoint(x, y);
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.cursor === "pointer";
}

function isOverTechCarouselIcon(x: number, y: number): boolean {
  const element = document.elementFromPoint(x, y);
  if (!element) return false;
  return element.closest(".tech-carousel-icon") !== null;
}

function hasTextSelection() {
  const selection = window.getSelection();
  return !!selection && selection.toString().length > 0;
}

export default function CustomCursor() {
  const { color: themeColor, disableInteractionColors } = useCursorTheme();
  const pathname = usePathname();
  const isHome = pathname === "/" || pathname === "/projects";

  const [isVisible, setIsVisible] = useState(false);
  const [borderColor, setBorderColor] = useState<string>(themeColor);
  const [borderWidth, setBorderWidth] = useState(BORDER_WIDTH_DEFAULT);

  const isSelectingRef = useRef(false);
  const isSameColorRef = useRef(false);
  const isPointerRef = useRef(false);
  const isTechIconRef = useRef(false);
  const lastMouseX = useRef(-100);
  const lastMouseY = useRef(-100);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorScale = useMotionValue(1);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const cursorScaleSpring = useSpring(cursorScale, {
    damping: 20,
    stiffness: 300,
  });

  const updateAppearance = useCallback(() => {
    const isActive = isSelectingRef.current || isPointerRef.current || isTechIconRef.current;

    let color: string;
    if (isHome && !disableInteractionColors) {
      color = isSelectingRef.current
        ? VERDE_HEX
        : isTechIconRef.current
          ? VERMELHO_HEX
          : isPointerRef.current
            ? LARANJA_HEX
            : isSameColorRef.current
              ? "#ffffff"
              : themeColor;
    } else if (isSameColorRef.current) {
      color = "#ffffff";
    } else {
      color = themeColor;
    }

    setBorderColor(color);
    setBorderWidth(isActive ? BORDER_WIDTH_ACTIVE : BORDER_WIDTH_DEFAULT);
  }, [isHome, disableInteractionColors, themeColor]);

  useEffect(() => {
    updateAppearance();
  }, [updateAppearance]);

  useEffect(() => {
    const updateFromPosition = (x: number, y: number) => {
      const overSameColor = isOverSameColorElement(x, y, themeColor);
      const overPointer = isOverPointerElement(x, y);
      const overTechIcon = isOverTechCarouselIcon(x, y);

      isSameColorRef.current = overSameColor;
      isPointerRef.current = overPointer;
      isTechIconRef.current = overTechIcon;
      cursorScale.set(overTechIcon || overPointer || isSelectingRef.current ? 0.7 : 1);

      updateAppearance();
    };

    const handleMouseMove = (e: MouseEvent) => {
      lastMouseX.current = e.clientX;
      lastMouseY.current = e.clientY;
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setIsVisible(true);
      updateFromPosition(e.clientX, e.clientY);
    };

    const handleScroll = () => {
      if (lastMouseX.current >= 0 && lastMouseY.current >= 0) {
        updateFromPosition(lastMouseX.current, lastMouseY.current);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleSelectStart = () => {
      isSelectingRef.current = true;
      updateAppearance();
      cursorScale.set(0.7);
    };

    const handleSelectionChange = () => {
      const selecting = hasTextSelection();
      if (selecting !== isSelectingRef.current) {
        isSelectingRef.current = selecting;
        updateAppearance();
        cursorScale.set(selecting ? 0.7 : 1);
      }
    };

    const handleMouseUp = () => {
      isSelectingRef.current = hasTextSelection();
      updateAppearance();
      cursorScale.set(isSelectingRef.current ? 0.7 : 1);
    };

    const handleMouseDown = () => {
      isSelectingRef.current = false;
      updateAppearance();
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("selectstart", handleSelectStart);
    document.addEventListener("selectionchange", handleSelectionChange);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("selectstart", handleSelectStart);
      document.removeEventListener("selectionchange", handleSelectionChange);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [cursorX, cursorY, cursorScale, updateAppearance, themeColor]);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-8 w-8 rounded-full md:block"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        scale: cursorScaleSpring,
        translateX: "-50%",
        translateY: "-50%",
        borderColor,
        borderWidth,
        borderStyle: "solid",
        opacity: isVisible ? 1 : 0,
        transition: "border-color 400ms ease, border-width 150ms ease, opacity 200ms ease",
      }}
    />
  );
}
