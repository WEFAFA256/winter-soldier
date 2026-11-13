"use client";

import React, { useEffect, useState } from "react";
import CustomCursor from "@/components/CustomCursor";
import MobileDrawer from "@/components/MobileDrawer";

export default function Home() {
  const [drawerOpen, setDrawerOpen] = useState(false);

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

    const initSlider = () => {
      const $ = (window as any).jQuery;
      if (!$ || !$.fn || !$.fn.owlCarousel) return;

      const $slider = $(".main-slider-two__carousel");
      if ($slider.length) {
        if ($slider.hasClass("owl-loaded")) {
          try {
            $slider.trigger("destroy.owl.carousel");
            $slider.removeClass("owl-loaded owl-hidden");
          } catch (e) {}
        }
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
          });
        } catch (err) {}
      }

      if ((window as any).soloxInitLoad) {
        try {
          (window as any).soloxInitLoad();
        } catch (e) {}
      }

      if ((window as any).WOW) {
        try {
          new (window as any).WOW({
            boxClass: "wow",
            animateClass: "animated",
            mobile: true,
            live: true,
          }).init();
        } catch (e) {}
      }
    };

    // Initialize once without jarring destroying/rebuilding cycles
    const timer = setTimeout(initSlider, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleTogglerClick, true);
    };
  }, []);

  return (
    <>
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
                                <a href="/services">Services &amp; Packages</a>
                            </li>
                            <li>
                                <a href="/gallery">Gallery</a>
                            </li>
                            <li>
                                <a href="/blog">Blog</a>
                            </li>
                        </ul>
                    </nav><!-- /.main-header__nav -->
                    <div class="main-header__right">
                        <div class="mobile-nav__btn mobile-nav__toggler">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div><!-- /.mobile-nav__toggler -->
                        <a href="/services" class="solox-btn main-header__btn">
                            <span>Book now</span>
                        </a><!-- /.thm-btn main-header__btn -->
                    </div><!-- /.main-header__right -->
                </div><!-- /.main-header__inner -->
            </div><!-- /.container-fluid -->
        </header><!-- /.main-header -->
        <!-- main-slider-start -->
        <section class="main-slider-two">
            <div
                class="main-slider-two__carousel solox-owl__carousel owl-carousel" data-owl-options='{"loop":true,"animateOut":"fadeOut","animateIn":"fadeIn","items":1,"autoplay":true,"autoplayTimeout":7000,"smartSpeed":1000,"nav":false,"dots":true,"margin":0}'>
                <div class="item">
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
                                            There are many variations of passages of Lorem Ipsum available, but the majority have suffered simply free
                                            text available alteration in some form, by injected humour.
                                        </p>
                                        <ul class="about-two__content__list">
                                            <li><span class="fa fa-check-circle"></span>Making a quality beauty products</li>
                                            <li><span class="fa fa-check-circle"></span>Most premium skin care process</li>
                                            <li><span class="fa fa-check-circle"></span>Massages & therapiess</li>
                                        </ul>
                                        <div class="about-two__content__author">
                                            <div class="about-two__content__author__thumb">
                                                <img src="/assets/images/resources/about-author-1.png" alt="solox">
                                            </div>
                                            <div class="about-two__content__author__meta">
                                                <img src="/assets/images/resources/about-sign-2.png" alt="solox">
                                                Christine - Co Founder
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div><!-- /.col-lg-8 -->
                    <div class="col-lg-4 wow fadeInRight" data-wow-delay="300ms">
                        <div class="about-two__info">
                            <div class="about-two__info__text">66 Broklyn Golden Street New York. USA</div>
                            <div class="about-two__info__content" style="background-image: url(/assets/images/shapes/about-2-info-shape-bg-dark.png);">
                                <div class="about-two__info__content-top">
                                    <h3 class="about-two__info__title">Opening<br> Hours</h3>
                                    <div class="about-two__info__icon"><span class="icon-alarm-clock"></span></div>
                                </div>
                                <ul class="about-two__info__list">
                                    <li class="about-two__info__list__item">
                                        Monday
                                        <span class="about-two__info__list__time">12:00 pm - 19:00 pm</span>
                                    </li>
                                    <li class="about-two__info__list__item">
                                        Tuesday to Friday
                                        <span class="about-two__info__list__time">8:00 am - 19:00 pm</span>
                                    </li>
                                    <li class="about-two__info__list__item">
                                        Saturday
                                        <span class="about-two__info__list__time">8:00 am to 3:30 pm</span>
                                    </li>
                                </ul>
                            </div>
                            <div class="about-two__info__flower"><img src="/assets/images/shapes/about-2-flower.png" alt="solox" /></div>
                        </div>
                    </div><!-- /.col-lg-4 -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </section><!-- /.about-two -->
        <div class="client-carousel client-carousel-one @@extraClassName">
            <div class="container">
                <div
                    class="client-carousel__one solox-owl__carousel owl-theme owl-carousel" data-owl-options='{"items":5,"margin":55,"smartSpeed":700,"loop":true,"autoplay":6000,"nav":true,"dots":false,"responsive":{"0":{"items":1,"margin":0},"360":{"items":2,"margin":0},"575":{"items":3,"margin":30},"768":{"items":3,"margin":40},"992":{"items":4,"margin":40},"1200":{"items":5}}}'>
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                    <div class="client-carousel__one__item">
                        <img src="/assets/images/resources/brand-1-1.png" alt="solox">
                    </div><!-- /.owl-slide-item-->
                </div><!-- /.thm-owl__slider -->
            </div><!-- /.container -->
        </div><!-- /.client-carousel -->
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
                            Watch our masssages Video
                        </div>
                    </div><!-- curved-circle end-->
                </div><!-- /.video-one__btn -->
                <h2 class="video-one__title">book & feel our <br>
                    Incredible Spa Experience</h2><!-- /.video-one__title -->
                <a href="/services" class="solox-btn video-one__link"><span>Discover more</span></a>
            </div><!-- /.container -->
        </section><!-- /.video-one -->
        <section class="funfact-two" style="background-image: url(/assets/images/shapes/funfact-bg-2.jpg);">
            <div class="funfact-two__shape"><img src="/assets/images/shapes/funfact-bg-2-shape.png" alt="solox" /></div><!-- /.funfact-shape -->
            <div class="container">
                <div class="row">
                    <div class="col-lg-6 wow fadeInUp" data-wow-delay="200ms">
                        <div class="funfact-two__content">
                            <div class="sec-title">
                                <img src="/assets/images/shapes/sec-title-s-2.png" alt="solox" class="sec-title__img">
                                <h6 class="sec-title__tagline">Fun facts</h6><!-- /.sec-title__tagline -->
                                <h3 class="sec-title__title">TRUE WELLNESS & beauty</h3><!-- /.sec-title__title -->
                            </div><!-- /.sec-title -->
                            <a href="/services" class="solox-btn"><span>Discover more</span></a>
                        </div>
                    </div>
                    <div class="col-lg-6 wow fadeInUp" data-wow-delay="300ms">
                        <ul class="list-unstyled funfact-two__list">
                            <li class="funfact-two__item count-box">
                                <h3 class="funfact-two__count count-text" data-stop="23" data-speed="1500"></h3>
                                <!-- /.funfact-two__count -->
                                <p class="funfact-two__text">Years of Experience</p><!-- /.funfact-two__text -->
                            </li><!-- /.funfact-two__item -->
                            <li class="funfact-two__item count-box">
                                <h3 class="funfact-two__count count-text" data-stop="30" data-speed="1500"></h3>
                                <!-- /.funfact-two__count -->
                                <p class="funfact-two__text">Herbal Treatments</p><!-- /.funfact-two__text -->
                            </li><!-- /.funfact-two__item -->
                            <li class="funfact-two__item count-box">
                                <h3 class="funfact-two__count count-text" data-stop="870" data-speed="1500"></h3>
                                <!-- /.funfact-two__count -->
                                <p class="funfact-two__text">Wellness & Spa</p><!-- /.funfact-two__text -->
                            </li><!-- /.funfact-two__item -->
                            <li class="funfact-two__item count-box">
                                <h3 class="funfact-two__count count-text" data-stop="980" data-speed="1500"></h3>
                                <!-- /.funfact-two__count -->
                                <p class="funfact-two__text">Happy Clients</p><!-- /.funfact-two__text -->
                            </li><!-- /.funfact-two__item -->
                            <li class="funfact-two__list__icon"><img src="/assets/images/shapes/why-choose-2-s-2.png" alt="solox" /></li>
                        </ul><!-- /.list-unstyled funfact-two__list -->
                    </div>
                </div>
            </div><!-- /.container -->
        </section><!-- /.funfact-two -->
        <section class="membership-two membership-two--padding">
            <div class="container">
                <div class="sec-title">

                    <img src="/assets/images/shapes/sec-title-s-1.png" alt="Ready for spa" class="sec-title__img">


                    <h6 class="sec-title__tagline">Ready for spa</h6><!-- /.sec-title__tagline -->

                    <h3 class="sec-title__title">see the prices</h3><!-- /.sec-title__title -->
                </div><!-- /.sec-title -->
                <div class="row gutter-y-30">
                    <div class="col-md-6 col-lg-6 wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="000ms">
                        <div class="membership-two-card" style="background-image: url(/assets/images/shapes/membership-s-2-1-dark.png);">
                            <div class="membership-two-card__icon">
                                <i class="icon-herbal"></i>
                            </div><!-- /.membership-two-card__icon -->
                            <div class="membership-two-card__content">
                                <h3 class="membership-two-card__title">
                                    <a href="service-d-salt.html">Sauna relax</a>
                                </h3><!-- /.membership-two-card__title -->
                                <div class="membership-two-card__text">Lorem ipsum is simply free text</div>
                                <!-- /.membership-two-card__text -->
                            </div><!-- /.membership-two-card__content -->
                            <div class="membership-two-card__price">$29.00</div><!-- /.membership-two-card__price -->
                        </div><!-- /.membership-two-card -->
                    </div><!-- /.col-md-12 col-lg-6 -->
                    <div class="col-md-6 col-lg-6 wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="100ms">
                        <div class="membership-two-card" style="background-image: url(/assets/images/shapes/membership-s-2-1-dark.png);">
                            <div class="membership-two-card__icon">
                                <i class="icon-aromatherapy"></i>
                            </div><!-- /.membership-two-card__icon -->
                            <div class="membership-two-card__content">
                                <h3 class="membership-two-card__title">
                                    <a href="service-d-aroma.html">Aroma therapy</a>
                                </h3><!-- /.membership-two-card__title -->
                                <div class="membership-two-card__text">Lorem ipsum is simply free text</div>
                                <!-- /.membership-two-card__text -->
                            </div><!-- /.membership-two-card__content -->
                            <div class="membership-two-card__price">$69.00</div><!-- /.membership-two-card__price -->
                        </div><!-- /.membership-two-card -->
                    </div><!-- /.col-md-12 col-lg-6 -->
                    <div class="col-md-6 col-lg-6 wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="200ms">
                        <div class="membership-two-card" style="background-image: url(/assets/images/shapes/membership-s-2-1-dark.png);">
                            <div class="membership-two-card__icon">
                                <i class="icon-fire-control"></i>
                            </div><!-- /.membership-two-card__icon -->
                            <div class="membership-two-card__content">
                                <h3 class="membership-two-card__title">
                                    <a href="service-d-reflexology.html">Reflexology</a>
                                </h3><!-- /.membership-two-card__title -->
                                <div class="membership-two-card__text">Lorem ipsum is simply free text</div>
                                <!-- /.membership-two-card__text -->
                            </div><!-- /.membership-two-card__content -->
                            <div class="membership-two-card__price">$16.00</div><!-- /.membership-two-card__price -->
                        </div><!-- /.membership-two-card -->
                    </div><!-- /.col-md-12 col-lg-6 -->
                    <div class="col-md-6 col-lg-6 wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="300ms">
                        <div class="membership-two-card" style="background-image: url(/assets/images/shapes/membership-s-2-1-dark.png);">
                            <div class="membership-two-card__icon">
                                <i class="icon-stones-1"></i>
                            </div><!-- /.membership-two-card__icon -->
                            <div class="membership-two-card__content">
                                <h3 class="membership-two-card__title">
                                    <a href="service-d-thermo-stone.html">thermo stone</a>
                                </h3><!-- /.membership-two-card__title -->
                                <div class="membership-two-card__text">Lorem ipsum is simply free text</div>
                                <!-- /.membership-two-card__text -->
                            </div><!-- /.membership-two-card__content -->
                            <div class="membership-two-card__price">$43.00</div><!-- /.membership-two-card__price -->
                        </div><!-- /.membership-two-card -->
                    </div><!-- /.col-md-12 col-lg-6 -->
                    <div class="col-md-6 col-lg-6 wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="400ms">
                        <div class="membership-two-card" style="background-image: url(/assets/images/shapes/membership-s-2-1-dark.png);">
                            <div class="membership-two-card__icon">
                                <i class="icon-spa"></i>
                            </div><!-- /.membership-two-card__icon -->
                            <div class="membership-two-card__content">
                                <h3 class="membership-two-card__title">
                                    <a href="service-d-hydro-therapy.html">thai massage</a>
                                </h3><!-- /.membership-two-card__title -->
                                <div class="membership-two-card__text">Lorem ipsum is simply free text</div>
                                <!-- /.membership-two-card__text -->
                            </div><!-- /.membership-two-card__content -->
                            <div class="membership-two-card__price">$38.00</div><!-- /.membership-two-card__price -->
                        </div><!-- /.membership-two-card -->
                    </div><!-- /.col-md-12 col-lg-6 -->
                    <div class="col-md-6 col-lg-6 wow fadeInUp" data-wow-duration="1500ms" data-wow-delay="500ms">
                        <div class="membership-two-card" style="background-image: url(/assets/images/shapes/membership-s-2-1-dark.png);">
                            <div class="membership-two-card__icon">
                                <i class="icon-face-mask"></i>
                            </div><!-- /.membership-two-card__icon -->
                            <div class="membership-two-card__content">
                                <h3 class="membership-two-card__title">
                                    <a href="service-d-salt.html">face masks</a>
                                </h3><!-- /.membership-two-card__title -->
                                <div class="membership-two-card__text">Lorem ipsum is simply free text</div>
                                <!-- /.membership-two-card__text -->
                            </div><!-- /.membership-two-card__content -->
                            <div class="membership-two-card__price">$18.00</div><!-- /.membership-two-card__price -->
                        </div><!-- /.membership-two-card -->
                    </div><!-- /.col-md-12 col-lg-6 -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </section><!-- /.membership-two -->

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
                                <img src="/assets/images/team/team-1-1.jpg" alt="Eleanor Vance" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Senior Aromatherapist</h6>
                                <h3 class="team-card__title" style="font-size: 22px; margin-bottom: 15px; color: #fff;">
                                    <a href="team-details.html" style="color: #fff;">Eleanor Vance</a>
                                </h3>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(4.9/5.0)</span>
                                </div>
                                <a href="team-details.html" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>View Profile</span>
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
                                <img src="/assets/images/team/team-1-2.jpg" alt="Mike Hardson" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Lead Hydro-Therapist</h6>
                                <h3 class="team-card__title" style="font-size: 22px; margin-bottom: 15px; color: #fff;">
                                    <a href="team-details.html" style="color: #fff;">Mike Hardson</a>
                                </h3>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(5.0/5.0)</span>
                                </div>
                                <a href="team-details.html" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>View Profile</span>
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
                                <img src="/assets/images/team/team-1-3.jpg" alt="Jessica Rose" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Holistic Aesthetician</h6>
                                <h3 class="team-card__title" style="font-size: 22px; margin-bottom: 15px; color: #fff;">
                                    <a href="team-details.html" style="color: #fff;">Jessica Rose</a>
                                </h3>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(4.95/5.0)</span>
                                </div>
                                <a href="team-details.html" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>View Profile</span>
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
                                <img src="/assets/images/team/team-1-4.jpg" alt="David Miller" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Thermal & Stone Expert</h6>
                                <h3 class="team-card__title" style="font-size: 22px; margin-bottom: 15px; color: #fff;">
                                    <a href="team-details.html" style="color: #fff;">David Miller</a>
                                </h3>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(4.9/5.0)</span>
                                </div>
                                <a href="team-details.html" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>View Profile</span>
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
                                <img src="/assets/images/team/team-1-5.jpg" alt="Maya Lin" style="width: 100%; height: 320px; object-fit: cover;">
                            </div>
                            <div class="team-card__content text-center" style="padding: 25px 20px;">
                                <h6 class="team-card__designation" style="color: #c2a74e; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">Deep Tissue & Recovery Expert</h6>
                                <h3 class="team-card__title" style="font-size: 22px; margin-bottom: 15px; color: #fff;">
                                    <a href="team-details.html" style="color: #fff;">Maya Lin</a>
                                </h3>
                                <div style="margin-bottom: 20px;">
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span class="fa fa-star" style="color: #c2a74e; font-size: 12px;"></span>
                                    <span style="color: #888; font-size: 12px; margin-left: 6px;">(4.95/5.0)</span>
                                </div>
                                <a href="team-details.html" class="solox-btn solox-btn--base" style="width: 100%; text-align: center; padding: 10px 0;">
                                    <span>View Profile</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <!-- ==================== /FEATURED EXPERTS & PROFILES CAROUSEL ==================== -->

        <section class="instagram-two">
            <div class="container">
                <div
                    class="instagram-two__carousel solox-owl__carousel owl-carousel owl-theme" data-owl-options='{"items":5,"margin":10,"loop":false,"smartSpeed":700,"nav":false,"dots":false,"autoplay":true,"responsive":{"0":{"items":1},"575":{"items":2},"768":{"items":3},"992":{"items":4},"1200":{"items":5}}}'>
                    <div class="item">
                        <a href="https://www.instagram.com"><img src="/assets/images/instagram/instagram-2-1.jpg" alt="solox" /></a>
                    </div><!-- /.item -->
                    <div class="item">
                        <a href="https://www.instagram.com"><img src="/assets/images/instagram/instagram-2-2.jpg" alt="solox" /></a>
                    </div><!-- /.item -->
                    <div class="item">
                        <a href="https://www.instagram.com"><img src="/assets/images/instagram/instagram-2-3.jpg" alt="solox" /></a>
                    </div><!-- /.item -->
                    <div class="item">
                        <a href="https://www.instagram.com"><img src="/assets/images/instagram/instagram-2-4.jpg" alt="solox" /></a>
                    </div><!-- /.item -->
                    <div class="item">
                        <a href="https://www.instagram.com"><img src="/assets/images/instagram/instagram-2-5.jpg" alt="solox" /></a>
                    </div><!-- /.item -->
                </div><!-- /.slider -->
            </div><!-- /.container -->
        </section><!-- /.instagram -->
        <section class="faq-page faq-one" style="background-image: url(/assets/images/shapes/faq-bg-1.jpg);">
            <div class="container">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="faq-one__content">
                            <div class="sec-title">

                                <img src="/assets/images/shapes/sec-title-s-1.png" alt="See our faqs" class="sec-title__img">


                                <h6 class="sec-title__tagline">See our faqs</h6><!-- /.sec-title__tagline -->

                                <h3 class="sec-title__title">Things you would like to know</h3><!-- /.sec-title__title -->
                            </div><!-- /.sec-title -->
                            <!-- section-title -->
                            <div class="faq-one__content__author">
                                <div class="faq-one__content__author__thumb"><img src="/assets/images/resources/faq-1-author.jpg" alt="solox"></div>
                                <h5 class="faq-one__content__author__title">An Incredible Spa Experience</h5>
                                <p class="faq-one__content__author__text">Donec quis felis commodo orem ipsum is<br> simply free text dolor sit amet.</p>
                            </div>
                        </div><!-- /.faq-page__contact -->
                    </div><!-- /.col-lg-4 col-xl-3 -->
                    <div class="col-lg-6">
                        <div class="faq-page__accordion solox-accrodion" data-grp-name="solox-accrodion">
                            <div class="accrodion">
                                <div class="accrodion-title">
                                    <h4>
                                        What is a Direct Beauty Services?
                                        <span class="accrodion-title__icon"></span><!-- /.accrodion-title__icon -->
                                    </h4>
                                </div><!-- /.accordian-title -->
                                <div class="accrodion-content">
                                    <div class="inner">
                                        <p>
                                            There are many variations of passages the majority have suffered alteration in some fo injected humour,
                                            or randomised words believable. Phasellus a rhoncus erat.
                                        </p>
                                    </div><!-- /.accordian-content -->
                                </div>
                            </div><!-- /.accordian-item -->
                            <div class="accrodion active">
                                <div class="accrodion-title">
                                    <h4>What are the Benefits of spa & beauty?
                                        <span class="accrodion-title__icon"></span><!-- /.accrodion-title__icon -->
                                    </h4>
                                </div><!-- /.accordian-title -->
                                <div class="accrodion-content">
                                    <div class="inner">
                                        <p>
                                            There are many variations of passages the majority have suffered alteration in some fo injected humour,
                                            or randomised words believable. Phasellus a rhoncus erat.
                                        </p>
                                    </div><!-- /.accordian-content -->
                                </div>
                            </div><!-- /.accordian-item -->
                            <div class="accrodion">
                                <div class="accrodion-title">
                                    <h4>What We should do If our skin gets dry?
                                        <span class="accrodion-title__icon"></span><!-- /.accrodion-title__icon -->
                                    </h4>
                                </div><!-- /.accordian-title -->
                                <div class="accrodion-content">
                                    <div class="inner">
                                        <p>
                                            There are many variations of passages the majority have suffered alteration in some fo injected humour,
                                            or randomised words believable. Phasellus a rhoncus erat.
                                        </p>
                                    </div><!-- /.accordian-content -->
                                </div>
                            </div><!-- /.accordian-item -->
                            <div class="accrodion">
                                <div class="accrodion-title">
                                    <h4>Which ingredients are Required for skin?
                                        <span class="accrodion-title__icon"></span><!-- /.accrodion-title__icon -->
                                    </h4>
                                </div><!-- /.accordian-title -->
                                <div class="accrodion-content">
                                    <div class="inner">
                                        <p>
                                            There are many variations of passages the majority have suffered alteration in some fo injected humour,
                                            or randomised words believable. Phasellus a rhoncus erat.
                                        </p>
                                    </div><!-- /.accordian-content -->
                                </div>
                            </div><!-- /.accordian-item -->
                        </div>
                    </div><!-- /.col-lg-8 col-xl-9 -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </section><!-- /.faq-page-accordion -->
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
                                    Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet.
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
                                    Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet.
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
                                    Lorem Ipsum. Proin gravida nibh vel velit auctor aliquet.
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
                                    Lipsum is simply free text available in market.
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
                                    Lipsum is simply free text available in market.
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
                                    Lipsum is simply free text available in market.
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
                                    Lipsum is simply free text available in market.
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
                                <span class="testimonials-two__meta__name">Mike Hardson</span>
                                <span class="testimonials-two__meta__designation">Customer</span>
                            </span>
                        </a><!-- testimonial-author -->
                        <a href="#item2" class="item active-featured" data-hash="item2">
                            <span class="testimonials-two__meta-thumb" style="border: 2px solid #c2a74e; box-shadow: 0 0 12px rgba(194, 167, 78, 0.4);"><img src="/assets/images/resources/testi-1-2.jpg" alt="solox"></span>
                            <span class="testimonials-two__meta">
                                <span class="testimonials-two__meta__name">Mike Hardson</span>
                                <span class="testimonials-two__meta__designation" style="color: #c2a74e; font-weight: 600;">FEATURED • Master Therapist</span>
                            </span>
                        </a><!-- testimonial-author -->
                        <a href="#item3" class="item" data-hash="item3">
                            <span class="testimonials-two__meta-thumb"><img src="/assets/images/resources/testi-1-3.jpg" alt="solox"></span>
                            <span class="testimonials-two__meta">
                                <span class="testimonials-two__meta__name">Mike Hardson</span>
                                <span class="testimonials-two__meta__designation">Customer</span>
                            </span>
                        </a><!-- testimonial-author -->
                        <a href="#item4" class="item" data-hash="item4">
                            <span class="testimonials-two__meta-thumb"><img src="/assets/images/resources/testi-1-4.jpg" alt="solox"></span>
                            <span class="testimonials-two__meta">
                                <span class="testimonials-two__meta__name">Mike Hardson</span>
                                <span class="testimonials-two__meta__designation">Customer</span>
                            </span>
                        </a><!-- testimonial-author -->
                        <a href="#item5" class="item" data-hash="item5">
                            <span class="testimonials-two__meta-thumb"><img src="/assets/images/resources/testi-1-5.jpg" alt="solox"></span>
                            <span class="testimonials-two__meta">
                                <span class="testimonials-two__meta__name">Mike Hardson</span>
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
                                <p class="contact-one__text">There are many variations of passages of Lorem Ipsum available, but
                                    the majority have suffered simply free text available.</p><!-- /.contact-one__text -->
                                <ul class="list-unstyled contact-one__info">
                                    <li class="contact-one__info__item">
                                        <div class="contact-one__info__icon">
                                            <i class="fas fa-phone-alt"></i>
                                        </div><!-- /.contact-one__info__icon -->
                                        <div class="contact-one__info__content">
                                            <p class="contact-one__info__text">Have any Question?</p>
                                            <!-- /.contact-one__info__text -->
                                            <h4 class="contact-one__info__title"><a href="tel:+92(8800)-8960">Free +92 (8800) -
                                                    8960</a></h4><!-- /.contact-one__info__title -->
                                        </div><!-- /.contact-one__info__content -->
                                    </li>
                                    <li class="contact-one__info__item">
                                        <div class="contact-one__info__icon">
                                            <i class="fas fa-envelope"></i>
                                        </div><!-- /.contact-one__info__icon -->
                                        <div class="contact-one__info__content">
                                            <p class="contact-one__info__text">Write Email </p>
                                            <!-- /.contact-one__info__text -->
                                            <h4 class="contact-one__info__title"><a href="mailto:theserenityspakla@gmail.com">theserenityspakla@gmail.com</a></h4>
                                            <!-- /.contact-one__info__title -->
                                        </div><!-- /.contact-one__info__content -->
                                    </li>
                                    <li class="contact-one__info__item">
                                        <div class="contact-one__info__icon">
                                            <i class="fas fa-map-marker"></i>
                                        </div><!-- /.contact-one__info__icon -->
                                        <div class="contact-one__info__content">
                                            <p class="contact-one__info__text">Visit Now </p> <!-- /.contact-one__info__text -->
                                            <h4 class="contact-one__info__title"><a href="#">Sir Apollo Kaggwa Rd & Mengo, Kampala</a></h4><!-- /.contact-one__info__title -->
                                        </div><!-- /.contact-one__info__content -->
                                    </li>
                                </ul><!-- /.list-unstyled -->
                            </div><!-- /.contact-one__content -->
                        </div><!-- /.col-xl-7 -->
                        <div class="col-xl-5">
                            <form class="contact-one__form contact-form-validated form-one background-base wow fadeInUp" data-wow-duration="1500ms" action="inc/sendemail.php">
                                <div class="contact-one__form__top">
                                    <div class="sec-title">


                                        <h6 class="sec-title__tagline">Appointment</h6><!-- /.sec-title__tagline -->

                                        <h3 class="sec-title__title">book Now</h3><!-- /.sec-title__title -->
                                    </div><!-- /.sec-title -->
                                </div><!-- /.contact-one__form__top -->
                                <div class="form-one__group">
                                    <div class="form-one__control form-one__control--full">
                                        <input type="text" name="name" placeholder="Your name">
                                    </div><!-- /.form-one__control form-one__control--full -->
                                    <div class="form-one__control form-one__control--full">
                                        <input type="email" name="email" placeholder="Email address">
                                    </div><!-- /.form-one__control form-one__control--full -->
                                    <div class="form-one__control form-one__control--full">
                                        <div class="form-one__control__select">
                                            <label class="sr-only" for="language-select">Select service</label>
                                            <!-- /#language-select.sr-only -->
                                            <select class="selectpicker" id="language-select">
                                                <option value="Select service">Select service</option>
                                                <option value="Select service 01">Select service 01</option>
                                                <option value="Select service 02">Select service 02</option>
                                            </select>
                                        </div><!-- /.main-menu__language -->

                                    </div><!-- /.form-one__control form-one__control--full -->
                                    <div class="form-one__control form-one__control--full">
                                        <input class="solox-datepicker" type="text" name="date" placeholder="Select date">
                                        <i class="fa fa-calendar-alt form-one__control__icon"></i>
                                    </div><!-- /.form-one__control form-one__control--full -->
                                    <div class="form-one__control form-one__control--full">
                                        <textarea name="message" placeholder="Write  a message"></textarea><!-- /# -->
                                    </div><!-- /.form-one__control -->
                                    <div class="form-one__control form-one__control--full">
                                        <button type="submit" class="solox-btn"><span>Book now</span></button>
                                    </div><!-- /.form-one__control -->
                                </div><!-- /.form-one__group -->
                            </form>
                        </div><!-- /.col-xl-5 -->
                    </div><!-- /.row -->
                    <div class="contact-one__inner-shape">
                        <img src="/assets/images/shapes/contact-2-shape-1.png" alt="solox" />
                    </div><!-- /.contact-one__shape -->
                </div><!-- /.contact-one__inner -->
            </div><!-- /.container -->
        </section><!-- /.contact-one -->

        <section class="blog-one blog-one--home">
            <div class="container">
                <div class="sec-title">

                    <img src="/assets/images/shapes/sec-title-s-1.png" alt="From the blog" class="sec-title__img">


                    <h6 class="sec-title__tagline">From the blog</h6><!-- /.sec-title__tagline -->

                    <h3 class="sec-title__title">News & Articles</h3><!-- /.sec-title__title -->
                </div><!-- /.sec-title -->
                <div
                    class="blog-one__carousel solox-owl__carousel solox-owl__carousel--with-shadow solox-owl__carousel--basic-nav owl-carousel owl-theme" data-owl-options='{"items":1,"margin":30,"loop":false,"smartSpeed":700,"nav":false,"dots":false,"autoplay":false,"responsive":{"0":{"nav":true,"items":1},"768":{"nav":true,"items":2},"992":{"nav":true,"items":3}}}'>
                    <div class="item">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='00ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/blog/blog-1-1.png" alt="Best place of true splander">
                                <img src="/assets/images/blog/blog-1-1.png" alt="Best place of true splander">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">Best place of true splander</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="solox">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">Best place of true splander</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.item -->
                    <div class="item">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='100ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/blog/blog-1-2.png" alt="Top Skin care tips for oily skins">
                                <img src="/assets/images/blog/blog-1-2.png" alt="Top Skin care tips for oily skins">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">Top Skin care tips for oily skins</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="solox">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">Top Skin care tips for oily skins</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.item -->
                    <div class="item">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='200ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/blog/blog-1-3.png" alt="outstanding island for winter sun">
                                <img src="/assets/images/blog/blog-1-3.png" alt="outstanding island for winter sun">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">outstanding island for winter sun</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="solox">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">outstanding island for winter sun</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.item -->
                    <div class="item">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='00ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/blog/blog-1-4.png" alt="My supervisor didn't like the latest">
                                <img src="/assets/images/blog/blog-1-4.png" alt="My supervisor didn't like the latest">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">My supervisor didn't like the latest</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="solox">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">My supervisor didn't like the latest</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.item -->
                    <div class="item">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='100ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/blog/blog-1-5.png" alt="We need to build it so that it scales">
                                <img src="/assets/images/blog/blog-1-5.png" alt="We need to build it so that it scales">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">We need to build it so that it scales</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="solox">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">We need to build it so that it scales</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.item -->
                    <div class="item">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='200ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/blog/blog-1-6.png" alt="Big picture organic growth, or fast">
                                <img src="/assets/images/blog/blog-1-6.png" alt="Big picture organic growth, or fast">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">Big picture organic growth, or fast</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="solox">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">Big picture organic growth, or fast</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.item -->
                    <div class="item">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='00ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/blog/blog-1-1.png" alt="Best place of true splander">
                                <img src="/assets/images/blog/blog-1-1.png" alt="Best place of true splander">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">Best place of true splander</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="solox">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">Best place of true splander</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.item -->
                    <div class="item">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='100ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/blog/blog-1-2.png" alt="Top Skin care tips for oily skins">
                                <img src="/assets/images/blog/blog-1-2.png" alt="Top Skin care tips for oily skins">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">Top Skin care tips for oily skins</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="solox">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">Top Skin care tips for oily skins</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.item -->
                    <div class="item">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='200ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/blog/blog-1-3.png" alt="outstanding island for winter sun">
                                <img src="/assets/images/blog/blog-1-3.png" alt="outstanding island for winter sun">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">outstanding island for winter sun</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="solox">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">outstanding island for winter sun</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.item -->
                </div><!-- /.row -->
            </div><!-- /.container -->
        </section><!-- /.blog-one blog-one--page -->

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
                                <form action="#" data-url="MAILCHIMP_FORM_URL" class="footer-widget__newsletter mc-form">
                                    <input type="text" name="EMAIL" placeholder="Email address">
                                    <button type="submit" class="fas fa-paper-plane">
                                        <span class="sr-only">submit</span><!-- /.sr-only -->
                                    </button>
                                </form><!-- /.footer-widget__newsletter mc-form -->
                                <div class="mc-form__response"></div><!-- /.mc-form__response -->
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-md-6 -->
                        <div class="col-md-6 col-xl-2">
                            <div class="footer-widget footer-widget--links">
                                <h2 class="footer-widget__title">Links</h2><!-- /.footer-widget__title -->
                                <ul class="list-unstyled footer-widget__links">
                                    <li><a href="/">About</a></li>
                                    <li><a href="memberships.html">Pricing Plans</a></li>
                                    <li><a href="gift-cards.html">Promotions</a></li>
                                    <li><a href="/services">Contact</a></li>
                                </ul><!-- /.list-unstyled footer-widget__links -->
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-md-6 -->
                        <div class="col-md-6 col-xl-3">
                            <div class="footer-widget footer-widget--contact">
                                <h2 class="footer-widget__title">Contact</h2><!-- /.footer-widget__title -->
                                <ul class="list-unstyled footer-widget__info">
                                    <li> <a href="tel:+256781945510">+256 781 945 510</a></li>
                                    <li> <a href="mailto:theserenityspakla@gmail.com">theserenityspakla@gmail.com</a></li>
                                    <li> <a href="https://www.google.com/maps">Sir Apollo Kaggwa Rd & Mengo, Kampala</a></li>
                                </ul><!-- /.list-unstyled -->
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-md-6 -->
                        <div class="col-md-6 col-xl-3">
                            <div class="footer-widget footer-widget--time">
                                <h2 class="footer-widget__title">Timing</h2><!-- /.footer-widget__title -->
                                <p class="footer-widget__text">Open Daily: 9:00 AM – 11:00 PM</p>
                                <!-- /.footer-widget__text -->
                                <div class="footer-widget__social">
                                    <a href="https://twitter.com">
                                        <i class="fab fa-twitter" aria-hidden="true"></i>
                                        <span class="sr-only">Twitter</span>
                                    </a>
                                    <a href="https://facebook.com">
                                        <i class="fab fa-facebook" aria-hidden="true"></i>
                                        <span class="sr-only">Facebook</span>
                                    </a>
                                    <a href="https://pinterest.com">
                                        <i class="fab fa-pinterest-p" aria-hidden="true"></i>
                                        <span class="sr-only">Pinterest</span>
                                    </a>
                                    <a href="https://instagram.com">
                                        <i class="fab fa-instagram" aria-hidden="true"></i>
                                        <span class="sr-only">Instagram</span>
                                    </a>
                                </div><!-- /.footer-widget__social -->
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



    
    <div class="search-popup">
        <div class="search-popup__overlay search-toggler"></div>
        <!-- /.search-popup__overlay -->
        <div class="search-popup__content">
            <form role="search" method="get" class="search-popup__form" action="#">
                <input type="text" id="search" placeholder="Search Here..." />
                <button type="submit" aria-label="search submit" class="solox-btn solox-btn--base">
                    <span><i class="icon-magnifying-glass"></i></span>
                </button>
            </form>
        </div>
        <!-- /.search-popup__content -->
    </div>
    <!-- /.search-popup -->

    <a href="#" data-target="html" class="scroll-to-target scroll-to-top">
        <span class="scroll-to-top__text">back top</span>
        <span class="scroll-to-top__wrapper"><span class="scroll-to-top__inner"></span></span>
    </a>


    
          `,
        }}
      />
      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}



