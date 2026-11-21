"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import CustomCursor from "@/components/CustomCursor";

export default function BlogPostPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((data: any[]) => {
        const found = Array.isArray(data)
          ? data.find((p: any) => String(p.id) === String(id))
          : null;
        setPost(found || null);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const content = String(post?.content || "");
  const read = Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(Boolean).length / 200));

  return (
    <>
      <CustomCursor />
      <main className="post-root">
        <style>{`
          .post-root * { box-sizing: border-box; }
          .post-root {
            min-height: 100vh; background: #0e1317; color: #e6edf3;
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          }
          .post-nav {
            background: rgba(14,19,23,.97); border-bottom: 1px solid rgba(194,167,78,.18);
            position: sticky; top: 0; z-index: 20;
          }
          .post-nav__inner {
            max-width: 1100px; margin: 0 auto; padding: 14px 20px;
            display: flex; align-items: center; justify-content: space-between; gap: 16px;
          }
          .post-nav__brand { display: flex; align-items: center; gap: 12px; text-decoration: none; }
          .post-nav__brand img {
            width: 44px; height: 44px; border-radius: 50%; object-fit: cover;
            border: 2px solid rgba(194,167,78,.6);
          }
          .post-nav__brand span { font-family: 'Cormorant', Georgia, serif; font-size: 21px; color: #fff; }
          .post-nav__links { display: flex; align-items: center; gap: 22px; }
          .post-nav__links a {
            color: #aab3bd; font-size: 13px; text-decoration: none; transition: color .2s;
          }
          .post-nav__links a:hover { color: #c2a74e; }
          .post-wrap { max-width: 860px; margin: 0 auto; padding: 64px 20px 90px; }
          .post-back {
            display: inline-flex; align-items: center; gap: 8px; color: #c2a74e;
            font-size: 12px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
            text-decoration: none; margin-bottom: 34px;
          }
          .post-back:hover { gap: 14px; }
          .post-tag {
            color: #c2a74e; font-size: 12px; font-weight: 700; letter-spacing: 3px;
            text-transform: uppercase; margin-bottom: 16px;
          }
          .post-title {
            font-family: 'Cormorant', Georgia, serif; font-size: clamp(34px, 6vw, 58px);
            line-height: 1.1; color: #fff; margin: 0 0 22px;
          }
          .post-meta {
            display: flex; flex-wrap: wrap; gap: 10px 20px; color: #8b949e; font-size: 13px;
            padding-bottom: 30px; border-bottom: 1px solid #2c333c; margin-bottom: 34px;
          }
          .post-meta b { color: #c2a74e; font-weight: 700; }
          .post-cover {
            width: 100%; max-height: 620px; object-fit: contain; display: block;
            background: #0b0f14; border: 1px solid #2c333c; border-radius: 10px; margin-bottom: 38px;
          }
          .post-content { color: #c7d0d9; font-size: 16px; line-height: 1.95; white-space: pre-wrap; }
          .post-content p { margin: 0 0 20px; }
          .post-end {
            margin-top: 52px; padding: 28px; border: 1px solid rgba(194,167,78,.3);
            border-radius: 10px; background: rgba(194,167,78,.06); text-align: center;
          }
          .post-end h3 {
            font-family: 'Cormorant', Georgia, serif; font-size: 28px; color: #fff; margin: 0 0 10px;
          }
          .post-end p { color: #aab3bd; font-size: 14px; margin: 0 0 20px; }
          .post-cta {
            display: inline-block; background: #c2a74e; color: #0e1317; border-radius: 6px;
            padding: 12px 22px; font-size: 13px; font-weight: 700; text-decoration: none;
          }
          .post-empty { text-align: center; padding: 80px 20px; }
          .post-empty h1 {
            font-family: 'Cormorant', Georgia, serif; font-size: 40px; color: #fff; margin: 0 0 12px;
          }
          .post-empty p { color: #aab3bd; font-size: 15px; line-height: 1.7; margin: 0 0 24px; }
          @media (max-width: 640px) {
            .post-nav__links { gap: 14px; }
            .post-nav__links a { font-size: 12px; }
            .post-wrap { padding: 40px 16px 70px; }
            .post-cover { margin-bottom: 28px; }
            .post-content { font-size: 15px; line-height: 1.85; }
          }
        `}</style>

        <nav className="post-nav">
          <div className="post-nav__inner">
            <Link href="/" className="post-nav__brand">
              <img src="/assets/logo.jpg" alt="The Serenity Spa" />
              <span>The Serenity Spa</span>
            </Link>
            <div className="post-nav__links">
              <Link href="/">Home</Link>
              <Link href="/services">Services</Link>
              <Link href="/blog">Journal</Link>
            </div>
          </div>
        </nav>

        <div className="post-wrap">
          <Link href="/blog" className="post-back">← Back to journal</Link>

          {loading ? (
            <div className="post-empty"><p style={{ color: "#8b949e" }}>Loading article…</p></div>
          ) : !post ? (
            <div className="post-empty">
              <h1>That story isn&apos;t here.</h1>
              <p>It may have been removed or the link is wrong. The rest of the journal is still waiting.</p>
              <Link href="/blog" className="post-cta">Back to journal</Link>
            </div>
          ) : (
            <article>
              <div className="post-tag">The Serenity Spa Journal</div>
              <h1 className="post-title">{post.title}</h1>
              <div className="post-meta">
                <span>By <b>{post.author || "The Serenity Spa"}</b></span>
                {post.date && <span>{post.date}</span>}
                <span>{read} min read</span>
              </div>

              {post.image && (
                <img className="post-cover" src={post.image} alt={post.title} />
              )}

              <div className="post-content"><p>{content}</p></div>

              <div className="post-end">
                <h3>Ready to unwind?</h3>
                <p>Book a session and let our team take care of the rest.</p>
                <Link href="/booking" className="post-cta">Book a session</Link>
              </div>
            </article>
          )}
        </div>
      </main>
    </>
  );
}
