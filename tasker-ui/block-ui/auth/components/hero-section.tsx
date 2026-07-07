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
              <NeoCard className="overflow-hidden p-0 border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] h-full flex flex-col bg-card">
                <div className="relative aspect-video border-b-4 border-foreground">
                  <Image
                    src={item.image}
                    alt={item.author}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                
                <NeoCardContent className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="mb-4 flex gap-1">
                      {Array.from({ length: 5 }).map((_, starIndex) => (
                        <Star
                          key={starIndex}
                          className="h-5 w-5 fill-[#FFB800] text-foreground border-foreground stroke-2"
                        />
                      ))}
                    </div>

                    <blockquote className="text-xl font-black uppercase tracking-tight leading-snug">
                      "{item.quote}"
                    </blockquote>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-none border-2 border-foreground bg-primary shrink-0 flex items-center justify-center">
                       <span className="font-black text-primary-foreground text-lg">{item.author.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-bold text-lg leading-none">{item.author}</p>
                      <p className="text-sm font-medium text-muted-foreground mt-1 uppercase tracking-wider">{item.role}</p>
                    </div>
                  </div>
                </NeoCardContent>
              </NeoCard>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
