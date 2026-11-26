"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function useHeader() {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  const hasHero =
    pathname === "/" ||
    pathname === "/explore" ||
    pathname.startsWith("/explore/") ||
    pathname === "/trips" ||
    pathname.startsWith("/rooms/");

  const solid = !hasHero || scrolled;

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 24);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    function updateHash() {
      setActiveHash(window.location.hash);
    }

    updateHash();
    window.addEventListener("hashchange", updateHash);
    window.addEventListener("popstate", updateHash);

    return () => {
      window.removeEventListener("hashchange", updateHash);
      window.removeEventListener("popstate", updateHash);
    };
  }, [pathname]);

  function isActive(href: string) {
    const [path, hash] = href.split("#");

    const matchesPath =
      path === "/"
        ? pathname === "/"
        : pathname === path || pathname.startsWith(`${path}/`);

    if (!matchesPath) return false;

    return hash ? activeHash === `#${hash}` : true;
  }

  function handleNavigation(href: string) {
    const hash = href.split("#")[1];

    setActiveHash(hash ? `#${hash}` : "");
  }

  return {
    solid,
    isActive,
    handleNavigation,
  };
}