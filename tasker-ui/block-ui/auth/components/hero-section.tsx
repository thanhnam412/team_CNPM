"use client";

import { NeoCard, NeoCardContent } from "@/components/ui-custom/neo-card";
import { Star } from "lucide-react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

const testimonials = [
  {
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAb61Uo9amEu-S5LZTldahS2SSKVXzZ92UyT29LtCgsuCtgyazpMV7YvnWoqZo-fcp1yVNUpfTIiM2L79qpYUaWtArJAYOprtIQqVNyIvw_d6oWtcjHt7E5rHMD2BcPORxyh5ldJIhzFQlb4vBpajWqM5R7sKXxdsFBbTIMdXbzdP-EpY7Y_Y3UjaKtPkaDKIDVc6L48IqdvxzhwCGHSW4c_zk7v3ox1b2npdWcmYZTdtgdpCHS16ElacrbbmwpmnrIgfLhFka2aNg",
    quote:
      "Aitasker giúp tôi tìm thấy những khách hàng tuyệt vời nhất mà tôi từng hợp tác.",
    author: "Minh Trần",
    role: "UI/UX Designer",
  },
  {
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1600",
    quote:
      "Chỉ sau 2 tháng tôi đã có được nguồn thu nhập ổn định từ các dự án chất lượng.",
    author: "Ngọc Nguyễn",
    role: "Frontend Developer",
  },
  {
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600",
    quote:
      "Nền tảng dễ sử dụng, khách hàng chuyên nghiệp và thanh toán minh bạch.",
    author: "Tuấn Lê",
    role: "Backend Engineer",
  },
];

export function HeroSideSection() {
  return (
    <div className="hidden lg:flex flex-col h-full items-start gap-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold tracking-tight">
          Mở khóa cơ hội <span className="text-primary">Tự do</span>
        </h1>

        <p className="max-w-md text-lg text-muted-foreground">
          Kết nối với hàng ngàn dự án chất lượng và xây dựng sự nghiệp Freelance
          bền vững cùng Aitasker.
        </p>
      </div>
      <Carousel
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3500,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {testimonials.map((item, index) => (
            <CarouselItem key={index}>
              <NeoCard className="overflow-hidden p-0 border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] h-full">
                <div className="relative aspect-video">
                  <Image
                    src={item.image}
                    alt={item.author}
                    fill
                    priority
                    className="object-cover"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                  <NeoCardContent className="absolute inset-x-0 bottom-0 p-6 text-white z-10">
                    <div className="mb-3 flex gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>

                    <blockquote className="text-base italic leading-relaxed">
                      &quot;{item.quote}&quot;
                    </blockquote>

                    <div className="mt-4">
                      <p className="font-semibold">{item.author}</p>
                      <p className="text-sm text-white/75">{item.role}</p>
                    </div>
                  </NeoCardContent>
                </div>
              </NeoCard>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
