"use client";

import React, { useEffect, useRef, useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";

const esc = (value: any) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const { phoneHref, phoneDisplay, locationDisplay } = useSiteContact();

  // The legacy Solox drawer is hidden globally, so bind the hamburger to the React
  // drawer via a delegated listener on a stable wrapper (the HTML is re-injected
  // whenever posts load, which would drop handlers bound directly to its nodes).
  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest(".mobile-nav__btn.mobile-nav__toggler")) {
        e.preventDefault();
        setMobileMenuOpen(true);
      } else if (t.closest(".mobile-nav__close")) {
        setMobileMenuOpen(false);
      }
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  // The legacy Solox script adds `body.locked` when the hamburger is tapped; make sure
  // that class never survives closing the React drawer.
  useEffect(() => {
    if (!mobileMenuOpen) document.body.classList.remove("locked");
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).soloxInitLoad) {
      (window as any).soloxInitLoad();
    }
    let hasCached = false;
    try {
      const cached = sessionStorage.getItem("serenity_blog_v1");
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setPosts(parsed);
          setLoading(false);
          hasCached = true;
        }
      }
    } catch {}

    fetch("/api/blog")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setPosts(data);
          try {
            sessionStorage.setItem("serenity_blog_v1", JSON.stringify(data));
          } catch {}
        } else if (!hasCached) {
          setPosts([]);
        }
      })
      .catch(() => {
        if (!hasCached) setPosts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const root = pageRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>(".serenity-blog__card"));
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add("page-motion-in");
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const alreadyVisible = rect.top < window.innerHeight - 40 && rect.bottom > 0;
      card.style.setProperty("--page-motion-duration", "750ms");
      card.style.setProperty("--page-motion-offset", "28px");
      card.style.setProperty("--page-motion-delay", `${(index % 3) * 0.08}s`);
      if (alreadyVisible) {
        card.classList.add("page-motion-in");
      } else {
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [loading, posts.length]);

  const blogSection = (() => {
    const wrap = (inner: string) => `
        <style>
          .serenity-blog * { box-sizing: border-box; }
          .serenity-blog__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
          .serenity-blog__card { background: #161b22; border: 1px solid #2c333c; border-radius: 12px;
            overflow: hidden; display: flex; flex-direction: column;
            transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease; }
          .serenity-blog__card:hover { transform: translateY(-5px); border-color: rgba(194,167,78,.55);
            box-shadow: 0 18px 40px rgba(0,0,0,.45); }
          .serenity-blog__media { position: relative; height: 250px; background: #0b0f14;
            display: flex; align-items: center; justify-content: center; overflow: hidden; }
          .serenity-blog__media img { max-width: 100%; max-height: 100%; width: auto; height: auto;
            object-fit: contain; display: block; }
          .serenity-blog__date { position: absolute; top: 14px; left: 14px; background: #c2a74e;
            color: #0e1317; border-radius: 6px; padding: 6px 12px; text-align: center; line-height: 1.1;
            box-shadow: 0 4px 14px rgba(0,0,0,.4); }
          .serenity-blog__date b { display: block; font-size: 20px; font-weight: 700; }
          .serenity-blog__date span { display: block; font-size: 10px; text-transform: uppercase;
            letter-spacing: 1px; font-weight: 700; }
          .serenity-blog__body { padding: 24px; display: flex; flex-direction: column; flex: 1; }
          .serenity-blog__meta { color: #8b949e; font-size: 11px; letter-spacing: .5px; margin-bottom: 12px; }
          .serenity-blog__title { font-family: 'Cormorant', Georgia, serif; font-size: 30px;
            line-height: 1.2; color: #fff; margin: 0 0 12px; }
          .serenity-blog__title a { color: #fff; text-decoration: none; transition: color .2s ease; }
          .serenity-blog__card:hover .serenity-blog__title a { color: #c2a74e; }
          .serenity-blog__excerpt { color: #aab3bd; font-size: 14px; line-height: 1.75; margin: 0 0 22px; flex: 1; }
          .serenity-blog__more { display: inline-flex; align-items: center; gap: 8px; color: #c2a74e;
            font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
            text-decoration: none; transition: gap .2s ease; align-self: flex-start; }
          .serenity-blog__more:hover { gap: 14px; }
          @media (max-width: 640px) {
            .serenity-blog__grid { grid-template-columns: 1fr; }
            .serenity-blog__media { height: 210px; }
          }
        </style>
        <section class="blog-one blog-one--page serenity-blog" style="padding:100px 0; background-color:#0e1317;">
            <div class="container">
                ${inner}
            </div>
        </section><!-- /.blog-one blog-one--page -->`;

    if (loading) {
      return wrap(`
                <div style="text-align:center; padding:70px 0; color:#8b949e; font-size:14px;">
                    Loading stories…
                </div>`);
    }

    if (posts.length === 0) {
      return wrap(`
                <div style="max-width:560px; margin:0 auto; text-align:center; padding:40px 20px 60px;">
                    <div style="width:96px; height:96px; margin:0 auto 22px; border-radius:50%;
                                display:flex; align-items:center; justify-content:center;
                                background:rgba(194,167,78,0.10); border:1px solid rgba(194,167,78,0.3); font-size:44px;">
                        📝
                    </div>
                    <h3 style="font-family:'Cormorant',Georgia,serif; font-size:34px; color:#fff; margin:0 0 12px;">
                        There aren&apos;t any blog posts at the moment
                    </h3>
                    <p style="color:#aab3bd; font-size:15px; line-height:1.75; margin:0 auto 26px;">
                        Our team is busy looking after guests. Check back soon for wellness tips,
                        treatment guides and stories from The Serenity Spa.
                    </p>
                    <a href="/services" style="display:inline-block; background:#c2a74e; color:#0e1317;
                                padding:13px 24px; border-radius:6px; font-size:13px; font-weight:700;
                                text-decoration:none; letter-spacing:0.5px;">
                        Browse our treatments
                    </a>
                </div>`);
    }

    const dateParts = (value: any) => {
      const s = String(value || "").trim();
      const m = s.match(/(\d{1,2})\s+([A-Za-z]+)/);
      if (m) return { day: m[1], month: m[2].slice(0, 3).toUpperCase() };
      const dt = new Date(s);
      if (!Number.isNaN(dt.getTime())) {
        return { day: String(dt.getDate()), month: dt.toLocaleString("en", { month: "short" }).toUpperCase() };
      }
      return { day: "✦", month: "NEW" };
    };

    const cards = posts
      .map((post: any) => {
        const d = dateParts(post.date);
        const href = `/blog/${encodeURIComponent(String(post.id || ""))}`;
        const image = post.image
          ? `<div class="serenity-blog__media">
                       <img src="${esc(post.image)}" alt="${esc(post.title)}" />
                       <div class="serenity-blog__date"><b>${esc(d.day)}</b><span>${esc(d.month)}</span></div>
                     </div>`
          : "";
        const excerpt = String(post.excerpt || "").trim() || String(post.content || "").trim().slice(0, 180);
        const words = String(post.content || "").trim().split(/\s+/).filter(Boolean).length;
        const read = Math.max(1, Math.ceil(words / 200));
        return `
                <article class="serenity-blog__card">
                    ${image}
                    <div class="serenity-blog__body">
                        <div class="serenity-blog__meta">✒ ${esc(post.author || "The Serenity Spa")} &nbsp;•&nbsp; ${read} min read</div>
                        <h3 class="serenity-blog__title"><a href="${href}">${esc(post.title)}</a></h3>
                        <p class="serenity-blog__excerpt">${esc(excerpt)}</p>
                        <a class="serenity-blog__more" href="${href}">Read more <span aria-hidden="true">→</span></a>
                    </div>
                </article>`;
      })
      .join("");

    return wrap(`
                <div class="serenity-blog__grid">
                    ${cards}
                </div>`);
  })();

  return (
    <>
      <CustomCursor />
      <div
        ref={pageRef}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `<div class="page-wrapper">

        <header class="main-header main-header--two sticky-header sticky-header--normal">
            <div class="container-fluid">
                <div class="main-header__inner">
                    <div class="main-header__logo">
                        <a href="/" style="display: flex; align-items: center; text-decoration: none;">
                            <img src="/assets/logo.jpg" alt="The Serenity Spa" style="height: 52px; width: 52px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(194, 167, 78,0.6); display: block;">
                        </a>
                    </div><!-- /.main-header__logo -->

                    <nav class="main-header__nav main-menu">
                        <ul class="main-menu__list">
                            <li><a href="/">Home</a></li>
                            <li><a href="/services">Services</a></li>
                            <li><a href="/vip-packages">VIP Packages</a></li>
                            <li><a href="/mobile-massage">Mobile Massage</a></li>
                            <li><a href="/gallery">Gallery</a></li>
                            <li class="current"><a href="/blog">Blog</a></li>
                            <li><a href="/escorts">Escorts</a></li>
                        </ul>
                    </nav><!-- /.main-header__nav -->
                    <div class="main-header__right">
                        <div class="mobile-nav__btn mobile-nav__toggler">
                            <span></span><span></span><span></span>
                        </div><!-- /.mobile-nav__toggler -->
                        <a href="/booking" class="solox-btn main-header__btn">
                            <span>Book now</span>
                        </a><!-- /.thm-btn main-header__btn -->
                    </div><!-- /.main-header__right -->
                </div><!-- /.main-header__inner -->
            </div><!-- /.container-fluid -->
        </header><!-- /.main-header -->
        <section class="page-header">
            <div class="page-header__bg" style="background-image: url(/assets/images/backgrounds/blog-header-bg.jpg);"></div>
            <div class="container">
                <img src="/assets/images/shapes/page-header-s-1.png" alt="our news" class="page-header__shape">
                <ul class="solox-breadcrumb list-unstyled">
                    <li><a href="/">Home</a></li>
                    <li><span>Journal</span></li>
                </ul>
                <h2 class="page-header__title">our journal</h2>
            </div><!-- /.container -->
        </section><!-- /.page-header -->

        ${blogSection}

        <footer class="main-footer background-black">
            <div class="main-footer__bg background-black" style="background-image: url(assets/images/shapes/footer-bg-1-1.png);"></div>
            <div class="main-footer__top">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 col-xl-4">
                            <div class="footer-widget footer-widget--about">
                                <a href="/" class="footer-widget__logo">
                                    <img src="/assets/images/logo-light.png" width="155" alt="The Serenity Spa">
                                </a>
                                <a href="mailto:theserenitybookings@gmail.com?subject=Spa%20updates" class="footer-widget__newsletter-link">Get spa updates by email →</a>
                            </div>
                        </div>
                        <div class="col-md-6 col-xl-2">
                            <div class="footer-widget footer-widget--links">
                                <h2 class="footer-widget__title">Links</h2>
                                <ul class="list-unstyled footer-widget__links">
                                    <li><a href="/">About</a></li>
                                    <li><a href="/services">Treatments</a></li>
                                    <li><a href="/vip-packages">VIP Packages</a></li>
                                    <li><a href="/gallery">Gallery</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6 col-xl-3">
                            <div class="footer-widget footer-widget--contact">
                                <h2 class="footer-widget__title">Contact</h2>
                                <ul class="list-unstyled footer-widget__info">
                                    <li><a href="${esc(phoneHref)}">${esc(phoneDisplay || "Call us")}</a></li>
                                    <li><a href="mailto:theserenitybookings@gmail.com">theserenitybookings@gmail.com</a></li>
                                    <li><a href="https://www.google.com/maps">${esc(locationDisplay)}</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6 col-xl-3">
                            <div class="footer-widget footer-widget--time">
                                <h2 class="footer-widget__title">Timing</h2>
                                <p class="footer-widget__text">Open 24 Hours, 7 Days a Week</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="main-footer__bottom">
                <div class="container">
                    <div class="main-footer__bottom__inner">
                        <p class="main-footer__copyright">&copy; Copyright <span class="dynamic-year"></span> by The Serenity Spa.</p>
                    </div>
                </div>
            </div>
        </footer>

    </div><!-- /.page-wrapper -->

    `,
        }}
      />
      <MobileDrawer isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}
