"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";
import { useSiteContact } from "@/components/ContactProvider";

// Contact data lives in its own component so Home never re-renders when
// /api/content resolves. A Home re-render makes React re-inject the whole
// dangerouslySetInnerHTML template, which restarts the hero keyframes.
function HomeContactSlots() {
  const { ready, phoneHref, phoneDisplay, whatsappLink, locationDisplay } = useSiteContact();

  useEffect(() => {
    if (!ready) return;
    const root = document.querySelector<HTMLElement>(".page-wrapper");
    if (!root) return;

    const setText = (selector: string, value: string) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        el.textContent = value;
      });
    };
    const setHref = (selector: string, value: string) => {
      root.querySelectorAll<HTMLElement>(selector).forEach((el) => {
        if (el instanceof HTMLAnchorElement) el.setAttribute("href", value);
      });
    };

    setText("[data-contact-phone]", phoneDisplay || "Call us");
    setHref("[data-contact-phone]", phoneHref);
    setText("[data-contact-location]", locationDisplay || "Kampala, Uganda");
    setHref("[data-contact-whatsapp]", whatsappLink("Hello The Serenity Spa, I'd like to book an appointment."));
  }, [ready, phoneHref, phoneDisplay, whatsappLink, locationDisplay]);

  return null;
}

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerWasOpen = useRef(false);
  const heroSliderNode = useRef<HTMLElement | null>(null);
  const heroSliderInstance = useRef<any>(null);
  const introPlayed = useRef(false);
  const owlRetry = useRef(0);
  const lastSlideRelative = useRef<number | null>(null);
  const textRevealTimeout = useRef(0);

  // The loop step keeps OWL's image fade. Only the text is re-revealed, so the
  // wrap still feels like the other slides instead of replaying the full intro.
  const cleanupTextReveal = useCallback(() => {
    if (textRevealTimeout.current) {
      window.clearTimeout(textRevealTimeout.current);
      textRevealTimeout.current = 0;
    }
    document.querySelectorAll(".hero-text-reveal").forEach((el) => {
      el.classList.remove("hero-text-reveal");
    });
  }, []);

  const startTextReveal = useCallback((targetIndex: number) => {
    if (!introPlayed.current) return;
    const node = heroSliderNode.current;
    if (!node) return;
    const target = node.querySelectorAll<HTMLElement>(".owl-stage > .owl-item")[targetIndex];
    if (!target) return;

    cleanupTextReveal();
    // Restart the keyframes even when OWL reuses the same DOM node.
    void target.offsetWidth;
    target.classList.add("hero-text-reveal");
    textRevealTimeout.current = window.setTimeout(cleanupTextReveal, 1900);
  }, [cleanupTextReveal]);

  const initSlider = useCallback((force = false) => {
    const $ = (window as any).jQuery;
    if (!$ || !$.fn || !$.fn.owlCarousel) return false;

    const node = document.querySelector<HTMLElement>(".main-slider-two__carousel");
    if (!node) return false;

    const previous = heroSliderInstance.current;
    const nodeChanged = !!previous && previous[0] !== node;

    // Destroy only when React replaced the hero node or a drawer close asked
    // for a repaint. Destroying on every effect run restarted the fade and
    // made the hero jump on load/refresh.
    if (previous && (force || nodeChanged)) {
      try { previous.trigger("destroy.owl.carousel"); } catch (e) {}
      try { previous.removeClass("owl-loaded owl-hidden"); } catch (e) {}
      heroSliderInstance.current = null;
    }

    const $slider = $(node);
    if (!$slider.hasClass("owl-loaded") || nodeChanged || force) {
      try {
        $slider.owlCarousel({
          loop: true,
          animateOut: "fadeOut",
          animateIn: "fadeIn",
          items: 1,
          autoplay: true,
          autoplayTimeout: 7000,
          smartSpeed: 1000,
          nav: false,
          dots: true,
          margin: 0,
          // AutoRefresh briefly toggles `owl-hidden` during hydration and can
          // blank the hero. This carousel is always visible by design.
          checkVisibility: false,
        });
      } catch (err) {}
    }

    heroSliderInstance.current = $slider;
    heroSliderNode.current = node;

    // One generic observer per OWL instance. It only marks the incoming slide
    // when the carousel wraps from the last real slide back to the first; it
    // never stops autoplay or shortens OWL's own fade.
    $slider.off(".heroText");
    lastSlideRelative.current = null;
    const owlInstance = $slider.data("owl.carousel");
    if (owlInstance && Number.isFinite(owlInstance.relative(owlInstance.current()))) {
      lastSlideRelative.current = owlInstance.relative(owlInstance.current());
    }
    $slider.on("changed.owl.carousel.heroText", (event: any) => {
      const instance = $slider.data("owl.carousel");
      const item = event?.item;
      if (!instance || !item || !Number.isFinite(item.index) || !Number.isFinite(item.count)) return;
      const targetRelative = instance.relative(item.index);
      if (!Number.isFinite(targetRelative)) return;
      const previousRelative = lastSlideRelative.current;
      lastSlideRelative.current = targetRelative;
      if (previousRelative === null || !introPlayed.current) return;
      if (previousRelative === item.count - 1 && targetRelative === 0) {
        startTextReveal(item.index);
      }
    });

    if ((window as any).soloxInitLoad && !(window as any).__serenitySoloxInit) {
      try {
        (window as any).soloxInitLoad();
        (window as any).__serenitySoloxInit = true;
      } catch (e) {}
    }

    if ((window as any).WOW && !(window as any).__serenityWowInit) {
      try {
        new (window as any).WOW({
          boxClass: "wow",
          animateClass: "animated",
          mobile: true,
          live: true,
        }).init();
        (window as any).__serenityWowInit = true;
      } catch (e) {}
    }
    return true;
  }, [startTextReveal]);

  // OWL is allowed only after the intro's last keyframe. The retry loop waits
  // for the vendor script without touching React state.
  const startOwl = useCallback(() => {
    if (owlRetry.current) window.clearTimeout(owlRetry.current);
    let attempts = 0;
    const tryInit = () => {
      const node = document.querySelector<HTMLElement>(".main-slider-two__carousel");
      if (!node) {
        if (attempts++ < 50) owlRetry.current = window.setTimeout(tryInit, 100);
        return;
      }
      const alreadyRunning = !!node
        && heroSliderNode.current === node
        && node.classList.contains("owl-loaded");
      if (alreadyRunning) return;
      if (initSlider()) return;
      if (attempts++ < 50) owlRetry.current = window.setTimeout(tryInit, 100);
    };
    owlRetry.current = window.setTimeout(tryInit, 0);
  }, [initSlider]);

  // Finish the one-off reveal by freezing the first slide in its final state.
  // Keeping `hero-static` (instead of removing every helper class) prevents the
  // vendor's delayed `.active` transitions from replaying the wipe later.
  const finishIntro = useCallback(() => {
    if (introPlayed.current) return;
    introPlayed.current = true;
    document.querySelectorAll(".hero-intro").forEach((el) => {
      el.classList.remove("hero-intro");
      el.classList.add("hero-static");
    });
    startOwl();
  }, [startOwl]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleTogglerClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(".mobile-nav__toggler");
      if (target) {
        e.preventDefault();
        e.stopPropagation();
        setDrawerOpen(true);
      }
    };
    document.addEventListener("click", handleTogglerClick, true);
    return () => document.removeEventListener("click", handleTogglerClick, true);
  }, []);

  // The hero renders with `hero-intro` on the very first paint, so the whole
  // keyframe sequence starts immediately. Freeze the finished frame when the
  // LAST keyframe actually ends — not on a fixed clock that can fire while the
  // browser is still parsing heavy vendor scripts.
  useEffect(() => {
    if (introPlayed.current) return;
    const onEnd = (event: AnimationEvent) => {
      if (event.animationName === "heroButtonIn") finishIntro();
    };
    document.addEventListener("animationend", onEnd, true);

    // If the sequence already finished before the listener attached,
    // getAnimations() still reports a finished heroButtonIn animation.
    const checkFinished = () => {
      const endNode = document.querySelector<HTMLElement>("[data-hero-intro-end]");
      const finished = endNode?.getAnimations?.().some((animation) => (
        (animation as CSSAnimation).animationName === "heroButtonIn"
        && animation.playState === "finished"
      ));
      if (finished) finishIntro();
    };
    checkFinished();

    // Safety net for environments that never dispatch animationend.
    const safety = window.setTimeout(finishIntro, 12000);
    return () => {
      document.removeEventListener("animationend", onEnd, true);
      window.clearTimeout(safety);
    };
  }, [finishIntro]);

  // Clear the temporary text class when its last keyframe finishes. The
  // fallback timeout in startTextReveal covers missed animationend events.
  useEffect(() => {
    const onEnd = (event: AnimationEvent) => {
      if (event.animationName !== "heroButtonIn") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest?.(".hero-text-reveal")) cleanupTextReveal();
    };
    document.addEventListener("animationend", onEnd, true);
    return () => document.removeEventListener("animationend", onEnd, true);
  }, [cleanupTextReveal]);

  useEffect(() => () => {
    if (owlRetry.current) window.clearTimeout(owlRetry.current);
    cleanupTextReveal();
  }, [cleanupTextReveal]);

  // Recover the hero slider whenever the mobile drawer closes. Opening a
  // full-screen blurred backdrop over the carousel and then unmounting it can
  // leave owl-carousel's stage / active item in a blank (black) state on
  // mobile. Re-initializing re-establishes the active image and forces a
  // repaint so the slideshow keeps animating after the sidebar closes.
  useEffect(() => {
    if (drawerWasOpen.current && !drawerOpen) {
      finishIntro();
      requestAnimationFrame(() => initSlider(true));
    }
    drawerWasOpen.current = drawerOpen;
  }, [drawerOpen, finishIntro, initSlider]);

  return (
    <>
      <HomeContactSlots />

      {/* --- LUXURY CUSTOM CURSOR ANIMATION --- */}
      <CustomCursor />

      {/* --- EXACT SOLOX LUXURY BODY CONTENT --- */}
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `

    <div class="page-wrapper">
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
                            <li class="current">
                                <a href="/">Home</a>
                            </li>
                            <li>
                                <a href="/services">Services</a>
                            </li>
                            <li>
                                <a href="/vip-packages">VIP Packages</a>
                            </li>
                            <li>
                                <a href="/mobile-massage">Mobile Massage</a>
                            </li>
                            <li>
                                <a href="/gallery">Gallery</a>
                            </li>
                            <li>
                                <a href="/blog">Blog</a>
                            </li>
                            <li>
                                <a href="/escorts">Escorts</a>
                            </li>
                        </ul>
                    </nav><!-- /.main-header__nav -->
                    <div class="main-header__right">
                        <div class="mobile-nav__btn mobile-nav__toggler">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div><!-- /.mobile-nav__toggler -->
                        <a href="/booking" class="solox-btn main-header__btn">
                            <span>Book now</span>
                        </a><!-- /.thm-btn main-header__btn -->
                    </div><!-- /.main-header__right -->
                </div><!-- /.main-header__inner -->
            </div><!-- /.container-fluid -->
        </header><!-- /.main-header -->
        <!-- main-slider-start -->
        <section class="main-slider-two hero-intro">
            <div
                class="main-slider-two__carousel owl-carousel">
                <div class="item hero-intro-slide">
                    <div class="main-slider-two__item">
                        <div class="main-slider-two__bg">
                            <img src="/assets/images/backgrounds/slider-2-1.jpg" alt="solox" />
                            <img src="/assets/images/backgrounds/slider-2-1.jpg" alt="solox" />
                        </div>
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12 text-center">
                                    <div class="main-slider-two__content">
                                        <h5 class="main-slider-two__sub-title">Place of your beauty</h5>
                                        <!-- slider-sub-title -->
                                        <h2 class="main-slider-two__title">The Serenity Spa</h2><!-- slider-title -->
                                        <div class="main-slider-two__btn" data-hero-intro-end>
                                            <a href="/services" class="solox-btn solox-btn--base"><span>Discover more</span></a><!-- slider-btn -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="main-slider-two__item">
                        <div class="main-slider-two__bg">
                            <img src="/assets/images/backgrounds/slider-2-2.jpg" alt="solox" />
                            <img src="/assets/images/backgrounds/slider-2-2.jpg" alt="solox" />
                        </div>
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12 text-center">
                                    <div class="main-slider-two__content">
                                        <h5 class="main-slider-two__sub-title">Place of your beauty</h5>
                                        <!-- slider-sub-title -->
                                        <h2 class="main-slider-two__title">The Serenity Spa</h2><!-- slider-title -->
                                        <div class="main-slider-two__btn">
                                            <a href="/services" class="solox-btn solox-btn--base"><span>Discover more</span></a><!-- slider-btn -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="main-slider-two__item">
                        <div class="main-slider-two__bg">
                            <img src="/assets/images/backgrounds/slider-2-3.jpg" alt="solox" />
                            <img src="/assets/images/backgrounds/slider-2-3.jpg" alt="solox" />
                        </div>
                        <div class="container">
                            <div class="row">
                                <div class="col-md-12 text-center">
                                    <div class="main-slider-two__content">
                                        <h5 class="main-slider-two__sub-title">Place of your beauty</h5>
                                        <!-- slider-sub-title -->
                                        <h2 class="main-slider-two__title">The Serenity Spa</h2><!-- slider-title -->
                                        <div class="main-slider-two__btn">
                                            <a href="/services" class="solox-btn solox-btn--base"><span>Discover more</span></a><!-- slider-btn -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- main-slider-end -->
        <section class="about-two" style="position: relative; overflow: hidden; background-color: #121212;">
            <div class="about-two__bg" style="position: absolute; inset: 0; left: 0; top: 0; width: 100%; height: 100%; background-image: url(/assets/images/backgrounds/testimonial-bg-1.jpg); background-size: cover; background-position: center center; background-repeat: no-repeat; opacity: 0.35; mix-blend-mode: normal; pointer-events: none;"></div>
            <div class="container" style="position: relative; z-index: 2;">
                <div class="row">
                    <div class="col-lg-8 wow fadeInLeft" data-wow-delay="300ms">
                        <div class="about-two__content">
                            <div class="sec-title">

                                <img src="/assets/images/shapes/sec-title-s-1.png" alt="Get to know us" class="sec-title__img">


                                <h6 class="sec-title__tagline">Get to know us</h6><!-- /.sec-title__tagline -->

                                <h3 class="sec-title__title">right place<br> for your beauty</h3><!-- /.sec-title__title -->
                            </div><!-- /.sec-title -->
                            <div class="row">
                                <div class="col-md-5">
                                    <div class="about-two__content__thumb">
                                        <img src="/assets/images/about/about-massage.jpg" alt="Serenity Spa therapist performing a massage">
                                        <div class="about-two__content__thumb__icon"><img src="/assets/images/shapes/why-choose-2-s-2.png" alt="solox"></div>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <div class="about-two__content__inner">
                                        <p class="about-two__content__text" style="color:#ffffff; opacity:1;">
                                            Welcome to The Serenity Spa — Kampala's premier luxury wellness destination, nestled in the heart of Mengo. We are a haven of calm where skilled therapists blend expert technique with the warmth of Ugandan hospitality to deliver an experience that renews your body, mind and spirit. Whether you are escaping the bustle of the city for an hour or treating yourself to a full-day retreat, every visit is designed around you.
                                        </p>
                                        <ul class="about-two__content__list" style="color:#ffffff;">
                                            <li><span class="fa fa-check-circle"></span>Expert full-body massages — Swedish, deep tissue, hot stone & more</li>
                                            <li><span class="fa fa-check-circle"></span>Premium skincare & body treatments using quality therapeutic oils</li>
                                            <li><span class="fa fa-check-circle"></span>Luxury VIP packages & exclusive couples experiences</li>
                                            <li><span class="fa fa-check-circle"></span>Mobile massage — our therapists come to you, anywhere in Kampala</li>
                                            <li><span class="fa fa-check-circle"></span>Open 24 hours, every day — walk-ins welcome, bookings preferred</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div><!-- /.col-lg-8 -->
                    <div class="col-lg-4 wow fadeInRight" data-wow-delay="300ms">
                        <div class="about-two__info">
                            <div class="about-two__info__text">Sir Apollo Kaggwa Rd &amp; Mengo, Kampala, Uganda</div>
                            <div class="about-two__info__content" style="background-image: url(/assets/images/shapes/about-2-info-shape-bg-dark.png);">
                                <div class="about-two__info__content-top">
                                    <h3 class="about-two__info__title">Opening<br> Hours</h3>
                                    <div class="about-two__info__icon"><span class="icon-alarm-clock"></span></div>
                                </div>
                                <ul class="about-two__info__list">
                                    <li class="about-two__info__list__item">
                                        Every day
                                        <span class="about-two__info__list__time">Open 24 hours</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="about-two__info__flower"><img src="/assets/images/shapes/about-2-flower.png" alt="solox" /></div>
                        </div>
                    </div><!-- /.col-lg-4 -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </section><!-- /.about-two -->
        <section class="video-one">
            <div class="video-one__bg jarallax" data-jarallax data-speed="0.3" data-imgPosition="50% -100%" style="background-image: url(/assets/images/backgrounds/video-bg-1-1.jpg);"></div>
            <!-- /.video-one__bg -->
            <div class="container">
                <div class="video-one__btn">
                    <a href="https://www.youtube.com/watch?v=h9MbznbxlLc" class="video-popup">
                        <i class="fa fa-play"></i>
                    </a>
                    <div class="curved-circle" aria-hidden="true">
                        <svg viewBox="0 0 200 200" width="200" height="200" style="display:block;width:100%;height:100%;overflow:visible;">
                            <defs>
                                <path id="videoCirclePath" d="M 100, 100 m -72, 0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0" />
                            </defs>
                            <text fill="#ffffff" font-size="13.5" font-weight="800" letter-spacing="5.6" style="text-transform:uppercase; filter: drop-shadow(0 1px 3px rgba(0,0,0,0.65));">
                                <textPath href="#videoCirclePath" startOffset="0%">
                                    Watch our massages Video
                                </textPath>
                            </text>
                        </svg>
                    </div><!-- curved-circle end-->
                </div><!-- /.video-one__btn -->
                <h2 class="video-one__title">watch our <br>
                    massages video</h2><!-- /.video-one__title -->
                <a href="/services" class="solox-btn video-one__link"><span>Tap to Watch</span></a>
            </div><!-- /.container -->
        </section><!-- /.video-one -->
        <section class="contact-one contact-one--home-two">
            <div class="container">
                <div class="contact-one__inner">
                    <div class="row">
                        <div class="col-xl-7">
                            <div class="contact-one__content">
                                <img src="/assets/images/shapes/contact-1-s-1.png" alt="" class="contact-one__content__shape-1">
                                <img src="/assets/images/shapes/contact-1-s-2.png" alt="" class="contact-one__content__shape-2">
                                <div class="sec-title">

                                    <img src="/assets/images/shapes/sec-title-s-1.png" alt="Contact with us" class="sec-title__img">


                                    <h6 class="sec-title__tagline">Contact with us</h6><!-- /.sec-title__tagline -->

                                    <h3 class="sec-title__title">get in touch</h3><!-- /.sec-title__title -->
                                </div><!-- /.sec-title -->
                                <p class="contact-one__text">Questions or ready to book? Call, email or send us a note and our team will get back to you.</p><!-- /.contact-one__text -->
                                <ul class="list-unstyled contact-one__info">
                                    <li class="contact-one__info__item">
                                        <div class="contact-one__info__icon">
                                            <i class="fas fa-phone-alt"></i>
                                        </div><!-- /.contact-one__info__icon -->
                                        <div class="contact-one__info__content">
                                            <p class="contact-one__info__text">Have any Question?</p>
                                            <!-- /.contact-one__info__text -->
                                            <h4 class="contact-one__info__title"><a data-contact-phone href="#">Call us</a></h4><!-- /.contact-one__info__title -->
                                        </div><!-- /.contact-one__info__content -->
                                    </li>
                                    <li class="contact-one__info__item">
                                        <div class="contact-one__info__icon">
                                            <i class="fas fa-envelope"></i>
                                        </div><!-- /.contact-one__info__icon -->
                                        <div class="contact-one__info__content">
                                            <p class="contact-one__info__text">Write Email </p>
                                            <!-- /.contact-one__info__text -->
                                            <h4 class="contact-one__info__title"><a href="mailto:theserenitybookings@gmail.com">theserenitybookings@gmail.com</a></h4>
                                            <!-- /.contact-one__info__title -->
                                        </div><!-- /.contact-one__info__content -->
                                    </li>
                                    <li class="contact-one__info__item">
                                        <div class="contact-one__info__icon">
                                            <i class="fas fa-map-marker"></i>
                                        </div><!-- /.contact-one__info__icon -->
                                        <div class="contact-one__info__content">
                                            <p class="contact-one__info__text">Visit Now </p> <!-- /.contact-one__info__text -->
                                            <h4 class="contact-one__info__title"><a data-contact-location href="https://www.google.com/maps">Sir Apollo Kaggwa Rd &amp; Mengo, Kampala, Uganda</a></h4><!-- /.contact-one__info__title -->
                                        </div><!-- /.contact-one__info__content -->
                                    </li>
                                </ul><!-- /.list-unstyled -->
                            </div><!-- /.contact-one__content -->
                        </div><!-- /.col-xl-7 -->
                        <div class="col-xl-5">
                            <div class="contact-one__form form-one background-base wow fadeInUp" data-wow-duration="1500ms">
                                <div class="contact-one__form__top">
                                    <div class="sec-title">


                                        <h6 class="sec-title__tagline">Appointment</h6><!-- /.sec-title__tagline -->

                                        <h3 class="sec-title__title">book Now</h3><!-- /.sec-title__title -->
                                    </div><!-- /.sec-title -->
                                </div><!-- /.contact-one__form__top -->
                                <p class="contact-one__text">Book a treatment or ask us anything — we reply quickly on WhatsApp.</p>
                                <div class="form-one__group">
                                    <div class="form-one__control form-one__control--full">
                                        <a data-contact-whatsapp href="#" class="solox-btn" target="_blank" rel="noopener noreferrer"><span>Chat on WhatsApp</span></a>
                                    </div><!-- /.form-one__control form-one__control--full -->
                                    <div class="form-one__control form-one__control--full">
                                        <a href="mailto:theserenitybookings@gmail.com?subject=Appointment%20enquiry" class="solox-btn"><span>Email us</span></a>
                                    </div><!-- /.form-one__control form-one__control--full -->
                                </div><!-- /.form-one__group -->
                            </div>
                        </div><!-- /.col-xl-5 -->
                    </div><!-- /.row -->
                    <div class="contact-one__inner-shape">
                        <img src="/assets/images/shapes/contact-2-shape-1.png" alt="solox" />
                    </div><!-- /.contact-one__shape -->
                </div><!-- /.contact-one__inner -->
            </div><!-- /.container -->
        </section><!-- /.contact-one -->

        <footer class="main-footer background-black">
            <div class="main-footer__bg background-black" style="background-image: url(/assets/images/shapes/footer-bg-1-1.png);"></div>
            <!-- /.main-footer__bg -->
            <div class="main-footer__top">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 col-xl-4">
                            <div class="footer-widget footer-widget--about">
                                <a href="/" class="footer-widget__logo">
                                    <img src="/assets/images/logo-light.png" width="155" alt="The Serenity Spa">
                                </a>
                                <a href="mailto:theserenitybookings@gmail.com?subject=Spa%20updates" class="footer-widget__newsletter-link">Get spa updates by email →</a>
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-md-6 -->
                        <div class="col-md-6 col-xl-2">
                            <div class="footer-widget footer-widget--links">
                                <h2 class="footer-widget__title">Links</h2><!-- /.footer-widget__title -->
                                <ul class="list-unstyled footer-widget__links">
                                    <li><a href="/">About</a></li>
                                    <li><a href="/vip-packages">Pricing Plans</a></li>
                                    <li><a href="/services">Our Treatments</a></li>
                                    <li><a href="/services">Contact</a></li>
                                </ul><!-- /.list-unstyled footer-widget__links -->
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-md-6 -->
                        <div class="col-md-6 col-xl-3">
                            <div class="footer-widget footer-widget--contact">
                                <h2 class="footer-widget__title">Contact</h2><!-- /.footer-widget__title -->
                                <ul class="list-unstyled footer-widget__info">
                                    <li> <a data-contact-phone href="#">Call us</a></li>
                                    <li> <a href="mailto:theserenitybookings@gmail.com">theserenitybookings@gmail.com</a></li>
                                    <li> <a data-contact-location href="https://www.google.com/maps">Sir Apollo Kaggwa Rd &amp; Mengo, Kampala, Uganda</a></li>
                                </ul><!-- /.list-unstyled -->
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-md-6 -->
                        <div class="col-md-6 col-xl-3">
                            <div class="footer-widget footer-widget--time">
                                <h2 class="footer-widget__title">Timing</h2><!-- /.footer-widget__title -->
                                <p class="footer-widget__text">Open 24 Hours, 7 Days a Week</p>
                                <!-- /.footer-widget__text -->
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-md-6 -->
                    </div><!-- /.row -->
                </div><!-- /.container -->
            </div><!-- /.main-footer__top -->
            <div class="main-footer__bottom">
                <div class="container">
                    <div class="main-footer__bottom__inner">
                        <p class="main-footer__copyright">
                            &copy; Copyright <span class="dynamic-year"></span> by The Serenity Spa. All Rights Reserved.
                        </p>
                    </div><!-- /.main-footer__inner -->
                </div><!-- /.container -->
            </div><!-- /.main-footer__bottom -->
        </footer><!-- /.main-footer -->

    </div><!-- /.page-wrapper -->





    
          `,
        }}
      />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}



