"use client";

import { useRef } from "react";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

import BrandLogo from "@/components/common/BrandLogo";
import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { desktopNavigation } from "../client/navigation/navigation";

const linkClassName =
  "animated-underline inline-flex! min-h-11 max-w-full items-center gap-2 text-sm font-medium text-muted-foreground! transition-colors duration-200 hover:text-primary! focus-visible:text-primary! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

const headingClassName =
  "m-0! font-heading text-xs! font-semibold! leading-6! tracking-wide text-foreground! sm:text-sm!";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    Icon: FaFacebookF,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    Icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    Icon: FaYoutube,
  },
];

export default function FooterContent() {
  const brandRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  const observerOptions = {
    threshold: 0,
    rootMargin: "0px 0px -40px 0px",
    once: true,
  };

  const brandVisible = useIntersectionObserver(brandRef, observerOptions);
  const navigationVisible = useIntersectionObserver(
    navigationRef,
    observerOptions,
  );
  const contactVisible = useIntersectionObserver(contactRef, observerOptions);
  const copyrightVisible = useIntersectionObserver(copyrightRef, {
    threshold: 0,
    once: true,
  });

  return (
    <Container>
      <div className="pb-6 pt-12 lg:pt-16">
        <div className="grid items-start gap-y-10 sm:gap-y-12 lg:grid-cols-[1.6fr_0.7fr_1fr] lg:gap-x-16">
          {/* Thương hiệu. */}
          <div
            ref={brandRef}
            className="mx-auto w-full max-w-lg min-w-0 lg:mx-0"
          >
            <Reveal animation="up" visible={brandVisible} duration={0.7}>
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="shrink-0">
                  <BrandLogo
                    className="h-16 sm:h-20"
                    imageClassName="h-full w-auto object-contain"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="m-0! font-heading text-lg! font-bold! leading-tight! text-foreground! sm:text-2xl!">
                    <span className="block">Đi đâu cũng được.</span>

                    <span className="relative inline-block pb-3 text-secondary">
                      Miễn là được đi.
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 240 16"
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute bottom-0 left-0 h-3 w-full text-primary"
                        fill="none"
                      >
                        <path
                          d="M4 10C48 3 91 5 128 8C163 11 199 6 236 5"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeDasharray="5 5"
                        />
                      </svg>
                    </span>
                  </p>

                  <p className="mb-0! mt-3! max-w-xs text-sm! leading-6! text-muted-foreground!">
                    Tìm một chỗ nghỉ hợp gu và khám phá những điểm đến theo cách
                    của bạn.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Căn giữa cả nhóm trên mobile, giữ ba cột trên desktop. */}
          <div className="mx-auto grid w-fit max-w-full grid-cols-[max-content_minmax(0,max-content)] items-start gap-x-6 sm:gap-x-16 lg:contents">
            {/* Điều hướng. */}
            <div ref={navigationRef} className="min-w-0">
              <Reveal
                animation="up"
                visible={navigationVisible}
                delay={0.12}
                duration={0.7}
              >
                <nav aria-label="Điều hướng cuối trang">
                  <h3 className={headingClassName}>KHÁM PHÁ</h3>

                  <ul className="m-0! mt-4! list-none space-y-1 p-0!">
                    {desktopNavigation.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className={`${linkClassName} text-xs! sm:text-sm!`}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Reveal>
            </div>

            {/* Liên hệ. */}
            <div ref={contactRef} className="min-w-0">
              <Reveal
                animation="up"
                visible={contactVisible}
                delay={0.24}
                duration={0.7}
              >
                <h3 className={headingClassName}>KẾT NỐI VỚI Ở ĐÂU</h3>

                <address className="mt-4 flex flex-col items-start gap-1 not-italic">
                  <a
                    href="mailto:hello@example.com"
                    className={`${linkClassName} text-xs! sm:text-sm!`}
                  >
                    <Mail size={17} aria-hidden="true" className="shrink-0" />

                    <span className="min-w-0 wrap-anywhere">
                      hello@example.com
                    </span>
                  </a>

                  <a
                    href="tel:+84000000000"
                    className={`${linkClassName} text-xs! sm:text-sm!`}
                  >
                    <Phone size={17} aria-hidden="true" className="shrink-0" />

                    <span>0000 000 000</span>
                  </a>
                </address>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Bản quyền và mạng xã hội luôn cùng hàng. */}
        <div
          ref={copyrightRef}
          className="mt-8 border-t border-border pt-5 sm:mt-10 lg:mt-12"
        >
          <Reveal animation="fade" visible={copyrightVisible} duration={0.7}>
            <div className="flex items-center justify-between gap-3 sm:gap-6">
              <p className="m-0! min-w-0 flex-1 text-left text-[11px]! leading-5! text-muted-foreground! sm:text-xs!">
                <span className="block sm:inline">
                  © {new Date().getFullYear()} Ở Đâu.
                </span>{" "}
                <span>Bảo lưu mọi quyền.</span>
              </p>

              <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                {socialLinks.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} — mở trong tab mới`}
                    className="group inline-flex! size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-foreground! backdrop-blur-sm transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground! group-focus-visible:bg-primary group-focus-visible:text-primary-foreground! sm:size-11"
                    >
                      <Icon size={18} className="text-current" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Container>
  );
}
