"use client";

import React, { useEffect } from "react";
import CustomCursor from "@/components/CustomCursor";

export default function BlogPage() {
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).soloxInitLoad) {
      (window as any).soloxInitLoad();
    }
  }, []);

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
                            <li>
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
                            <li class="current">
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
                        <a href="#" class="search-toggler main-header__search">
                            <i class="icon-magnifying-glass" aria-hidden="true"></i>
                            <span class="sr-only">Search</span>
                        </a><!-- /.search-toggler -->
                        <a href="cart.html" class="main-header__cart">
                            <i class="icon-shopping-cart" aria-hidden="true"></i>
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
            <!-- /.page-header__bg -->
            <div class="container">
                <img src="/assets/images/shapes/page-header-s-1.png" alt="our news" class="page-header__shape">
                <ul class="solox-breadcrumb list-unstyled">
                    <li><a href="/">Home</a></li>
                    <li><span>News grid</span></li>
                </ul><!-- /.thm-breadcrumb list-unstyled -->
                <h2 class="page-header__title">our news</h2>
            </div><!-- /.container -->
        </section><!-- /.page-header -->

        <section class="blog-one blog-one--page">
            <div class="container">
                <div class="row gutter-y-30">
                    <div class="col-md-6 col-lg-4">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='000ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/backgrounds/slider-2-2.jpg" alt="Best place of true splander">
                                <img src="/assets/images/backgrounds/slider-2-2.jpg" alt="Best place of true splander">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">Best place of true splander</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="The Serenity Spa">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">Best place of true splander</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.col-md-6 col-lg-4 -->
                    <div class="col-md-6 col-lg-4">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='100ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/backgrounds/slider-2-3.jpg" alt="Top Skin care tips for oily skins">
                                <img src="/assets/images/backgrounds/slider-2-3.jpg" alt="Top Skin care tips for oily skins">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">Top Skin care tips for oily skins</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="The Serenity Spa">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">Top Skin care tips for oily skins</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.col-md-6 col-lg-4 -->
                    <div class="col-md-6 col-lg-4">
                        <div class="blog-card wow fadeInUp" data-wow-duration='1500ms' data-wow-delay='200ms'>
                            <div class="blog-card__image">
                                <img src="/assets/images/backgrounds/slider-2-1.jpg" alt="outstanding island for winter sun">
                                <img src="/assets/images/backgrounds/slider-2-1.jpg" alt="outstanding island for winter sun">
                                <a href="blog-details-right.html" class="blog-card__image__link"><span class="sr-only">outstanding island for winter sun</span>
                                    <!-- /.sr-only --></a>
                                <div class="blog-card__date"><span>28</span>
                                    July</div><!-- /.blog-card__date -->
                            </div><!-- /.blog-card__image -->
                            <div class="blog-card__content">
                                <ul class="list-unstyled blog-card__meta">
                                    <li><a href="blog-list-right.html"><img src="/assets/images/blog/blog-author-1-1.jpg" alt="The Serenity Spa">by Admin</a></li>
                                    <li><a href="blog-details-right.html"><i class="fa fa-comments"></i>2 Comments</a></li>
                                </ul><!-- /.list-unstyled blog-card__meta -->
                                <h3 class="blog-card__title"><a href="blog-details-right.html">outstanding island for winter sun</a></h3><!-- /.blog-card__title -->
                                <a href="blog-details-right.html" class="blog-card__link">
                                    Read more
                                    <i class="icon-right-arrow"></i>
                                </a><!-- /.blog-card__link -->
                            </div><!-- /.blog-card__content -->
                        </div><!-- /.blog-card -->
                    </div><!-- /.col-md-6 col-lg-4 -->
                    </div><!-- /.row -->
            </div><!-- /.container -->
        </section><!-- /.blog-one blog-one--page -->

        <footer class="main-footer background-black">
            <div class="main-footer__bg background-black" style="background-image: url(assets/images/shapes/footer-bg-1-1.png);"></div>
            <!-- /.main-footer__bg -->
            <div class="main-footer__top">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 col-xl-4">
                            <div class="footer-widget footer-widget--about">
                                <a href="/" class="footer-widget__logo">
                                    <img src="/assets/images/logo-light.png" width="155" alt="The Serenity Spa HTML Template">
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
                                    <li> <a href="tel:+92(8800)-6930">+256 781 945 510</a></li>
                                    <li> <a href="mailto:theserenityspakla@gmail.com">theserenityspakla@gmail.com</a></li>
                                    <li> <a href="https://www.google.com/maps">Sir Apollo Kaggwa Rd & Mengo, Kampala</a></li>
                                </ul><!-- /.list-unstyled -->
                            </div><!-- /.footer-widget -->
                        </div><!-- /.col-md-6 -->
                        <div class="col-md-6 col-xl-3">
                            <div class="footer-widget footer-widget--time">
                                <h2 class="footer-widget__title">Timing</h2><!-- /.footer-widget__title -->
                                <p class="footer-widget__text">Mon to Sat: 9:00am – 6:00pm Sunday: Closed</p>
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
                            &copy; Copyright <span class="dynamic-year"></span> by The Serenity Spa HTML Template.
                        </p>
                    </div><!-- /.main-footer__inner -->
                </div><!-- /.container -->
            </div><!-- /.main-footer__bottom -->
        </footer><!-- /.main-footer -->

    </div><!-- /.page-wrapper -->
<div class="mobile-nav__wrapper">
        <div class="mobile-nav__overlay mobile-nav__toggler"></div>
        <!-- /.mobile-nav__overlay -->
        <div class="mobile-nav__content">
            <span class="mobile-nav__close mobile-nav__toggler"><i class="fa fa-times"></i></span>

            <div class="logo-box">
                <a href="/" aria-label="logo image"><img src="/assets/images/logo-light.png" width="155" alt="" /></a>
            </div>
            <!-- /.logo-box -->
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
            <!-- /.mobile-nav__container -->

            <ul class="mobile-nav__contact list-unstyled">
                <li>
                    <i class="fa fa-envelope"></i>
                    <a href="mailto:needhelp@The Serenity Spa.com">needhelp@The Serenity Spa.com</a>
                </li>
                <li>
                    <i class="fa fa-phone-alt"></i>
                    <a href="tel:666-888-0000">666 888 0000</a>
                </li>
            </ul><!-- /.mobile-nav__contact -->
            <div class="mobile-nav__social">
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
            </div><!-- /.mobile-nav__social -->
        </div>
        <!-- /.mobile-nav__content -->
    </div>
    <!-- /.mobile-nav__wrapper -->
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
    </>
  );
}
