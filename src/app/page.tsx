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
  const owlWrapBound = useRef(false);
  const lastSlideRelative = useRef<number | null>(null);
  const wrapPlaying = useRef(false);
  const wrapTimeout = useRef(0);

  // End the last→first intro as soon as its final keyframe finishes, and always
  // resume autoplay so a missed animationend can never freeze the carousel.
  const endWrapReplay = useCallback(() => {
    if (!wrapPlaying.current) return;
    wrapPlaying.current = false;
    if (wrapTimeout.current) window.clearTimeout(wrapTimeout.current);
    wrapTimeout.current = 0;

    document.querySelector(".main-slider-two")?.classList.remove("hero-wrap");
    document.querySelectorAll(".hero-wrap-slide").forEach((el) => {
      el.classList.remove("hero-wrap-slide");
    });

    const node = heroSliderNode.current;
    const $ = (window as any).jQuery;
    if (node && $) $(node).trigger("play.owl.autoplay");
  }, []);

  // Replay the SAME intro keyframes on the incoming first slide when OWL wraps
  // from the last slide. The target `.owl-item` is marked before OWL's fade
  // swap so the keyframes and the slide change share one owner and one clock.
  const startWrapReplay = useCallback((targetIndex: number) => {
    if (wrapPlaying.current || !introPlayed.current) return;
    const node = heroSliderNode.current;
    const section = document.querySelector<HTMLElement>(".main-slider-two");
    if (!node || !section) return;
    const target = node.querySelectorAll<HTMLElement>(".owl-stage > .owl-item")[targetIndex];
    if (!target) return;

    wrapPlaying.current = true;
    if (wrapTimeout.current) window.clearTimeout(wrapTimeout.current);

    section.classList.add("hero-static");
    section.classList.remove("hero-intro");
    section.classList.add("hero-wrap");
    node.querySelectorAll(".hero-wrap-slide").forEach((el) => {
      el.classList.remove("hero-wrap-slide");
    });
    target.classList.add("hero-wrap-slide");

    const $ = (window as any).jQuery;
    if ($) $(node).trigger("stop.owl.autoplay");
    wrapTimeout.current = window.setTimeout(endWrapReplay, 3200);
  }, [endWrapReplay]);

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
    // Rebind on every (re)init; drawer-close recovery destroys and rebuilds OWL
    // on the same node, and stale handlers would read a dead instance.
    $slider.off(".heroWrap");
    owlWrapBound.current = false;
    lastSlideRelative.current = null;
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

    if (!owlWrapBound.current) {
      const instance = $slider.data("owl.carousel");
      if (instance && Number.isFinite(instance.relative(instance.current()))) {
        lastSlideRelative.current = instance.relative(instance.current());
      }
      $slider.on("changed.owl.carousel.heroWrap", (event: any) => {
        const inst = $slider.data("owl.carousel");
        const item = event?.item;
        if (!inst || !item || !Number.isFinite(item.index) || !Number.isFinite(item.count)) return;
        const targetRelative = inst.relative(item.index);
        if (!Number.isFinite(targetRelative)) return;
        const previousRelative = lastSlideRelative.current;
        lastSlideRelative.current = targetRelative;
        // Only a forward wrap from the last real slide to the first one.
        if (previousRelative === null || previousRelative !== item.count - 1 || targetRelative !== 0) return;
        startWrapReplay(item.index);
      });
      owlWrapBound.current = true;
    }

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
  }, [startWrapReplay]);

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

  // The wrap replay uses the same final keyframe as its handoff. Scoping the
  // listener to the marked slide stops OWL's own 1ms fade animationend from
  // ending the reveal early.
  useEffect(() => {
    const onEnd = (event: AnimationEvent) => {
      if (event.animationName !== "heroButtonIn") return;
      const target = event.target as HTMLElement | null;
      if (target?.closest?.(".hero-wrap-slide")) endWrapReplay();
    };
    document.addEventListener("animationend", onEnd, true);
    return () => document.removeEventListener("animationend", onEnd, true);
  }, [endWrapReplay]);

  useEffect(() => () => {
    if (owlRetry.current) window.clearTimeout(owlRetry.current);
    if (wrapTimeout.current) window.clearTimeout(wrapTimeout.current);
  }, []);

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
        <section class="about-two">
            <div class="about-two__bg" style="background-image: url(/assets/images/shapes/about-bg-2.jpg);"></div>
            <div class="container">
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
                                        <img src="/assets/images/resources/about-2-1.jpg" alt="solox">
                                        <div class="about-two__content__thumb__icon"><img src="/assets/images/shapes/why-choose-2-s-2.png" alt="solox"></div>
                                    </div>
                                </div>
                                <div class="col-md-7">
                                    <div class="about-two__content__inner">
                                        <p class="about-two__content__text">
                                            At The Serenity Spa in Mengo, we blend skilled massage techniques with warm Ugandan hospitality. Step away from the bustle of Kampala and let our therapists restore your calm.
                                        </p>
                                        <ul class="about-two__content__list">
                                            <li><span class="fa fa-check-circle"></span>Tailored massage and body treatments</li>
                                            <li><span class="fa fa-check-circle"></span>Premium skincare with quality oils</li>
                                            <li><span class="fa fa-check-circle"></span>Massages & therapies</li>
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
                    <div class="curved-circle">
                        <!-- curved-circle start-->
                        <div class="curved-circle--item" data-circle-text-options='{
					"radius": 92,
					"forceWidth": true,
					"forceHeight": true
				}'>
                            Watch our massages Video
                        </div>
                    </div><!-- curved-circle end-->
                </div><!-- /.video-one__btn -->
                <h2 class="video-one__title">book & feel our <br>
                    Incredible Spa Experience</h2><!-- /.video-one__title -->
                <a href="/services" class="solox-btn video-one__link"><span>Discover more</span></a>
            </div><!-- /.container -->
        </section><!-- /.video-one -->
                <!-- ==================== FEATURED EXPERTS & PROFILES CAROUSEL ==================== -->
        <section class="team-one team-one--carousel" id="featured-profiles" style="padding: 100px 0; background-color: #121212; position: relative;">
            <div class="container">
                <div class="sec-title text-center" style="margin-bottom: 50px;">
                    <img src="/assets/images/shapes/sec-title-s-1.png" alt="Featured Selection" class="sec-title__img">
                    <h6 class="sec-title__tagline" style="color: #c2a74e; font-size: 14px; letter-spacing: 2px;">TOP TIER PRACTITIONERS</h6>
                    <h3 class="sec-title__title" style="color: #ffffff; font-size: 42px;">Featured Wellness Specialists</h3>
                </div>
                <div
                    class="team-one__carousel solox-owl__carousel solox-owl__carousel--with-shadow owl-carousel owl-theme" data-owl-options='{"items":3,"margin":30,"loop":true,"smartSpeed":700,"nav":true,"dots":true,"autoplay":true,"responsive":{"0":{"items":1},"768":{"items":2},"992":{"items":3}}}'>
                    <!-- Featured Card 1 -->
                    <div class="item">
                        <div class="team-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 1px solid rgba(194, 167, 78, 0.2); transition: all 0.4s ease;">
                            <div class="team-card__image" style="position: relative; overflow: hidden;">
                                <div style="position: absolute; top: 15px; left: 15px; z-index: 5;">
                                    <span style="background: linear-gradient(135deg, #c2a74e, #c2a74e); color: #161616; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 3px; display: inline-block; text-transform: uppercase;">FEATURED</span>
                                </div>
                                <img src="/assets/images/team/team-1-1.jpg" alt="Serenity Spa wellness specialist" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Senior Aromatherapist</h6>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(4.9/5.0)</span>
                                </div>
                                <a href="/services" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>Explore Treatments</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Featured Card 2 (#item2 focus) -->
                    <div class="item" data-hash="item2">
                        <div class="team-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 2px solid #c2a74e; box-shadow: 0 10px 30px rgba(194, 167, 78, 0.25); transition: all 0.4s ease;">
                            <div class="team-card__image" style="position: relative; overflow: hidden;">
                                <div style="position: absolute; top: 15px; left: 15px; z-index: 5;">
                                    <span style="background: linear-gradient(135deg, #c2a74e, #c2a74e); color: #161616; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; padding: 5px 14px; border-radius: 3px; display: inline-block; text-transform: uppercase; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">FEATURED</span>
                                </div>
                                <img src="/assets/images/team/team-1-2.jpg" alt="Serenity Spa wellness specialist" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Lead Hydro-Therapist</h6>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(5.0/5.0)</span>
                                </div>
                                <a href="/services" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>Explore Treatments</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Featured Card 3 -->
                    <div class="item">
                        <div class="team-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 1px solid rgba(194, 167, 78, 0.2); transition: all 0.4s ease;">
                            <div class="team-card__image" style="position: relative; overflow: hidden;">
                                <div style="position: absolute; top: 15px; left: 15px; z-index: 5;">
                                    <span style="background: linear-gradient(135deg, #c2a74e, #c2a74e); color: #161616; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 3px; display: inline-block; text-transform: uppercase;">FEATURED</span>
                                </div>
                                <img src="/assets/images/team/team-1-3.jpg" alt="Serenity Spa wellness specialist" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Holistic Aesthetician</h6>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(4.95/5.0)</span>
                                </div>
                                <a href="/services" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>Explore Treatments</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Featured Card 4 -->
                    <div class="item">
                        <div class="team-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 1px solid rgba(194, 167, 78, 0.2); transition: all 0.4s ease;">
                            <div class="team-card__image" style="position: relative; overflow: hidden;">
                                <div style="position: absolute; top: 15px; left: 15px; z-index: 5;">
                                    <span style="background: linear-gradient(135deg, #c2a74e, #c2a74e); color: #161616; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 3px; display: inline-block; text-transform: uppercase;">FEATURED</span>
                                </div>
                                <img src="/assets/images/team/team-1-4.jpg" alt="Serenity Spa wellness specialist" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Thermal & Stone Expert</h6>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(4.9/5.0)</span>
                                </div>
                                <a href="/services" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>Explore Treatments</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Featured Card 5 -->
                    <div class="item">
                        <div class="team-card" style="background: #1a1a1a; border-radius: 8px; overflow: hidden; border: 1px solid rgba(194, 167, 78, 0.2); transition: all 0.4s ease;">
                            <div class="team-card__image" style="position: relative; overflow: hidden;">
                                <div style="position: absolute; top: 15px; left: 15px; z-index: 5;">
                                    <span style="background: linear-gradient(135deg, #c2a74e, #c2a74e); color: #161616; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; padding: 4px 12px; border-radius: 3px; display: inline-block; text-transform: uppercase;">FEATURED</span>
                                </div>
                                <img src="/assets/images/team/team-1-5.jpg" alt="Serenity Spa wellness specialist" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Deep Tissue & Recovery Expert</h6>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(4.95/5.0)</span>
                                </div>
                                <a href="/services" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>Explore Treatments</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- ==================== /FEATURED EXPERTS & PROFILES CAROUSEL ==================== -->

        <!-- Work Process Start -->
        <section class="work-process-one">
            <div class="container">
                <div class="row">
                    <div class="col-md-12">
                        <div class="sec-title">

                            <img src="/assets/images/shapes/sec-title-s-1.png" alt="3 easy steps" class="sec-title__img">


                            <h6 class="sec-title__tagline">3 easy steps</h6><!-- /.sec-title__tagline -->

                            <h3 class="sec-title__title">how it works?</h3><!-- /.sec-title__title -->
                        </div><!-- /.sec-title -->
                        <!-- section-title -->
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-12 wow fadeInUp animated" data-wow-delay="500ms">
                        <div class="work-process-one__border"><span class="work-process-one__gradiant-left"></span><span class="work-process-one__gradiant-right"></span></div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-lg-4 col-md-6 wow fadeInUp animated" data-wow-delay="200ms">
                        <div class="work-process-one__item text-center">
                            <div class="work-process-one__item__thumb">
                                <div class="work-process-one__item__thumb-wrap"><img src="/assets/images/resources/work-process-1.jpg" alt="solox"></div>
                                <div class="work-process-one__item__thumb__icon"><span class="icon-relax"></span></div><!-- /.work-process-icon -->
                                <div class="work-process-one__item__thumb__number"></div><!-- /.work-process-number -->
                            </div><!-- /.work-process-image -->
                            <div class="work-process-one__item__content">
                                <h4 class="work-process-one__item__title">Meeting</h4><!-- /.work-process-title -->
                                <p class="work-process-one__item__text">
                                    Tell us how you would like to feel and we will help you choose the right treatment.
                                </p><!-- /.work-process-text -->
                            </div>
                        </div><!-- /.work-process-item -->
                    </div>
                    <div class="col-lg-4 col-md-6 wow fadeInUp animated" data-wow-delay="300ms">
                        <div class="work-process-one__item text-center">
                            <div class="work-process-one__item__thumb">
                                <div class="work-process-one__item__thumb-wrap"><img src="/assets/images/resources/work-process-2.jpg" alt="solox"></div>
                                <div class="work-process-one__item__thumb__icon"><span class="icon-spa"></span></div><!-- /.work-process-icon -->
                                <div class="work-process-one__item__thumb__number"></div><!-- /.work-process-number -->
                            </div><!-- /.work-process-image -->
                            <div class="work-process-one__item__content">
                                <h4 class="work-process-one__item__title">Treatment</h4><!-- /.work-process-title -->
                                <p class="work-process-one__item__text">
                                    Your therapist tailors the massage or beauty ritual to your needs, in a calm private room.
                                </p><!-- /.work-process-text -->
                            </div>
                        </div><!-- /.work-process-item -->
                    </div>
                    <div class="col-lg-4 col-md-6 wow fadeInUp animated" data-wow-delay="400ms">
                        <div class="work-process-one__item text-center">
                            <div class="work-process-one__item__thumb">
                                <div class="work-process-one__item__thumb-wrap"><img src="/assets/images/resources/work-process-3.jpg" alt="solox"></div>
                                <div class="work-process-one__item__thumb__icon"><span class="icon-herbal"></span></div><!-- /.work-process-icon -->
                                <div class="work-process-one__item__thumb__number"></div><!-- /.work-process-number -->
                            </div><!-- /.work-process-image -->
                            <div class="work-process-one__item__content">
                                <h4 class="work-process-one__item__title">Finalizing</h4><!-- /.work-process-title -->
                                <p class="work-process-one__item__text">
                                    Leave feeling rested and refreshed, with aftercare tips to keep the calm going.
                                </p><!-- /.work-process-text -->
                            </div>
                        </div><!-- /.work-process-item -->
                    </div>
                </div>
            </div>
        </section>
        <!-- Work Process End -->
        <section class="testimonials-two">
            <div class="testimonials-two__bg jarallax" data-jarallax data-speed="0.3" data-imgPosition="50% -100%" style="background-image: url(/assets/images/backgrounds/testimonial-bg-1.jpg);"></div>
            <!-- /.contact__bg -->
            <div class="container">
                <div class="testimonials-two__wrapper">
                    <div
                        class="testimonials-two__carousel solox-owl__carousel owl-theme owl-carousel" data-owl-options='{"items":1,"margin":0,"smartSpeed":700,"loop":true,"autoplay":true,"nav":false,"URLhashListener":true,"dots":false}'>
                        <!-- Testimonial Item -->
                        <div class="item" data-hash="item1">
                            <div class="testimonials-two__item">
                                <div class="testimonials-two__item__ratings">
                                    <span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>
                                </div>
                                <div class="testimonials-two__item__quote">
                                    Saturday is a day for the spa. It's not selfish to love yourself, take care of yourself, and to make your happiness a priority.
                                </div>
                            </div>
                        </div>
                        <!-- Testimonial Item -->
                        <!-- Testimonial Item -->
                        <div class="item" data-hash="item2">
                            <div class="testimonials-two__item" style="position: relative;">
                                <div class="item-featured-tag" style="margin-bottom: 12px;">
                                    <span style="background: linear-gradient(135deg, #c2a74e 0%, #c2a74e 100%); color: #161616; padding: 4px 14px; font-size: 11px; font-weight: 700; letter-spacing: 1.5px; border-radius: 3px; display: inline-block; text-transform: uppercase; box-shadow: 0 4px 15px rgba(194, 167, 78, 0.35);">FEATURED</span>
                                </div>
                                <div class="testimonials-two__item__ratings">
                                    <span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>
                                </div>
                                <div class="testimonials-two__item__quote">
                                    "Saturday is a day for the spa. It's not selfish to love yourself, take care of yourself, and to make your happiness a priority. Experience bespoke wellness treatments tailored to perfection."
                                </div>
                                <div class="testimonials-two__item__action" style="margin-top: 20px;">
                                    <a href="#item2" class="solox-btn solox-btn--base" style="padding: 10px 24px; font-size: 13px;">
                                        <span>View Profile</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <!-- Testimonial Item -->
                        <!-- Testimonial Item -->
                        <div class="item" data-hash="item3">
                            <div class="testimonials-two__item">
                                <div class="testimonials-two__item__ratings">
                                    <span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>
                                </div>
                                <div class="testimonials-two__item__quote">
                                    Saturday is a day for the spa. It's not selfish to love yourself, take care of yourself, and to make your happiness a priority.
                                </div>
                            </div>
                        </div>
                        <!-- Testimonial Item -->
                        <!-- Testimonial Item -->
                        <div class="item" data-hash="item4">
                            <div class="testimonials-two__item">
                                <div class="testimonials-two__item__ratings">
                                    <span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>
                                </div>
                                <div class="testimonials-two__item__quote">
                                    Saturday is a day for the spa. It's not selfish to love yourself, take care of yourself, and to make your happiness a priority.
                                </div>
                            </div>
                        </div>
                        <!-- Testimonial Item -->
                        <!-- Testimonial Item -->
                        <div class="item" data-hash="item5">
                            <div class="testimonials-two__item">
                                <div class="testimonials-two__item__ratings">
                                    <span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span><span class="fa fa-star"></span>
                                </div>
                                <div class="testimonials-two__item__quote">
                                    Saturday is a day for the spa. It's not selfish to love yourself, take care of yourself, and to make your happiness a priority.
                                </div>
                            </div>
                        </div>
                        <!-- Testimonial Item -->
                    </div>
                    <!-- Testimonial Thumb -->
                    <div
                        class="testimonials-two__carousel-thumb solox-owl__carousel owl-theme owl-carousel" data-owl-options='{"items":5,"margin":40,"smartSpeed":700,"loop":true,"autoplay":true,"URLhashListener":true,"center":true,"dots":false,"responsive":{"0":{"items":3,"margin":10},"768":{"items":5,"margin":20},"992":{"items":5,"margin":30},"1200":{"items":5}}}'>
                        <a href="#item1" class="item" data-hash="item1">
                            <span class="testimonials-two__meta-thumb"><img src="/assets/images/resources/testi-1-1.jpg" alt="solox"></span>
                            <span class="testimonials-two__meta">
                                <span class="testimonials-two__meta__name">Serenity Guest</span>
                                <span class="testimonials-two__meta__designation">Customer</span>
                            </span>
                        </a><!-- testimonial-author -->
                        <a href="#item2" class="item active-featured" data-hash="item2">
                            <span class="testimonials-two__meta-thumb" style="border: 2px solid #c2a74e; box-shadow: 0 0 12px rgba(194, 167, 78, 0.4);"><img src="/assets/images/resources/testi-1-2.jpg" alt="solox"></span>
                            <span class="testimonials-two__meta">
                                <span class="testimonials-two__meta__name">Serenity Guest</span>
                                <span class="testimonials-two__meta__designation" style="color: #c2a74e; font-weight: 600;">Featured Guest</span>
                            </span>
                        </a><!-- testimonial-author -->
                        <a href="#item3" class="item" data-hash="item3">
                            <span class="testimonials-two__meta-thumb"><img src="/assets/images/resources/testi-1-3.jpg" alt="solox"></span>
                            <span class="testimonials-two__meta">
                                <span class="testimonials-two__meta__name">Serenity Guest</span>
                                <span class="testimonials-two__meta__designation">Customer</span>
                            </span>
                        </a><!-- testimonial-author -->
                        <a href="#item4" class="item" data-hash="item4">
                            <span class="testimonials-two__meta-thumb"><img src="/assets/images/resources/testi-1-4.jpg" alt="solox"></span>
                            <span class="testimonials-two__meta">
                                <span class="testimonials-two__meta__name">Serenity Guest</span>
                                <span class="testimonials-two__meta__designation">Customer</span>
                            </span>
                        </a><!-- testimonial-author -->
                        <a href="#item5" class="item" data-hash="item5">
                            <span class="testimonials-two__meta-thumb"><img src="/assets/images/resources/testi-1-5.jpg" alt="solox"></span>
                            <span class="testimonials-two__meta">
                                <span class="testimonials-two__meta__name">Serenity Guest</span>
                                <span class="testimonials-two__meta__designation">Customer</span>
                            </span>
                        </a><!-- testimonial-author -->
                    </div>
                    <!-- Testimonial Thumb -->
                </div><!-- /.testimonials-two__carousel -->
            </div><!-- /.container -->
        </section><!-- /.testimonials-two -->
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



