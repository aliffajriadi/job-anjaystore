"use client";

import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const banners = [
  {
    id: 1,
    image: "/banners/proxy.png", // Will rename generated images or use their paths
    title: "High Performance Proxy",
    subtitle: "Secure, Fast, and Reliable SOCKS5 Connections",
  },
  {
    id: 2,
    image: "/banners/growtopia.png",
    title: "Growtopia Premium Store",
    subtitle: "Cheapest Diamond Locks & Professional Services",
  },
  {
    id: 3,
    image: "/banners/bot.png",
    title: "Automated Bot Services",
    subtitle: "Boost Your Efficiency with Our Advanced Bot Solutions",
  },
];

export const BannerCarousel = ({ images }: { images: string[] }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const bannersWithImages = banners.map((banner, index) => ({
    ...banner,
    image: images[index] || banner.image,
  }));

  return (
    <div className="relative group overflow-hidden rounded-2xl md:rounded-[2.5rem] mb-12 shadow-2xl shadow-zinc-200/50 border border-zinc-100 bg-zinc-100">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {bannersWithImages.map((banner) => (
            <div
              key={banner.id}
              className="relative flex-[0_0_100%] min-w-0 aspect-[21/9] md:aspect-[25/9] transition-transform duration-500 ease-out"
            >
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute hidden  inset-0 bg-linear-to-t from-zinc-950/80 via-zinc-950/20 to-transparent md:flex flex-col justify-end p-8 md:p-16">
                <div className="max-w-2xl transform translate-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 fill-mode-forwards">
                  <h2 className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tight drop-shadow-lg">
                    {banner.title}
                  </h2>
                  <p className="text-zinc-200 text-sm md:text-lg font-medium mb-8 max-w-lg drop-shadow-md">
                    {banner.subtitle}
                  </p>
                  <Button className="rounded-2xl px-8 py-6 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                    LIHAT DETAIL
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20 active:scale-90"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "bg-emerald-500 w-8"
                : "bg-white/40 hover:bg-white/60",
            )}
          />
        ))}
      </div>
    </div>
  );
};
