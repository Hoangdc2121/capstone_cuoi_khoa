"use client";

import Link from "next/link";

import BrandLogo from "@/components/common/BrandLogo";
import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import { AnimatedThemeToggle } from "@/components/ui/animated-theme-toggle";
import { cn } from "@/lib/utils";

import useHeader from "../client/hooks/useHeader";
import useHeaderAccount from "../client/hooks/useHeaderAccount";
import { desktopNavigation } from "../client/navigation/navigation";

export default function Header() {
  const { solid, isActive, handleNavigation } = useHeader();
  const { authenticated, checking, accountHref, accountLabel } =
    useHeaderAccount();

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "w-full border-b transition-[background-color,border-color,backdrop-filter] duration-300 motion-reduce:transition-none",
          solid
            ? "border-border/60 bg-background/65 backdrop-blur-xl"
            : "border-transparent bg-transparent backdrop-blur-none",
        )}
      >
        <Reveal animation="down" duration={1.4} delay={0.2}>
          <Container className="flex h-16 items-center justify-between gap-4 lg:grid lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
            <div className="flex min-w-0 items-center justify-start">
              <BrandLogo className="h-12 lg:h-16" imageClassName="h-full" />
            </div>

            <div className="hidden lg:block">
              <nav
                aria-label="Điều hướng chính"
                className="flex items-center justify-center gap-6 px-4 py-3 xl:gap-8"
              >
                {desktopNavigation.map((item) => {
                  const active = isActive(item.href);
                  const waiting = checking && Boolean(item.requiresAuth);
                  const href =
                    item.requiresAuth && !authenticated ? "/login" : item.href;

                  const className = cn(
                    "animated-underline whitespace-nowrap py-1 text-sm font-medium no-underline! transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
                    solid
                      ? active
                        ? "text-accent-foreground!"
                        : "text-foreground! hover:text-accent-foreground!"
                      : active
                        ? "text-primary!"
                        : "text-primary-foreground! hover:text-primary!",
                  );

                  if (waiting) {
                    return (
                      <span
                        key={item.href}
                        aria-disabled="true"
                        aria-busy="true"
                        className={cn(className, "opacity-50")}
                      >
                        {item.label}
                      </span>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={href}
                      onClick={() => handleNavigation(href)}
                      aria-current={active ? "page" : undefined}
                      className={className}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-3 sm:gap-4">
              <div
                className={cn(
                  "hidden shrink-0 items-center rounded-full text-foreground lg:flex",
                  !solid && "bg-background/80 backdrop-blur-sm",
                )}
              >
                <AnimatedThemeToggle />
              </div>

              {checking ? (
                <div
                  role="status"
                  aria-label="Đang kiểm tra tài khoản"
                  className={cn(
                    "hidden h-10 w-28 rounded-full lg:block",
                    solid ? "bg-muted" : "bg-primary-foreground/20",
                  )}
                />
              ) : (
                <Link
                  href={accountHref}
                  className={cn(
                    "hidden h-10 min-w-28 items-center justify-center rounded-full px-5 text-sm font-semibold no-underline! transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring lg:inline-flex",
                    solid
                      ? "text-foreground! hover:bg-accent"
                      : "text-primary-foreground! hover:bg-primary-foreground/10",
                  )}
                >
                  {accountLabel}
                </Link>
              )}
            </div>
          </Container>
        </Reveal>
      </div>
    </header>
  );
}
