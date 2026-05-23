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
    <section className={`relative overflow-hidden bg-soft-primary ${compact ? 'pb-6 sm:pb-8' : 'pb-14 sm:pb-20'} page-pt`}>
      {/* subtle decorative background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="site-container relative">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 border border-primary/20 shadow-soft backdrop-blur-sm text-xs sm:text-sm font-semibold text-primary uppercase tracking-[0.18em]">
            <Icon icon="ph:sparkle-fill" width={14} />
            {badge}
          </span>

          <h1 className="display-1 text-balance">
            {title}
          </h1>

          {description && (
            <p className="text-base sm:text-lg text-muted leading-relaxed max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSub;
