"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";

interface GalleryImage {
  id?: string;
  src: string;
  alt?: string;
  delay?: string;
  availability?: "available" | "in-session" | string;
}

interface SpaVideo {
  id: string;
  title: string;
  specialist: string;
  role: string;
  category: "all" | "tantra" | "hammam" | "deep";
  categoryLabel: string;
  duration: string;
  youtubeId: string;
  poster: string;
  description: string;
  bookingService: string;
}

const INITIAL_IMAGES: GalleryImage[] = [
  {
    "id": "serenity_gallery/u7wll8tto5yxjt4ptcbl",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784667206/serenity_gallery/u7wll8tto5yxjt4ptcbl.jpg",
    "alt": "Serenity Spa - 1",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/afxgagluqzhsoe03mqk9",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784667142/serenity_gallery/afxgagluqzhsoe03mqk9.jpg",
    "alt": "Serenity Spa - 2",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/cnl0pcncguetzsg6ms5v",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784667087/serenity_gallery/cnl0pcncguetzsg6ms5v.jpg",
    "alt": "Serenity Spa - 3",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/kxvbybo5fbghkfomnavv",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784667018/serenity_gallery/kxvbybo5fbghkfomnavv.jpg",
    "alt": "Serenity Spa - 4",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/qeggi27voyojjagykgjc",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666990/serenity_gallery/qeggi27voyojjagykgjc.jpg",
    "alt": "Serenity Spa - 5",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/phpfggg1hugcm3hscch9",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666757/serenity_gallery/phpfggg1hugcm3hscch9.jpg",
    "alt": "Serenity Spa - 6",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/d5ghooox7mvdrhhfltdf",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666737/serenity_gallery/d5ghooox7mvdrhhfltdf.jpg",
    "alt": "Serenity Spa - 7",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/qelswht6b7aihiphhdvi",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666718/serenity_gallery/qelswht6b7aihiphhdvi.jpg",
    "alt": "Serenity Spa - 8",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/t5sclwn33ule7xnchlcb",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666700/serenity_gallery/t5sclwn33ule7xnchlcb.jpg",
    "alt": "Serenity Spa - 9",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/hsjvouioqq0sndml5v7c",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666683/serenity_gallery/hsjvouioqq0sndml5v7c.jpg",
    "alt": "Serenity Spa - 10",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/t0mtvlun6qo7vqeivqhd",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666667/serenity_gallery/t0mtvlun6qo7vqeivqhd.jpg",
    "alt": "Serenity Spa - 11",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/jyyfr1xpqmrwlzrnbrdm",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666629/serenity_gallery/jyyfr1xpqmrwlzrnbrdm.jpg",
    "alt": "Serenity Spa - 12",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/v1rkocdpgjah4kaat0pt",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666608/serenity_gallery/v1rkocdpgjah4kaat0pt.jpg",
    "alt": "Serenity Spa - 13",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/e5866wezcakks2pllscj",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666586/serenity_gallery/e5866wezcakks2pllscj.jpg",
    "alt": "Serenity Spa - 14",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/lvf9oyrspjtbkg5gtkgz",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666565/serenity_gallery/lvf9oyrspjtbkg5gtkgz.jpg",
    "alt": "Serenity Spa - 15",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/desamah6uyp3m7whalb7",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666540/serenity_gallery/desamah6uyp3m7whalb7.jpg",
    "alt": "Serenity Spa - 16",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/tqukdsman9uxdnulnpnz",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784666484/serenity_gallery/tqukdsman9uxdnulnpnz.jpg",
    "alt": "Serenity Spa - 17",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/klc2afwpbttzyvecfche",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784659263/serenity_gallery/klc2afwpbttzyvecfche.jpg",
    "alt": "Serenity Spa - 18",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/vpduqbk8uo6c7242siwh",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784659195/serenity_gallery/vpduqbk8uo6c7242siwh.jpg",
    "alt": "Serenity Spa - 19",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/d6qy4vjlxtypltd3jqhn",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784656339/serenity_gallery/d6qy4vjlxtypltd3jqhn.jpg",
    "alt": "Serenity Spa - 20",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/f91n7of8lbd2t8b6hu1h",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784656301/serenity_gallery/f91n7of8lbd2t8b6hu1h.jpg",
    "alt": "Serenity Spa - 21",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/i8fr7d0kz8v1didnx817",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784656243/serenity_gallery/i8fr7d0kz8v1didnx817.jpg",
    "alt": "Serenity Spa - 22",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/gj33czjhq6vfqud8nzof",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784656204/serenity_gallery/gj33czjhq6vfqud8nzof.jpg",
    "alt": "Serenity Spa - 23",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/ye4esxgis1v1y17jqbpp",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784656158/serenity_gallery/ye4esxgis1v1y17jqbpp.jpg",
    "alt": "Serenity Spa - 24",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/gs839tq320ejom5n1xtq",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784656107/serenity_gallery/gs839tq320ejom5n1xtq.jpg",
    "alt": "Serenity Spa - 25",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/oewkuyh6uatuqrzljqoj",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784656058/serenity_gallery/oewkuyh6uatuqrzljqoj.jpg",
    "alt": "Serenity Spa - 26",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/nzijyh5yozfiso24nghv",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784656010/serenity_gallery/nzijyh5yozfiso24nghv.jpg",
    "alt": "Serenity Spa - 27",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/cfznazjmcmixg6bvpwtl",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655975/serenity_gallery/cfznazjmcmixg6bvpwtl.jpg",
    "alt": "Serenity Spa - 28",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/cgjzjziwh6h7isiap4ty",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655907/serenity_gallery/cgjzjziwh6h7isiap4ty.jpg",
    "alt": "Serenity Spa - 29",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/qjyczpnhzo4arndr0meb",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655857/serenity_gallery/qjyczpnhzo4arndr0meb.jpg",
    "alt": "Serenity Spa - 30",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/qf0k7qmnzwtcru0w6vlh",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655738/serenity_gallery/qf0k7qmnzwtcru0w6vlh.jpg",
    "alt": "Serenity Spa - 31",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/lgzghgsgf384zqrj3t8q",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655682/serenity_gallery/lgzghgsgf384zqrj3t8q.jpg",
    "alt": "Serenity Spa - 32",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/ln2f2q5oksvbtbbxeqvs",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655630/serenity_gallery/ln2f2q5oksvbtbbxeqvs.jpg",
    "alt": "Serenity Spa - 33",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/rxkzgxpqoihjigbkwdht",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655509/serenity_gallery/rxkzgxpqoihjigbkwdht.jpg",
    "alt": "Serenity Spa - 34",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/ohck4kl0mzy9dkug4xqe",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655283/serenity_gallery/ohck4kl0mzy9dkug4xqe.jpg",
    "alt": "Serenity Spa - 35",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/xntnadwetoay2djljhrm",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655217/serenity_gallery/xntnadwetoay2djljhrm.jpg",
    "alt": "Serenity Spa - 36",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/xmaybxevhwoctw2tadql",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655143/serenity_gallery/xmaybxevhwoctw2tadql.jpg",
    "alt": "Serenity Spa - 37",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/mfb6hmq3eqvcyptri6rt",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655083/serenity_gallery/mfb6hmq3eqvcyptri6rt.jpg",
    "alt": "Serenity Spa - 38",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/nqzzbheyvuhawchpmp9m",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784655023/serenity_gallery/nqzzbheyvuhawchpmp9m.jpg",
    "alt": "Serenity Spa - 39",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/agglgsi62k9rirmyxgbk",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654986/serenity_gallery/agglgsi62k9rirmyxgbk.jpg",
    "alt": "Serenity Spa - 40",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/kedpxi61yjsnn0vacfle",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654950/serenity_gallery/kedpxi61yjsnn0vacfle.jpg",
    "alt": "Serenity Spa - 41",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/xrf3r2grelhgsvisvfyi",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654835/serenity_gallery/xrf3r2grelhgsvisvfyi.jpg",
    "alt": "Serenity Spa - 42",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/kqb7au4m0z6o5naejgnu",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654741/serenity_gallery/kqb7au4m0z6o5naejgnu.jpg",
    "alt": "Serenity Spa - 43",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/ekw5xzavezsfebu2fgb5",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654681/serenity_gallery/ekw5xzavezsfebu2fgb5.jpg",
    "alt": "Serenity Spa - 44",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/effzibb4g7tbhbtvgari",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654637/serenity_gallery/effzibb4g7tbhbtvgari.jpg",
    "alt": "Serenity Spa - 45",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/xrzx7qpsqgqwum65s2cb",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654579/serenity_gallery/xrzx7qpsqgqwum65s2cb.jpg",
    "alt": "Serenity Spa - 46",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/lgo3rbzk22rtjcvj9gu1",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654547/serenity_gallery/lgo3rbzk22rtjcvj9gu1.jpg",
    "alt": "Serenity Spa - 47",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/zjvtjfkjnhfvknnoz1jq",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654499/serenity_gallery/zjvtjfkjnhfvknnoz1jq.jpg",
    "alt": "Serenity Spa - 48",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/qj7er6wta6c7wqnuadtu",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654464/serenity_gallery/qj7er6wta6c7wqnuadtu.jpg",
    "alt": "Serenity Spa - 49",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/jqa0xmu72oxztdzwovdg",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654416/serenity_gallery/jqa0xmu72oxztdzwovdg.jpg",
    "alt": "Serenity Spa - 50",
    "delay": "delay-200"
  },
  {
    "id": "serenity_gallery/srfhfmwnqcyq9mkpfffp",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654371/serenity_gallery/srfhfmwnqcyq9mkpfffp.jpg",
    "alt": "Serenity Spa - 51",
    "delay": "delay-300"
  },
  {
    "id": "serenity_gallery/cq6vwta9gaa80ykriort",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654151/serenity_gallery/cq6vwta9gaa80ykriort.jpg",
    "alt": "Serenity Spa - 52",
    "delay": "delay-100"
  },
  {
    "id": "serenity_gallery/rvfg2s7u9ltxknogbtmz",
    "src": "https://res.cloudinary.com/njzctr4m/image/upload/v1784654069/serenity_gallery/rvfg2s7u9ltxknogbtmz.jpg",
    "alt": "Serenity Spa - 53",
    "delay": "delay-200"
  }
];

const whatsappNumber = "256781945510";

const SPA_VIDEOS: SpaVideo[] = [
  {
    id: "video-1",
    title: "Deep Tissue & Muscular Release Flow",
    specialist: "Specialist Brenda",
    role: "Master Deep Bodywork & Fascia Release",
    category: "deep",
    categoryLabel: "Deep Tissue",
    duration: "4:15 HD",
    youtubeId: "5j3x5qliPEw",
    poster: "/assets/images/backgrounds/services-header-bg.jpg",
    description: "Firm rhythmic pressure strokes targeting deeper muscular layers and connective tissue to eliminate neck, shoulder, and lumbar tension.",
    bookingService: "Deep Tissue Massage",
  },
  {
    id: "video-2",
    title: "Authentic Turkish Hammam & Foam Cloud",
    specialist: "Specialist Maya",
    role: "Head of Hydrotherapy & Thermal Spa",
    category: "hammam",
    categoryLabel: "Turkish Hammam",
    duration: "5:30 HD",
    youtubeId: "uClVl1keyBk",
    poster: "/assets/service6.jpg",
    description: "An Ottoman bathing ritual on heated marble stone — authentic kese glove exfoliation followed by clouds of warm olive soap foam and a soothing rinse.",
    bookingService: "Turkish Bath Packages",
  },
  {
    id: "video-3",
    title: "Royal 4-Hands Synchronized Tantra Flow",
    specialist: "Chloe & Sarah",
    role: "VIP Tantric Tandem Specialists",
    category: "tantra",
    categoryLabel: "VIP 4-Hands",
    duration: "3:45 HD",
    youtubeId: "rLOFIo4c1E0",
    poster: "/assets/4hands-tantra-yoni.jpg",
    description: "Two skilled therapists working in unbroken symmetry, weaving warm aromatic oils with sensual touch for profound sensory immersion.",
    bookingService: "4hands Tantra | Yoni",
  },
  {
    id: "video-4",
    title: "Japanese Scalp Elixir & Head Spa",
    specialist: "Specialist Faith",
    role: "Aromatherapy & Scalp Acupressure Lead",
    category: "deep",
    categoryLabel: "Head Spa",
    duration: "3:10 HD",
    youtubeId: "Ver7IMBBOO8",
    poster: "/assets/service7.jpg",
    description: "Cranial acupressure points, warm herbal rinse flow, and aromatic essential oils designed to clear mental fatigue and calm the nervous system.",
    bookingService: "Aromatherapy Massage",
  },
  {
    id: "video-5",
    title: "Holistic Swedish De-Stress & Essential Oils",
    specialist: "Specialist Diana",
    role: "Holistic Wellness & Relaxation Specialist",
    category: "deep",
    categoryLabel: "Swedish Flow",
    duration: "4:20 HD",
    youtubeId: "-qp89eeXMB0",
    poster: "/assets/full-service-pack.jpg",
    description: "Long flowing effleurage strokes, gentle kneading, and warm lavender and sweet almond oils to melt everyday stress and restore inner calm.",
    bookingService: "Full Service Pack",
  },
  {
    id: "video-6",
    title: "Sensual Nuru & Hot Oil Gliding Ritual",
    specialist: "Specialist Vanessa",
    role: "Senior Nuru & Intimate Touch Lead",
    category: "tantra",
    categoryLabel: "Sensual Nuru",
    duration: "4:50 HD",
    youtubeId: "oJ8VDciScco",
    poster: "/assets/4hands-nuru-b2b.jpg",
    description: "Traditional slippery seaweed extract glide therapy performed over heated waterproof bedding for total body-to-body sensory bliss.",
    bookingService: "Nuru Massage",
  },
];

// ── Specialist Profile Card with Availability Badge & Book Therapist Button ──
function GalleryCard({
  img,
  index,
  fallbackImg,
  onClick,
}: {
  img: GalleryImage;
  index: number;
  fallbackImg: string;
  onClick: () => void;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const colDelay = (index % 4) * 75;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        if (entry.isIntersecting) {
          timerRef.current = setTimeout(() => setVisible(true), colDelay);
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -30px 0px" }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [index]);

  // Therapist availability status: controlled by admin / data
  const isAvailable = img.availability !== undefined ? img.availability === "available" : index % 4 !== 1;
  const specialistName =
    img.alt && !img.alt.includes("Serenity Spa -")
      ? img.alt
      : `Specialist #${index + 1}`;

  return (
    <div
      ref={ref}
      className="col-xl-3 col-lg-4 col-md-6 col-12"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px) scale(1)" : "translateY(40px) scale(0.96)",
        transition: visible
          ? "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)"
          : "opacity 0.25s ease, transform 0.25s ease",
        willChange: "opacity, transform",
      }}
    >
      <div
        className="gallery-card-inner"
        onClick={onClick}
        style={{
          height: "300px",
          borderRadius: "12px",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
          backgroundColor: "#161c22",
          border: "1px solid rgba(194, 167, 78, 0.22)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
          display: "flex",
          flexDirection: "column",
          transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.35s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.borderColor = "rgba(194, 167, 78, 0.65)";
          e.currentTarget.style.boxShadow = "0 18px 40px rgba(194, 167, 78, 0.2)";
          const imgEl = e.currentTarget.querySelector(".gallery-img") as HTMLElement;
          if (imgEl) imgEl.style.transform = "scale(1.08)";
          const overlay = e.currentTarget.querySelector(".gallery-overlay") as HTMLElement;
          if (overlay) overlay.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(194, 167, 78, 0.22)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.35)";
          const imgEl = e.currentTarget.querySelector(".gallery-img") as HTMLElement;
          if (imgEl) imgEl.style.transform = "scale(1)";
          const overlay = e.currentTarget.querySelector(".gallery-overlay") as HTMLElement;
          if (overlay) overlay.style.opacity = "0";
        }}
      >
        {/* Availability Badge in Top Right Corner */}
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 6,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 11px",
            borderRadius: "20px",
            backgroundColor: "rgba(10, 14, 18, 0.88)",
            backdropFilter: "blur(6px)",
            border: isAvailable
              ? "1px solid rgba(16, 185, 129, 0.55)"
              : "1px solid rgba(239, 68, 68, 0.45)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)",
          }}
        >
          <span
            className={isAvailable ? "status-dot-pulse-green" : "status-dot-pulse-red"}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: isAvailable ? "#10b981" : "#ef4444",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.6px",
              textTransform: "uppercase",
              color: isAvailable ? "#34d399" : "#f87171",
              lineHeight: 1,
            }}
          >
            {isAvailable ? "Available" : "In Session"}
          </span>
        </div>

        {/* Image Container */}
        <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
          <img
            src={img.src}
            alt={img.alt || "The Serenity Spa"}
            loading="lazy"
            className="gallery-img"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.6s cubic-bezier(0.16,1,0.3,1)",
              willChange: "transform",
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImg;
            }}
          />

          {/* Dark gradient to ensure button and text readability */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Hover Overlay with search icon */}
          <div
            className="gallery-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(14,19,23,0.3) 0%, rgba(14,19,23,0.75) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.3s ease",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                backgroundColor: "rgba(194, 167, 78, 0.95)",
                color: "#0e1317",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                transform: "translateY(-16px)",
              }}
            >
              <i className="fas fa-search-plus"></i>
            </div>
          </div>

          {/* Bottom Action: Book Therapist Button */}
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              right: "12px",
              zIndex: 6,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/booking?therapist=${encodeURIComponent(specialistName)}`;
              }}
              style={{
                width: "100%",
                padding: "9px 14px",
                backgroundColor: isAvailable ? "#c2a74e" : "rgba(24, 30, 36, 0.92)",
                color: isAvailable ? "#0e1317" : "#ffffff",
                border: isAvailable ? "1.5px solid #d4af37" : "1px solid rgba(194, 167, 78, 0.4)",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.8px",
                textTransform: "uppercase",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.6)",
                transition: "all 0.25s ease",
                backdropFilter: "blur(4px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#0e1317";
                e.currentTarget.style.borderColor = "#ffffff";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = isAvailable ? "#c2a74e" : "rgba(24, 30, 36, 0.92)";
                e.currentTarget.style.color = isAvailable ? "#0e1317" : "#ffffff";
                e.currentTarget.style.borderColor = isAvailable ? "#d4af37" : "rgba(194, 167, 78, 0.4)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <i className="fas fa-calendar-check" style={{ fontSize: "11px" }}></i>
              <span>Book Therapist</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(INITIAL_IMAGES);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<SpaVideo | null>(null);
  const [activeVideoFilter, setActiveVideoFilter] = useState<string>("all");

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch("/api/gallery");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setImages(data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Failed to load /api/gallery, trying local JSON...", err);
      }

      try {
        const localRes = await fetch("/gallery.json");
        if (localRes.ok) {
          const localData = await localRes.json();
          if (Array.isArray(localData)) {
            setImages(localData);
          }
        }
      } catch (localErr) {
        console.error("Failed to load local gallery.json", localErr);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  // Keyboard navigation for lightbox & video modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedIndex(null);
        setSelectedVideo(null);
      }
      if (selectedIndex !== null) {
        if (e.key === "ArrowLeft") {
          setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
        }
        if (e.key === "ArrowRight") {
          setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  const filteredVideos =
    activeVideoFilter === "all"
      ? SPA_VIDEOS
      : SPA_VIDEOS.filter((v) => v.category === activeVideoFilter);

  return (
    <>
      <CustomCursor />

      <style jsx global>{`
        @keyframes statusPulseGreen {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        @keyframes livePulseRed {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.85);
          }
        }
        @keyframes playGlowRipple {
          0% {
            box-shadow: 0 0 0 0 rgba(194, 167, 78, 0.7), 0 0 20px rgba(194, 167, 78, 0.4);
          }
          70% {
            box-shadow: 0 0 0 14px rgba(194, 167, 78, 0), 0 0 30px rgba(194, 167, 78, 0.2);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(194, 167, 78, 0), 0 0 20px rgba(194, 167, 78, 0);
          }
        }
        @keyframes escortCtaShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 300% center; }
        }
        .status-dot-pulse-green {
          animation: statusPulseGreen 2s infinite;
        }
        .live-dot-pulse {
          animation: livePulseRed 1.8s ease-in-out infinite;
        }
        .video-card-play-btn {
          animation: playGlowRipple 2.2s infinite;
        }
        .video-card-box {
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .video-card-box:hover {
          transform: translateY(-8px);
          border-color: rgba(194, 167, 78, 0.65) !important;
          box-shadow: 0 20px 45px rgba(0, 0, 0, 0.75), 0 0 25px rgba(194, 167, 78, 0.25) !important;
        }
        .video-card-box:hover .video-card-poster {
          transform: scale(1.06);
        }
        .video-card-poster {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      <div className="page-wrapper" style={{ backgroundColor: "#0e1317", color: "#c4cfde", minHeight: "100vh" }}>
        {/* --- NATIVE SOLOX LUXURY HEADER --- */}
        <header
          className="main-header main-header--two sticky-header sticky-header--normal"
          style={{ position: "relative", backgroundColor: "#0e1317", borderBottom: "1px solid rgba(194, 167, 78, 0.15)" }}
        >
          <div className="container-fluid">
            <div className="main-header__inner">
              <div className="main-header__logo">
                <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <img
                    src="/assets/logo.jpg"
                    alt="The Serenity Spa"
                    style={{
                      height: "52px",
                      width: "52px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(194, 167, 78, 0.6)",
                      display: "block",
                    }}
                  />
                </Link>
              </div>

              <nav className="main-header__nav main-menu">
                <ul className="main-menu__list">
                  <li className="">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="">
                    <Link href="/services">Services</Link>
                  </li>
                  <li className="">
                    <Link href="/vip-packages">VIP Packages</Link>
                  </li>
                  <li className="">
                    <Link href="/mobile-massage">Mobile Massage</Link>
                  </li>
                  <li className="current">
                    <Link href="/gallery">Gallery</Link>
                  </li>
                  <li className="">
                    <Link href="/blog">Blog</Link>
                  </li>
                  <li className="">
                    <Link href="/escorts">Escorts</Link>
                  </li>
                </ul>
              </nav>

              <div className="main-header__right">
                <div
                  className="mobile-nav__btn mobile-nav__toggler"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{ cursor: "pointer" }}
                >
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <Link href="/booking" className="solox-btn main-header__btn">
                  <span>Book now</span>
                </Link>
              </div>
            </div>
          </div>
          <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </header>

        {/* ─── LUXURY GALLERY HERO BANNER ─── */}
        <div
          style={{
            position: "relative",
            height: "340px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('https://res.cloudinary.com/njzctr4m/image/upload/v1784667206/serenity_gallery/u7wll8tto5yxjt4ptcbl.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              transform: heroVisible ? "scale(1)" : "scale(1.08)",
              transition: "transform 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
              filter: "brightness(0.28)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(194, 167, 78,0.12) 0%, rgba(14,19,23,0.88) 100%)",
            }}
          />
          <div
            style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              padding: "0 20px",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(28px)",
              transition: "opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}
          >
            <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.7rem", display: "block", marginBottom: "8px" }}>
              A Visual &amp; Sensory Journey
            </span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2.1rem, 4.8vw, 3.4rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0", lineHeight: 1.15 }}>
              Therapist Profiles &amp; Video Sanctuary
            </h1>
            <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "clamp(0.85rem, 2vw, 1.02rem)", maxWidth: "620px", margin: "0 auto 20px auto", lineHeight: 1.6 }}>
              Explore live specialist availability, watch video demonstrations of treatments in motion, and discover our private hydrotherapy suites.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <span style={{ margin: "0 8px", color: "#c2a74e" }}>/</span>
              <span style={{ color: "#c2a74e" }}>Gallery &amp; Videos</span>
            </nav>
          </div>
        </div>

        {/* ─── SECTION 1: SPECIALIST PROFILES & SANCTUARY GALLERY ─── */}
        <section style={{ padding: "70px 0 60px 0", borderBottom: "1px solid rgba(194, 167, 78, 0.15)" }}>
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "760px", margin: "0 auto 36px auto" }}>
              <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.7rem", display: "block", marginBottom: "6px" }}>
                Our Specialists &amp; Suites
              </span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0" }}>
                Therapist Profiles &amp; Sanctuary Gallery
              </h2>
              <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                Check live room and specialist availability in real-time. Click any profile to view full-resolution photographs, or book your preferred therapist directly.
              </p>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading gallery...</span>
                </div>
                <p style={{ marginTop: "16px", color: "#9ca3af" }}>Loading specialist photographs...</p>
              </div>
            ) : images.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#161c22", borderRadius: "12px", border: "1px dashed rgba(194, 167, 78,0.3)" }}>
                <i className="fas fa-images" style={{ fontSize: "3rem", color: "#c2a74e", marginBottom: "16px" }}></i>
                <h3 style={{ color: "#fff", fontFamily: "Cormorant, serif", fontSize: "1.8rem" }}>No profiles found</h3>
                <p style={{ color: "#9ca3af" }}>Check back soon as we update our luxury suite gallery.</p>
              </div>
            ) : (
              <div className="row g-4">
                {images.map((img, index) => {
                  const fallbackImg = `/assets/images/instagram/instagram-2-${(index % 5) + 1}.jpg`;
                  return (
                    <GalleryCard
                      key={img.id || index}
                      img={img}
                      index={index}
                      fallbackImg={fallbackImg}
                      onClick={() => setSelectedIndex(index)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ─── GET ESCORT SERVICE CTA ─── */}
        <section
          style={{
            padding: "60px 24px",
            backgroundColor: "#0e1317",
            borderTop: "1px solid rgba(194,167,78,0.1)",
            borderBottom: "1px solid rgba(194,167,78,0.1)",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: "680px", margin: "0 auto" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "18px",
              }}
            >
              <div style={{ height: "1px", width: "50px", background: "linear-gradient(90deg, transparent, #c2a74e)" }} />
              <span
                style={{
                  color: "#c2a74e",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  fontFamily: "'Cormorant', serif",
                }}
              >
                Exclusive Service
              </span>
              <div style={{ height: "1px", width: "50px", background: "linear-gradient(90deg, #c2a74e, transparent)" }} />
            </div>

            <h2
              style={{
                fontFamily: "'Cormorant', serif",
                fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)",
                fontWeight: 700,
                color: "#e8d9b0",
                margin: "0 0 10px 0",
                lineHeight: 1.2,
              }}
            >
              Private Companionship, Redefined
            </h2>
            <p
              style={{
                color: "rgba(196,207,222,0.65)",
                fontSize: "1rem",
                lineHeight: 1.75,
                marginBottom: "32px",
                fontFamily: "'Cormorant', serif",
                fontStyle: "italic",
              }}
            >
              Sophisticated, discreet, and unforgettable escort experiences curated for the discerning gentleman.
            </p>

            <Link
              href="/escorts"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "12px",
                padding: "16px 44px",
                background: "linear-gradient(90deg, #7a5c1e 0%, #c2a74e 25%, #f5e199 50%, #d4af37 75%, #c2a74e 100%)",
                backgroundSize: "300% auto",
                color: "#0e1317",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: "13px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                boxShadow: "0 8px 32px rgba(194,167,78,0.4), 0 2px 8px rgba(0,0,0,0.5)",
                fontFamily: "'Cormorant', serif",
                WebkitAnimation: "escortCtaShimmer 3s linear infinite",
                animation: "escortCtaShimmer 3s linear infinite",
                border: "1.5px solid rgba(212,175,55,0.6)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 14px 44px rgba(194,167,78,0.6), 0 2px 12px rgba(0,0,0,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(194,167,78,0.4), 0 2px 8px rgba(0,0,0,0.5)";
              }}
            >
              <i className="fas fa-crown" style={{ fontSize: "15px" }} />
              <span>Get Escort Service</span>
              <i className="fas fa-arrow-right" style={{ fontSize: "12px" }} />
            </Link>
          </div>
        </section>

        {/* ─── SECTION 2: THERAPIES IN MOTION (VIDEO DEMONSTRATIONS) ─── */}
        <section style={{ padding: "70px 0 90px 0", backgroundColor: "#0a0e12" }}>
          <div className="container">
            <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 36px auto" }}>
              <span style={{ color: "#c2a74e", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.7rem", display: "block", marginBottom: "6px", letterSpacing: "1px" }}>
                Therapies In Motion
              </span>
              <h2 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(2rem, 4vw, 3.1rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 14px 0", lineHeight: 1.2 }}>
                Watch Our Specialists At Work
              </h2>
              <p style={{ color: "rgba(255,255,255,0.78)", fontSize: "15px", lineHeight: 1.65, margin: 0 }}>
                Step inside our private suites through curated demonstration reels. Witness the rhythmic harmony, authentic Turkish Hammam marble exfoliation, and rejuvenating rituals performed by our certified specialists.
              </p>
            </div>

            {/* Video Category Filter Tabs */}
            <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
              {[
                { key: "all", label: "All Demonstrations (6)" },
                { key: "tantra", label: "VIP 4-Hands & Tantra" },
                { key: "hammam", label: "Turkish Hammam" },
                { key: "deep", label: "Deep Tissue & Relaxation" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveVideoFilter(tab.key)}
                  style={{
                    padding: "9px 20px",
                    borderRadius: "30px",
                    border: activeVideoFilter === tab.key ? "1.5px solid #c2a74e" : "1px solid rgba(255,255,255,0.12)",
                    backgroundColor: activeVideoFilter === tab.key ? "#c2a74e" : "rgba(20, 26, 32, 0.7)",
                    color: activeVideoFilter === tab.key ? "#0e1317" : "#d1d5db",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.6px",
                    cursor: "pointer",
                    transition: "all 0.25s ease",
                    boxShadow: activeVideoFilter === tab.key ? "0 4px 16px rgba(194, 167, 78, 0.35)" : "none",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Video Cards Grid */}
            <div className="row g-4">
              {filteredVideos.map((video) => (
                <div key={video.id} className="col-lg-4 col-md-6 col-12">
                  <div
                    className="video-card-box"
                    onClick={() => setSelectedVideo(video)}
                    style={{
                      backgroundColor: "#13181e",
                      borderRadius: "14px",
                      overflow: "hidden",
                      border: "1px solid rgba(194, 167, 78, 0.25)",
                      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* 16:9 Thumbnail Reel with Glowing Play Button */}
                    <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", overflow: "hidden", backgroundColor: "#080b0e" }}>
                      <img
                        src={video.poster}
                        alt={video.title}
                        className="video-card-poster"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 100%)",
                        }}
                      />

                      {/* Top Badges: Live Demo + Duration */}
                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          zIndex: 3,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "4px 10px",
                          borderRadius: "20px",
                          backgroundColor: "rgba(14, 19, 23, 0.85)",
                          backdropFilter: "blur(4px)",
                          border: "1px solid rgba(239, 68, 68, 0.5)",
                        }}
                      >
                        <span
                          className="live-dot-pulse"
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            backgroundColor: "#ef4444",
                            display: "inline-block",
                          }}
                        />
                        <span style={{ color: "#fca5a5", fontSize: "10px", fontWeight: 800, letterSpacing: "0.6px" }}>
                          DEMO REEL
                        </span>
                      </div>

                      <div
                        style={{
                          position: "absolute",
                          top: "12px",
                          right: "12px",
                          zIndex: 3,
                          padding: "4px 9px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(14, 19, 23, 0.85)",
                          backdropFilter: "blur(4px)",
                          color: "#c2a74e",
                          fontSize: "11px",
                          fontWeight: 700,
                          border: "1px solid rgba(194, 167, 78, 0.35)",
                        }}
                      >
                        {video.duration}
                      </div>

                      {/* Center Glowing Play Icon */}
                      <div
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: 4,
                        }}
                      >
                        <div
                          className="video-card-play-btn"
                          style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "50%",
                            backgroundColor: "#c2a74e",
                            color: "#0e1317",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "20px",
                            paddingLeft: "3px",
                            boxShadow: "0 8px 25px rgba(0, 0, 0, 0.6)",
                            transition: "transform 0.25s ease",
                          }}
                        >
                          <i className="fas fa-play"></i>
                        </div>
                      </div>

                      {/* Bottom Overlay Category Badge */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: "10px",
                          left: "14px",
                          zIndex: 3,
                        }}
                      >
                        <span
                          style={{
                            backgroundColor: "rgba(194, 167, 78, 0.2)",
                            color: "#fef08a",
                            border: "1px solid rgba(194, 167, 78, 0.5)",
                            padding: "3px 9px",
                            borderRadius: "4px",
                            fontSize: "10px",
                            fontWeight: 800,
                            letterSpacing: "0.6px",
                            textTransform: "uppercase",
                          }}
                        >
                          {video.categoryLabel}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: "20px 22px", display: "flex", flexDirection: "column", flex: 1 }}>
                      <h3
                        style={{
                          fontFamily: "Cormorant, serif",
                          fontSize: "1.35rem",
                          fontWeight: 700,
                          color: "#ffffff",
                          margin: "0 0 8px 0",
                          lineHeight: 1.25,
                        }}
                      >
                        {video.title}
                      </h3>

                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                        <i className="fas fa-user-check" style={{ color: "#c2a74e", fontSize: "12px" }}></i>
                        <span style={{ color: "#c2a74e", fontSize: "12.5px", fontWeight: 700 }}>
                          {video.specialist}
                        </span>
                        <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px" }}>•</span>
                        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "11.5px" }}>
                          {video.role}
                        </span>
                      </div>

                      <p
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "13px",
                          lineHeight: 1.6,
                          margin: "0 0 18px 0",
                          flex: 1,
                        }}
                      >
                        {video.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          paddingTop: "14px",
                          borderTop: "1px solid rgba(255,255,255,0.08)",
                        }}
                      >
                        <span style={{ color: "#c2a74e", fontSize: "12px", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                          <i className="fas fa-play-circle"></i> Watch Session
                        </span>

                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            window.location.href = `/booking?service=${encodeURIComponent(video.bookingService)}&therapist=${encodeURIComponent(video.specialist)}`;
                          }}
                          style={{
                            padding: "6px 14px",
                            backgroundColor: "transparent",
                            border: "1px solid rgba(194, 167, 78, 0.45)",
                            color: "#c2a74e",
                            borderRadius: "4px",
                            fontSize: "11px",
                            fontWeight: 700,
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#c2a74e";
                            e.currentTarget.style.color = "#0e1317";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                            e.currentTarget.style.color = "#c2a74e";
                          }}
                        >
                          Book Session
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- NATIVE SOLOX LUXURY FOOTER --- */}
        <footer className="main-footer-two" style={{ backgroundColor: "#0b0f13", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "70px 0 30px 0" }}>
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "18px" }}>
                  <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "46px", width: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(194, 167, 78,0.5)" }} />
                  <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.4rem", fontWeight: 700, color: "#ffffff" }}>
                    THE SERENITY SPA
                  </span>
                </Link>
                <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, maxWidth: "320px" }}>
                  Kampala’s premier executive sanctuary for holistic rejuvenation, luxury hydrotherapy, and authentic massage rituals.
                </p>
                <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: "#c2a74e", fontSize: "18px" }}><i className="fab fa-whatsapp"></i></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c2a74e", fontSize: "18px" }}><i className="fab fa-instagram"></i></a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c2a74e", fontSize: "18px" }}><i className="fab fa-facebook"></i></a>
                </div>
              </div>

              <div className="col-lg-2 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Navigation</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <li><Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link></li>
                  <li><Link href="/services" style={{ color: "#9ca3af", textDecoration: "none" }}>Services</Link></li>
                  <li><Link href="/vip-packages" style={{ color: "#9ca3af", textDecoration: "none" }}>VIP Packages</Link></li>
                  <li><Link href="/mobile-massage" style={{ color: "#9ca3af", textDecoration: "none" }}>Mobile Massage</Link></li>
                  <li><Link href="/gallery" style={{ color: "#c2a74e", textDecoration: "none" }}>Gallery &amp; Videos</Link></li>
                  <li><Link href="/blog" style={{ color: "#9ca3af", textDecoration: "none" }}>Blog</Link></li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Contacts</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Sir Apollo Kaggwa Rd &amp; Mengo, Kampala<br />
                  Phone: <a href="tel:+256781945510" style={{ color: "#c2a74e", textDecoration: "none" }}>+256 781 945 510</a><br />
                  Email: <a href="mailto:theserenityspakla@gmail.com" style={{ color: "#c2a74e", textDecoration: "none" }}>theserenityspakla@gmail.com</a>
                </p>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Hours</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Open Daily (Mon - Sun):<br />
                  <strong style={{ color: "#fff" }}>9:00 AM – 11:00 PM</strong><br />
                  Private suite appointments accommodated on request.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "50px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
              © {new Date().getFullYear()} The Serenity Spa Kampala. All rights reserved.
            </div>
          </div>
        </footer>

        {/* ─── CINEMA VIDEO MODAL ─── */}
        {selectedVideo && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99999,
              backgroundColor: "rgba(5, 7, 10, 0.95)",
              backdropFilter: "blur(10px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
            onClick={() => setSelectedVideo(null)}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "960px",
                backgroundColor: "#12161c",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(194, 167, 78, 0.4)",
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(194, 167, 78, 0.2)",
                position: "relative",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedVideo(null)}
                style={{
                  position: "absolute",
                  top: "14px",
                  right: "16px",
                  background: "rgba(0,0,0,0.6)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  color: "#ffffff",
                  fontSize: "18px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#c2a74e";
                  e.currentTarget.style.color = "#0e1317";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.6)";
                  e.currentTarget.style.color = "#ffffff";
                }}
              >
                ✕
              </button>

              {/* 16:9 Widescreen Responsive Video Player */}
              <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", backgroundColor: "#000" }}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo.title}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                  }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Info & Booking Bar */}
              <div style={{ padding: "24px 28px", backgroundColor: "#12161c" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span
                        style={{
                          backgroundColor: "rgba(194, 167, 78, 0.15)",
                          color: "#fef08a",
                          border: "1px solid rgba(194, 167, 78, 0.4)",
                          padding: "3px 10px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 800,
                          textTransform: "uppercase",
                        }}
                      >
                        {selectedVideo.categoryLabel}
                      </span>
                      <span style={{ color: "#c2a74e", fontSize: "13px", fontWeight: 700 }}>
                        {selectedVideo.specialist}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
                        {selectedVideo.role}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "Cormorant, serif", fontSize: "1.6rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                      {selectedVideo.title}
                    </h3>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Serenity Spa, I just watched the video demonstration of " + selectedVideo.title + " with " + selectedVideo.specialist + ". I would like to inquire about booking this session.")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "10px 18px",
                        backgroundColor: "rgba(37, 211, 102, 0.15)",
                        border: "1px solid rgba(37, 211, 102, 0.5)",
                        color: "#25d366",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 700,
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "7px",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <i className="fab fa-whatsapp"></i> WhatsApp Inquiry
                    </a>

                    <Link
                      href={`/booking?service=${encodeURIComponent(selectedVideo.bookingService)}&therapist=${encodeURIComponent(selectedVideo.specialist)}`}
                      style={{
                        padding: "10px 22px",
                        backgroundColor: "#c2a74e",
                        border: "1px solid #ffd700",
                        color: "#0e1317",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 800,
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 15px rgba(194, 167, 78, 0.35)",
                        transition: "all 0.2s ease",
                      }}
                    >
                      <i className="fas fa-calendar-check"></i> Book Treatment
                    </Link>
                  </div>
                </div>

                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "13.5px", lineHeight: 1.6, margin: 0 }}>
                  {selectedVideo.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* --- FULLSCREEN PHOTO LIGHTBOX POPUP --- */}
        {selectedIndex !== null && images[selectedIndex] && (() => {
          const isLightboxAvailable = selectedIndex % 4 !== 1;
          const specialistName =
            images[selectedIndex].alt && !images[selectedIndex].alt.includes("Serenity Spa -")
              ? images[selectedIndex].alt
              : `Specialist #${selectedIndex + 1}`;

          return (
            <div
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                backgroundColor: "rgba(0,0,0,0.96)",
                backdropFilter: "blur(8px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
              }}
              onClick={() => setSelectedIndex(null)}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedIndex(null)}
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "24px",
                  background: "none",
                  border: "none",
                  color: "#c4cfde",
                  fontSize: "2.2rem",
                  cursor: "pointer",
                  lineHeight: 1,
                  zIndex: 10,
                }}
              >
                ×
              </button>

              {/* Prev Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
                }}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(22,28,34,0.8)",
                  border: "1px solid rgba(194, 167, 78,0.4)",
                  color: "#c2a74e",
                  fontSize: "1.6rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "all 0.2s ease",
                }}
              >
                ‹
              </button>

              {/* Image */}
              <div
                style={{
                  maxWidth: "85vw",
                  maxHeight: "72vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[selectedIndex].src}
                  alt={images[selectedIndex].alt || "The Serenity Spa"}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "72vh",
                    objectFit: "contain",
                    borderRadius: "8px",
                    border: "1px solid rgba(194, 167, 78,0.3)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                  }}
                />
              </div>

              {/* Next Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedIndex((selectedIndex + 1) % images.length);
                }}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(22,28,34,0.8)",
                  border: "1px solid rgba(194, 167, 78,0.4)",
                  color: "#c2a74e",
                  fontSize: "1.6rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 10,
                  transition: "all 0.2s ease",
                }}
              >
                ›
              </button>

              {/* Counter, Availability & Book Action */}
              <div
                style={{
                  marginTop: "16px",
                  textAlign: "center",
                  color: "#9ca3af",
                  fontSize: "14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "10px",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* Availability Badge */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      padding: "3px 10px",
                      borderRadius: "16px",
                      backgroundColor: "rgba(14, 19, 23, 0.85)",
                      border: isLightboxAvailable
                        ? "1px solid rgba(16, 185, 129, 0.5)"
                        : "1px solid rgba(239, 68, 68, 0.45)",
                      color: isLightboxAvailable ? "#34d399" : "#f87171",
                      fontSize: "11px",
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        backgroundColor: isLightboxAvailable ? "#10b981" : "#ef4444",
                      }}
                    />
                    {isLightboxAvailable ? "Available Now" : "In Session"}
                  </span>

                  <span style={{ color: "#ffffff", fontWeight: 600 }}>{specialistName}</span>
                  <span style={{ color: "#c2a74e" }}>•</span>
                  <span style={{ color: "#c2a74e", fontWeight: 700 }}>
                    {selectedIndex + 1} / {images.length}
                  </span>
                </div>

                <button
                  onClick={() => {
                    window.location.href = `/booking?therapist=${encodeURIComponent(specialistName)}`;
                  }}
                  style={{
                    padding: "8px 22px",
                    backgroundColor: "#c2a74e",
                    border: "1px solid #ffd700",
                    color: "#0e1317",
                    borderRadius: "4px",
                    fontSize: "11.5px",
                    fontWeight: 800,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    boxShadow: "0 4px 14px rgba(194, 167, 78, 0.4)",
                  }}
                >
                  <i className="fas fa-calendar-check"></i>
                  <span>Book This Therapist</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      <style>{`
        * { -webkit-font-smoothing: antialiased; }
        .gallery-card-inner {
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.3s ease, box-shadow 0.35s ease;
        }
        html { scroll-behavior: smooth; }
        img { transition: opacity 0.4s ease; }
      `}</style>
    </>
  );
}
