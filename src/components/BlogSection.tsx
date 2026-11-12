"use client";
import React from "react";

const posts = [
  {
    image: "/assets/images/blog/blog-1-1.png",
    category: "Wellness",
    date: "October 28, 2026",
    title: "The Ancient Art of Hot Stone Therapy",
    excerpt:
      "Discover how volcanic basalt stones, heated to the perfect temperature, melt tension and restore energy flow throughout the body.",
    author: "Eleanor Vance",
    authorImg: "/assets/images/blog/blog-author-1-1.jpg",
    slug: "hot-stone-therapy",
  },
  {
    image: "/assets/images/blog/blog-1-2.png",
    category: "Skin Care",
    date: "October 14, 2026",
    title: "Hydro-Therapy: Water as the Ultimate Healer",
    excerpt:
      "From contrast baths to Vichy showers, water therapies offer profound physiological and psychological benefits backed by science.",
    author: "Mike Hardson",
    authorImg: "/assets/images/blog/blog-author-1-1.jpg",
    slug: "hydro-therapy-guide",
  },
  {
    image: "/assets/images/blog/blog-1-3.png",
    category: "Nutrition",
    date: "September 30, 2026",
    title: "Rituals for the Modern Healer",
    excerpt:
      "Simple daily practices — from oil pulling to lymphatic brushing — that elite athletes and executives use to optimize recovery.",
    author: "Jessica Rose",
    authorImg: "/assets/images/blog/blog-author-1-1.jpg",
    slug: "modern-healer-rituals",
  },
];

export default function BlogSection() {
  return (
    <section className="py-24 bg-spa-bg">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="font-alex text-spa-gold text-3xl mb-2">Latest News</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-bold text-white">
            From Our Wellness Journal
          </h2>
          <div className="mx-auto mt-4 w-14 h-px bg-spa-gold/60" />
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <article
              key={idx}
              className="group bg-spa-card border border-spa-border rounded-sm overflow-hidden hover:border-spa-gold/40 transition-colors duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <span className="absolute top-4 left-4 bg-spa-gold text-black text-xs font-sans font-semibold uppercase tracking-widest px-3 py-1 rounded-sm">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-500 text-xs tracking-widest uppercase mb-3">
                  {post.date}
                </p>
                <h3 className="font-cormorant text-xl font-semibold text-white mb-3 leading-snug group-hover:text-spa-gold transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  {post.excerpt}
                </p>

                {/* Author + CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorImg}
                      alt={post.author}
                      className="w-7 h-7 rounded-full object-cover border border-spa-gold/30"
                    />
                    <span className="text-xs text-gray-400">{post.author}</span>
                  </div>
                  <a
                    href={`/blog/${post.slug}`}
                    className="text-spa-gold text-xs uppercase tracking-widest hover:underline font-sans"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
