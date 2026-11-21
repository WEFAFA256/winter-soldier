"use client";

import React, { useEffect, useState } from "react";
import CustomCursor from "@/components/CustomCursor";

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

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).soloxInitLoad) {
      (window as any).soloxInitLoad();
    }
    fetch("/api/blog", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const blogSection = (() => {
    const wrap = (inner: string) => `
        <section class="blog-one blog-one--page" style="padding:100px 0; background-color:#0e1317;">
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

    const cards = posts
      .map((post: any) => {
        const image = post.image
          ? `<div style="height:220px; overflow:hidden; border-radius:8px 8px 0 0; background:#161b22;">
                       <img src="${esc(post.image)}" alt="${esc(post.title)}"
                            style="width:100%; height:100%; object-fit:cover;" />
                     </div>`
          : "";
        const body = String(post.excerpt || post.content || "").trim();
        return `
                <article style="background:#161b22; border:1px solid #30363d; border-radius:10px;
                                overflow:hidden; display:flex; flex-direction:column;">
                    ${image}
                    <div style="padding:24px;">
                        <div style="color:#c2a74e; font-size:11px; font-weight:700; letter-spacing:1.5px;
                                    text-transform:uppercase; margin-bottom:10px;">
                            ${esc(post.author || "The Serenity Spa")}${post.date ? ` &nbsp;•&nbsp; ${esc(post.date)}` : ""}
                        </div>
                        <h3 style="font-family:'Cormorant',Georgia,serif; font-size:28px; line-height:1.2;
                                    color:#fff; margin:0 0 12px;">${esc(post.title)}</h3>
                        <p style="color:#aab3bd; font-size:14px; line-height:1.75; margin:0; white-space:pre-wrap;">${esc(body)}</p>
                    </div>
                </article>`;
      })
      .join("");

    return wrap(`
                <div class="row gutter-y-30" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:30px;">
                    ${cards}
                </div>`);
  })();

  return (
    <>
      <CustomCursor />
      <div
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
                        <a href="#" class="search-toggler main-header__search">
                            <i class="icon-magnifying-glass" aria-hidden="true"></i>
                            <span class="sr-only">Search</span>
                        </a><!-- /.search-toggler -->
                        <a href="/services" class="solox-btn main-header__btn">
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
                                <form action="#" data-url="MAILCHIMP_FORM_URL" class="footer-widget__newsletter mc-form">
                                    <input type="text" name="EMAIL" placeholder="Email address">
                                    <button type="submit" class="fas fa-paper-plane"><span class="sr-only">submit</span></button>
                                </form>
                                <div class="mc-form__response"></div>
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
                                    <li><a href="tel:+256781945510">+256 781 945 510</a></li>
                                    <li><a href="mailto:theserenityspakla@gmail.com">theserenityspakla@gmail.com</a></li>
                                    <li><a href="https://www.google.com/maps">Sir Apollo Kaggwa Rd &amp; Mengo, Kampala</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-md-6 col-xl-3">
                            <div class="footer-widget footer-widget--time">
                                <h2 class="footer-widget__title">Timing</h2>
                                <p class="footer-widget__text">Mon to Sat: 9:00am – 6:00pm Sunday: Closed</p>
                                <div class="footer-widget__social">
                                    <a href="https://twitter.com"><i class="fab fa-twitter" aria-hidden="true"></i><span class="sr-only">Twitter</span></a>
                                    <a href="https://facebook.com"><i class="fab fa-facebook" aria-hidden="true"></i><span class="sr-only">Facebook</span></a>
                                    <a href="https://instagram.com"><i class="fab fa-instagram" aria-hidden="true"></i><span class="sr-only">Instagram</span></a>
                                </div>
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
    <div class="mobile-nav__wrapper">
        <div class="mobile-nav__overlay mobile-nav__toggler"></div>
        <div class="mobile-nav__content">
            <span class="mobile-nav__close mobile-nav__toggler"><i class="fa fa-times"></i></span>
            <div class="logo-box">
                <a href="/" aria-label="logo image"><img src="/assets/images/logo-light.png" width="155" alt="" /></a>
            </div>
            <div class="mobile-nav__container">
                <ul class="main-menu__list">
                    <li><a href="/">Home</a></li>
                    <li><a href="/services">Services</a></li>
                    <li><a href="/vip-packages">VIP Packages</a></li>
                    <li><a href="/mobile-massage">Mobile Massage</a></li>
                    <li><a href="/gallery">Gallery</a></li>
                    <li class="current"><a href="/blog">Blog</a></li>
                </ul>
            </div>
            <ul class="mobile-nav__contact list-unstyled">
                <li><i class="fa fa-envelope"></i><a href="mailto:theserenityspakla@gmail.com">theserenityspakla@gmail.com</a></li>
                <li><i class="fa fa-phone-alt"></i><a href="tel:+256781945510">+256 781 945 510</a></li>
            </ul>
        </div>
    </div>
    <div class="search-popup">
        <div class="search-popup__overlay search-toggler"></div>
        <div class="search-popup__content">
            <form role="search" method="get" class="search-popup__form" action="#">
                <input type="text" id="search" placeholder="Search Here..." />
                <button type="submit" aria-label="search submit" class="solox-btn solox-btn--base"><span><i class="icon-magnifying-glass"></i></span></button>
            </form>
        </div>
    </div>
    <a href="#" data-target="html" class="scroll-to-target scroll-to-top"><span class="scroll-to-top__text">back top</span><span class="scroll-to-top__wrapper"><span class="scroll-to-top__inner"></span></span></a>

    `,
        }}
      />
    </>
  );
}
