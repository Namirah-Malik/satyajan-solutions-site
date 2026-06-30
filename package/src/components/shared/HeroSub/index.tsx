// components/shared/HeroSub.tsx
import React, { FC } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

interface HeroSubProps {
  title:       string;
  description: string;
  badge:       string;
  compact?:    boolean;
}

const HeroSub: FC<HeroSubProps> = ({ title, description, badge, compact = false }) => {
  return (
    <section
      className={`text-center bg-cover relative overflow-x-hidden ${
        compact
          ? 'no-section-padding pt-20 pb-3'   // opts out of global "section { py-24 }" rule
          : 'pt-40 pb-20'                     // normal pages keep global py-24 + this
      }`}
    >
      <div className="flex gap-2.5 items-center justify-center">
        <Icon icon="ph:house-simple-fill" width={20} height={20} className="text-primary" />
        <p className="text-base font-semibold text-dark/75">{badge}</p>
      </div>
      <h2 className={`text-dark relative font-bold ${compact ? 'text-4xl sm:text-5xl leading-tight my-2' : 'text-52'}`}>
        {title}
      </h2>
      <p className={`text-dark/50 font-normal w-full mx-auto ${compact ? 'text-base sm:text-lg mb-0' : 'text-lg'}`}>
        {description}
      </p>
    </section>
  );
};

export default HeroSub;