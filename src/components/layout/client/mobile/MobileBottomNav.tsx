"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";

import useHeaderAccount from "../hooks/useHeaderAccount";
import { mobileNavigation } from "../navigation/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { authenticated, checking } = useHeaderAccount();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="Điều hướng dưới màn hình"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
    >
      <div className="mx-auto grid h-16 w-full max-w-lg grid-cols-5 px-2">
        {mobileNavigation.map((item, index) => {
          const Icon = item.icon;
          const waiting = checking && Boolean(item.requiresAuth);

          const href =
            item.requiresAuth && !authenticated ? "/login" : item.href;

          const active =
            isActive(item.href) ||
            (item.href === "/profile" && pathname === "/login");

          const className = cn(
            "flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring",
            active
              ? "text-secondary!"
              : "text-muted-foreground! hover:text-secondary!",
          );

          const content = (
            <>
              <Icon
                size={22}
                strokeWidth={active ? 2.3 : 1.8}
                aria-hidden="true"
              />

              <span className="whitespace-nowrap">{item.label}</span>
            </>
          );

          return (
            <Fragment key={item.href}>
              {/* Chèn nút theme trước mục thứ ba. */}
              {index === 2 && (
                <div className="flex min-w-0 items-center justify-center text-foreground">
                  <AnimatedThemeToggle />
                </div>
              )}

              {waiting ? (
                <div
                  aria-disabled="true"
                  aria-busy="true"
                  className={cn(className, "opacity-50")}
                >
                  {content}
                </div>
              ) : (
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={className}
                >
                  {content}
                </Link>
              )}
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}
