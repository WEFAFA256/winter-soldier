import React from "react";
import { Sparkles, ArrowRight, Flame, Droplets, HeartPulse, Gem, Waves, Smile } from "lucide-react";

interface Treatment {
  title: string;
  price: string;
  desc: string;
  icon: React.ReactNode;
}

const treatments: Treatment[] = [
  {
    title: "Sauna Relax Experience",
    price: "$29.00",
    desc: "Infrared thermal sauna chamber infused with organic eucalyptus essences.",
    icon: <Flame className="w-6 h-6 text-spa-gold" />,
  },
  {
    title: "Aromatherapy Full Body",
    price: "$69.00",
    desc: "Gentle restorative massage utilizing cold-pressed Mediterranean botanical oils.",
    icon: <Droplets className="w-6 h-6 text-spa-gold" />,
  },
  {
    title: "Acupressure Reflexology",
    price: "$16.00",
    desc: "Targeted sensory pressure-point treatment stimulating energy flow and stress release.",
    icon: <HeartPulse className="w-6 h-6 text-spa-gold" />,
  },
  {
    title: "Thermo Basalt Stone",
    price: "$43.00",
    desc: "Heated volcanic river stones glide across tension points to dissolve fatigue.",
    icon: <Gem className="w-6 h-6 text-spa-gold" />,
  },
  {
    title: "Thai Herbal Compress",
    price: "$55.00",
    desc: "Warm muslin herbal poultice combined with rhythmic stretch acupressure.",
    icon: <Waves className="w-6 h-6 text-spa-gold" />,
  },
  {
    title: "Cellular Glow Facial Mask",
    price: "$38.00",
    desc: "Deep mineral clay cleanse paired with active botanical brightening serums.",
    icon: <Smile className="w-6 h-6 text-spa-gold" />,
  },
];

export default function PricingSection() {
  return (
    <section id="treatments" className="py-24 bg-spa-secondary relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 text-spa-gold text-xs uppercase tracking-widest font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Menu & Tariffs
          </div>
          <h2 className="font-cormorant text-3xl sm:text-5xl font-bold text-white mb-4">
            Signature Spa Rituals & Prices
          </h2>
          <p className="text-spa-muted text-sm md:text-base font-light">
            Indulge in our exquisite selection of therapies crafted to nourish your senses and revitalize your well-being.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {treatments.map((item, index) => (
            <div
              key={index}
              className="bg-spa-card/90 border border-spa-border hover:border-spa-gold/80 p-6 sm:p-8 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-gold group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-lg bg-spa-secondary border border-spa-border/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="font-cormorant text-3xl font-bold text-spa-gold">
                    {item.price}
                  </span>
                </div>

                <h3 className="font-cormorant text-2xl font-bold text-white mb-2 group-hover:text-spa-gold transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-wider text-spa-gold hover:text-white transition-colors"
              >
                <span>Reserve Session</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
