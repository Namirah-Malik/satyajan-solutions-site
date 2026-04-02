"use client";
import * as React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { testimonials } from "@/app/api/testimonial";

const Testimonial = () => {
    const [api, setApi] = React.useState<CarouselApi | undefined>(undefined);
    const [current, setCurrent] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const handleDotClick = (index: number) => {
        if (api) {
            api.scrollTo(index);
        }
    };

    return (
        <section className="relative overflow-hidden py-10 md:py-12" id="testimonial">
            <div className="container max-w-7xl mx-auto px-5 2xl:px-0 relative z-10">
                <div className="mb-8 text-center">
                    <p className="text-emerald-700 text-sm font-semibold flex gap-2 items-center justify-center">
                        <Icon icon="ph:solar-panel" className="text-xl text-yellow-400 animate-pulse" />
                        <span className="tracking-wide uppercase">Testimonials</span>
                    </p>
                    <h2 className="lg:text-3xl text-2xl font-bold text-gray-900 mt-1 leading-tight drop-shadow-lg">
                        What our clients say
                    </h2>
                </div>
                <div className="">
                <Carousel setApi={setApi} opts={{ loop: true }}>
                    <CarouselContent>
                        {testimonials.map((item, index) => (
                            <CarouselItem key={index} className="flex justify-center mt-2 ">
                                <div className="relative flex flex-col items-center w-full animate-fade-in max-w-3xl mx-auto">
                                    {/* Client Image Overlap */}
                                    {/* <div className="relative z-10 -mb-8">
                                        <Image
                                            src={item.image}
                                            alt={item.name}
                                            width={56}
                                            height={56}
                                            className="rounded-full border-2 border-primary/30 shadow-lg object-cover bg-white"
                                            unoptimized={true}
                                        />
                                    </div> */}
                                    <div className="relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-primary/10 p-5 pt-12 w-full min-h-0 max-h-[350px] md:max-h-[300px] overflow-y-auto transition-transform duration-300 hover:shadow-2xl group">
                                        {/* Decorative Quote Icon */}
                                        <Icon icon="ph:quotes-fill" className="absolute top-8 left-4 text-primary/50 text-4xl opacity-60 z-0" />
                                        <h4 className="text-gray-900 text-base md:text-lg font-semibold leading-snug mb-4 text-center">{item.review}</h4>
                                        <div className="flex flex-col items-center gap-0.5 mt-2">
                                            <h6 className="text-emerald-700 text-base font-bold">{item.name}</h6>
                                            <p className="text-gray-600 text-xs">{item.position}</p>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                </div>
                <div className="flex justify-center mt-8">
                    <div className="flex gap-2 bg-primary/60 px-4 py-2 rounded-full shadow-lg">
                        {Array.from({ length: count }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/70 ${current === index + 1 ? "bg-white/80 scale-110 shadow-lg" : "bg-white/40 border-yellow-200 hover:bg-yellow-300/60"}`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonial;
