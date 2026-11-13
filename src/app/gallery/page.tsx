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


// ── Scroll-reveal gallery card (re-triggers on every scroll pass) ───────────
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
    // Column-based stagger for natural masonry cascade
    const colDelay = (index % 4) * 85;
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
    return () => { obs.disconnect(); if (timerRef.current) clearTimeout(timerRef.current); };
  }, [index]);

  return (
    <div
      ref={ref}
      className="col-xl-3 col-lg-4 col-md-6 col-12"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px) scale(1)" : "translateY(44px) scale(0.95)",
        transition: visible
          ? `opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)`
          : `opacity 0.25s ease, transform 0.25s ease`,
        willChange: "opacity, transform",
      }}
    >
      <div
        className="gallery-card-inner"
        onClick={onClick}
        style={{
          height: "250px",
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
          backgroundColor: "#161c22",
          border: "1px solid rgba(197,168,128,0.2)",
          boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-8px)";
          e.currentTarget.style.borderColor = "rgba(197,168,128,0.55)";
          e.currentTarget.style.boxShadow = "0 16px 36px rgba(197,168,128,0.18)";
          const imgEl = e.currentTarget.querySelector(".gallery-img") as HTMLElement;
          if (imgEl) imgEl.style.transform = "scale(1.1)";
          const overlay = e.currentTarget.querySelector(".gallery-overlay") as HTMLElement;
          if (overlay) overlay.style.opacity = "1";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.borderColor = "rgba(197,168,128,0.2)";
          e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.35)";
          const imgEl = e.currentTarget.querySelector(".gallery-img") as HTMLElement;
          if (imgEl) imgEl.style.transform = "scale(1)";
          const overlay = e.currentTarget.querySelector(".gallery-overlay") as HTMLElement;
          if (overlay) overlay.style.opacity = "0";
        }}
      >
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
          onError={(e) => { (e.target as HTMLImageElement).src = fallbackImg; }}
        />
        {/* Hover Overlay with gold shimmer */}
        <div
          className="gallery-overlay"
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(197,168,128,0.12), rgba(14,19,23,0.6))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0,
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              backgroundColor: "#c5a880",
              color: "#0e1317",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
            }}
          >
            <i className="fas fa-search-plus"></i>
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

  // Hero entrance animation (subtle delay to feel intentional)
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null));
      }
      if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev !== null ? (prev + 1) % images.length : null));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, images.length]);

  return (
    <>
      <CustomCursor />

      <div className="page-wrapper" style={{ backgroundColor: "#0e1317", color: "#c4cfde", minHeight: "100vh" }}>
        {/* --- NATIVE SOLOX LUXURY HEADER --- */}
        <header className="main-header main-header--two sticky-header sticky-header--normal" style={{ position: "relative", backgroundColor: "#0e1317", borderBottom: "1px solid rgba(197,168,128,0.15)" }}>
          <div className="container" style={{ padding: "0 15px" }}>
            <div className="main-header__inner" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", minHeight: "82px" }}>
              <div className="main-header__logo">
                <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                  <img
                    src="/assets/logo.jpg"
                    alt="The Serenity Spa"
                    style={{
                      height: "50px",
                      width: "50px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid rgba(197,168,128,0.5)",
                      display: "block",
                    }}
                  />
                </Link>
              </div>

              <nav className="main-header__nav main-menu d-none d-xl-block">
                <ul className="main-menu__list d-none d-xl-flex" style={{ listStyle: "none", gap: "24px", margin: 0, padding: 0 }}>
                  <li><Link href="/" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Home</Link></li>
                  <li><Link href="/services" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Services &amp; Packages</Link></li>
                  <li className="current"><Link href="/gallery" style={{ color: "#c5a880", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Gallery</Link></li>
                  <li><Link href="/booking" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Book Appointment</Link></li>
                  <li><Link href="/blog" style={{ color: "#ffffff", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>Blog</Link></li>
                </ul>
              </nav>

              <div className="main-header__right" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="serenity-gold-btn"
                  style={{
                    backgroundColor: "#c5a880",
                    color: "#0e1317",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none"
                  }}
                >
                  <i className="fab fa-whatsapp" style={{ fontSize: "15px" }}></i>
                  <span className="d-none d-sm-inline">WhatsApp</span>
                </a>

                <div
                  className="mobile-nav__btn mobile-nav__toggler d-xl-none"
                  onClick={() => setMobileMenuOpen(true)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "5px",
                    padding: "8px 10px",
                    background: "rgba(197, 168, 128, 0.1)",
                    border: "1px solid rgba(197, 168, 128, 0.35)",
                    borderRadius: "6px"
                  }}
                  aria-label="Toggle navigation menu"
                >
                  <span style={{ width: "22px", height: "2px", backgroundColor: "#c5a880", display: "block" }}></span>
                  <span style={{ width: "22px", height: "2px", backgroundColor: "#c5a880", display: "block" }}></span>
                  <span style={{ width: "22px", height: "2px", backgroundColor: "#c5a880", display: "block" }}></span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Drawer Navigation */}
          <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </header>

        

        {/* ─── LUXURY GALLERY HERO BANNER ─── */}
        <div
          style={{
            position: "relative",
            height: "300px",
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
              filter: "brightness(0.3)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(197,168,128,0.08) 0%, rgba(14,19,23,0.8) 100%)",
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
            <span style={{ color: "#c5a880", fontFamily: "'Great Vibes', cursive, Cormorant, serif", fontSize: "1.5rem", display: "block", marginBottom: "10px" }}>
              A Visual Journey
            </span>
            <h1 style={{ fontFamily: "Cormorant, serif", fontSize: "clamp(1.9rem, 4.5vw, 2.9rem)", fontWeight: 700, color: "#ffffff", margin: "0 0 12px 0", lineHeight: 1.15 }}>
              Our Sanctuary Gallery
            </h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "clamp(0.85rem, 2vw, 0.95rem)", maxWidth: "520px", margin: "0 auto 16px auto", lineHeight: 1.6 }}>
              Glimpses of luxury, serenity, and the art of healing touch at The Serenity Spa Kampala.
            </p>
            <nav style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "1.5px", textTransform: "uppercase" }}>
              <a href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</a>
              <span style={{ margin: "0 8px", color: "#c5a880" }}>/</span>
              <span style={{ color: "#c5a880" }}>Gallery</span>
            </nav>
          </div>
        </div>

        {/* --- BALANCED GALLERY GRID (4-COLUMN RESPONSIVE LAYOUT) --- */}
        <section style={{ padding: "60px 0 90px 0" }}>
          <div className="container">
            {loading ? (
              <div style={{ textAlign: "center", padding: "80px 0" }}>
                <div className="spinner-border text-warning" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Loading gallery...</span>
                </div>
                <p style={{ marginTop: "16px", color: "#9ca3af" }}>Loading sanctuary photographs...</p>
              </div>
            ) : images.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", backgroundColor: "#161c22", borderRadius: "12px", border: "1px dashed rgba(197,168,128,0.3)" }}>
                <i className="fas fa-images" style={{ fontSize: "3rem", color: "#c5a880", marginBottom: "16px" }}></i>
                <h3 style={{ color: "#fff", fontFamily: "Cormorant, serif", fontSize: "1.8rem" }}>No images found</h3>
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

        {/* --- NATIVE SOLOX LUXURY FOOTER --- */}
        <footer className="main-footer-two" style={{ backgroundColor: "#0b0f13", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "70px 0 30px 0" }}>
          <div className="container">
            <div className="row g-4">
              <div className="col-lg-4 col-md-6">
                <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginBottom: "18px" }}>
                  <img src="/assets/logo.jpg" alt="The Serenity Spa" style={{ height: "46px", width: "46px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(197,168,128,0.5)" }} />
                  <span style={{ fontFamily: "Cormorant, serif", fontSize: "1.4rem", fontWeight: 700, color: "#ffffff" }}>
                    THE SERENITY SPA
                  </span>
                </Link>
                <p style={{ color: "#9ca3af", fontSize: "14px", lineHeight: 1.6, maxWidth: "320px" }}>
                  Kampala’s sanctuary for holistic rejuvenation, luxury hydrotherapy, and authentic massage rituals.
                </p>
                <div style={{ display: "flex", gap: "14px", marginTop: "16px" }}>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" style={{ color: "#c5a880", fontSize: "18px" }}><i className="fab fa-whatsapp"></i></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c5a880", fontSize: "18px" }}><i className="fab fa-instagram"></i></a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: "#c5a880", fontSize: "18px" }}><i className="fab fa-facebook"></i></a>
                </div>
              </div>

              <div className="col-lg-2 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Navigation</h4>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                  <li><Link href="/" style={{ color: "#9ca3af", textDecoration: "none" }}>Home</Link></li>
                  <li><Link href="/services" style={{ color: "#9ca3af", textDecoration: "none" }}>Services &amp; Packages</Link></li>
                  <li><Link href="/gallery" style={{ color: "#c5a880", textDecoration: "none" }}>Gallery</Link></li>
                  <li><Link href="/blog" style={{ color: "#9ca3af", textDecoration: "none" }}>Blog</Link></li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Contacts</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Sir Apollo Kaggwa Rd &amp; Mengo, Kampala<br />
                  Phone: <a href="tel:+256781945510" style={{ color: "#c5a880", textDecoration: "none" }}>+256 781 945 510</a><br />
                  Email: <a href="mailto:theserenityspakla@gmail.com" style={{ color: "#c5a880", textDecoration: "none" }}>theserenityspakla@gmail.com</a>
                </p>
              </div>

              <div className="col-lg-3 col-md-6">
                <h4 style={{ color: "#ffffff", fontFamily: "Cormorant, serif", fontSize: "1.2rem", marginBottom: "16px" }}>Hours</h4>
                <p style={{ color: "#9ca3af", fontSize: "13px", lineHeight: 1.7, margin: 0 }}>
                  Open Daily (Mon - Sun):<br />
                  <strong style={{ color: "#fff" }}>9:00 AM – 11:00 PM</strong><br />
                  Private appointments accommodated on request.
                </p>
              </div>
            </div>

            <div style={{ marginTop: "50px", paddingTop: "20px", borderTop: "1px solid rgba(255,255,255,0.06)", textAlign: "center", color: "#6b7280", fontSize: "12px" }}>
              © {new Date().getFullYear()} The Serenity Spa Kampala. All rights reserved.
            </div>
          </div>
        </footer>

        {/* --- FULLSCREEN LIGHTBOX POPUP --- */}
        {selectedIndex !== null && images[selectedIndex] && (
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
                border: "1px solid rgba(197,168,128,0.4)",
                color: "#c5a880",
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
                maxHeight: "80vh",
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
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: "8px",
                  border: "1px solid rgba(197,168,128,0.3)",
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
                border: "1px solid rgba(197,168,128,0.4)",
                color: "#c5a880",
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

            {/* Counter & Caption */}
            <div style={{ marginTop: "16px", textAlign: "center", color: "#9ca3af", fontSize: "14px" }}>
              <span>{images[selectedIndex].alt || "The Serenity Spa Sanctuary"}</span>
              <span style={{ margin: "0 10px", color: "#c5a880" }}>•</span>
              <span style={{ color: "#c5a880", fontWeight: 700 }}>
                {selectedIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        )}
      </div>
    
      {/* ── LUXURY GALLERY STYLES ── */}
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
