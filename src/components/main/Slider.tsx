'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import { GoArrowRight, GoArrowLeft } from 'react-icons/go';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';

export default function Slider() {
  const swiperRef = useRef<SwiperType | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const slideItem = [
    {
      img: '/main/banner01.avif',
      title: '좋은 멘토가 되어주세요',
      description: '지식과 경험을 나누고 성장하는 여정, 지금 지원하세요',
      href: '/mentors',
    },
    {
      img: '/main/banner02.avif',
      title: '멘토링 일정, 미리 확인하고 예약하세요',
      description: '원하는 멘토의 일정을 보고 편하게 신청할 수 있어요',
      href: '/schedule',
    },
    {
      img: '/main/banner03.avif',
      title: '멘토들의 노하우를 먼저 읽어보세요',
      description: '실무자들이 전하는 진짜 이야기, 아티클에서 확인하세요',
      href: '/articles',
    },
    {
      img: '/main/banner04.avif',
      title: '당신에게 맞는 멘토를 찾아보세요',
      description: '관심 분야, 성향, 경험 기반으로 멘토를 추천해드립니다',
      href: '/mentor',
    },
  ];
  const arrowItem = [
    {
      img: <GoArrowLeft />,
      arrow: () => swiperRef.current?.slidePrev(),
      id: 1,
    },
    {
      img: <GoArrowRight />,
      arrow: () => swiperRef.current?.slideNext(),
      id: 2,
    },
  ];
  return (
    <article
      className={`relative mt-6 mb-16 px-5 transition-opacity duration-300 sm:mt-8 sm:px-8 xl:mt-10 xl:-ml-5 xl:px-0 ${
        imageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="pointer-events-none absolute top-1/2 right-5 left-5 z-10 flex -translate-y-1/2 justify-between px-5 sm:px-8 lg:mx-auto lg:max-w-[1200px] xl:px-0">
        {arrowItem.map(item => (
          <button
            key={item.id}
            onClick={item.arrow}
            className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow transition-transform hover:scale-110 sm:h-9 sm:w-9 md:h-10 md:w-10"
          >
            {item.img}
          </button>
        ))}
      </div>

      <Swiper
        modules={[Autoplay]}
        loop
        autoplay={{
          delay: 8000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          1024: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1300: {
            slidesPerView: 3.2,
            spaceBetween: 24,
          },
        }}
        onSwiper={swiper => {
          swiperRef.current = swiper;
        }}
      >
        {slideItem.map((item, index) => (
          <SwiperSlide key={item.title}>
            <Link
              href={item.href}
              className="relative block aspect-[16/9] overflow-hidden rounded-lg md:aspect-[16/9] lg:aspect-[16/9]"
            >
              <Image
                src={item.img}
                alt={item.description}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 360px"
                onLoad={() => setImageLoaded(true)}
                priority={index < 3}
              />
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-5 md:left-5">
                <em className="text-base font-semibold tracking-[-0.5%] text-white md:text-lg lg:text-2xl">
                  {item.title}
                </em>
                <p className="mt-1.5 text-sm tracking-[-0.25%] text-white md:text-base">
                  {item.description}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </article>
  );
}
