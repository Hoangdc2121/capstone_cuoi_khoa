import Image from "next/image";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";

type TripsHeroProps = {
  imageSrc: string;
};

export default function TripsHero({ imageSrc }: TripsHeroProps) {
  return (
    <section
      aria-labelledby="trips-title"
      className="relative isolate overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-b-2xl lg:rounded-none"
      >
        <Image
          src={imageSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          draggable={false}
          className="select-none object-cover object-center"
        />

        <div className="hero-background-overlay" />
      </div>

      <Container className="relative z-10">
        <div className="flex flex-col justify-center pb-8 pt-24 sm:pb-10 sm:pt-28 lg:min-h-[600px] lg:pb-16 lg:pt-36">
          <h1
            id="trips-title"
            className="m-0! max-w-3xl font-heading text-3xl! font-semibold! leading-tight! tracking-tight text-primary-foreground! drop-shadow-sm sm:text-5xl! lg:text-6xl!"
          >
            <span className="block overflow-hidden py-1 lg:py-2">
              <Reveal as="span" animation="up" visible duration={0.7}>
                <span className="relative inline-block pb-5 text-secondary">
                  Chuyến đi của bạn
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 240 24"
                    preserveAspectRatio="none"
                    className="pointer-events-none absolute bottom-0 left-0 h-5 w-full text-primary"
                    fill="none"
                  >
                    <path
                      d="M4 17 Q60 3 120 13 T236 9"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="4 5"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              </Reveal>
            </span>
          </h1>

          <Reveal
            animation="up"
            visible
            delay={0.15}
            duration={0.7}
            className="mt-3 max-w-lg sm:mt-4"
          >
            <p className="m-0! text-pretty text-sm! leading-6! text-primary-foreground/90! sm:text-base! sm:leading-7!">
              Xem lại các chỗ ở đã đặt và kiểm tra ngày nhận, trả phòng.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
