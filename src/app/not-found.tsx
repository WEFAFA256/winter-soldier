import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf-root">
      <style>{`
        html, body { margin: 0 !important; padding: 0 !important; background: #0e1317 !important; }
        .nf-root * { box-sizing: border-box; }
        .nf-root {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          color: #e6edf3;
          background:
            radial-gradient(900px 480px at 50% -10%, rgba(194,167,78,0.13), transparent 70%),
            radial-gradient(500px 400px at 90% 100%, rgba(194,167,78,0.07), transparent 70%),
            #0e1317;
          font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
          text-align: center;
        }
        .nf-card { width: 100%; max-width: 540px; }
        .nf-art { filter: drop-shadow(0 18px 34px rgba(0,0,0,0.45)); animation: nf-float 5s ease-in-out infinite; }
        @keyframes nf-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-9px); } }
        @media (prefers-reduced-motion: reduce) { .nf-art { animation: none; } }
        .nf-404 {
          font-family: 'Cormorant', Georgia, serif;
          font-size: clamp(90px, 22vw, 150px);
          line-height: 0.9;
          font-weight: 700;
          letter-spacing: 2px;
          margin: 6px 0 2px;
          background: linear-gradient(135deg, #f0d98f 0%, #c2a74e 45%, #8a7330 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .nf-tag {
          display: inline-block; color: #c2a74e; font-size: 13px; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; margin-bottom: 6px;
        }
        .nf-title {
          font-family: 'Cormorant', Georgia, serif;
          font-size: clamp(28px, 6vw, 42px); line-height: 1.15; margin: 4px 0 12px; color: #fff;
        }
        .nf-copy { color: #aab3bd; font-size: 15px; line-height: 1.7; max-width: 430px; margin: 0 auto 28px; }
        .nf-actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 12px; }
        .nf-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          padding: 13px 22px; border-radius: 6px; font-size: 13px; font-weight: 700;
          letter-spacing: 0.5px; text-decoration: none; transition: transform 0.15s, filter 0.15s;
        }
        .nf-btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .nf-btn--gold { background: #c2a74e; color: #0e1317; border: 1px solid #c2a74e; }
        .nf-btn--outline { background: transparent; color: #c2a74e; border: 1px solid rgba(194,167,78,0.45); }
        .nf-foot { margin-top: 30px; color: #6f7a85; font-size: 12px; }
        .nf-foot a { color: #c2a74e; text-decoration: none; }
      `}</style>

      <div className="nf-card">
        <svg className="nf-art" width="190" height="150" viewBox="0 0 190 150" role="img" aria-label="A stack of warm massage stones with a gold leaf">
          <ellipse cx="95" cy="133" rx="66" ry="10" fill="rgba(194,167,78,0.12)" />
          <ellipse cx="95" cy="126" rx="55" ry="12" fill="#33382f" />
          <ellipse cx="95" cy="115" rx="46" ry="11" fill="#43483b" />
          <ellipse cx="95" cy="104" rx="35" ry="10" fill="#545a49" />
          <path d="M95 98 C95 66 116 49 140 48 C138 74 118 92 95 98 Z" fill="#c2a74e" />
          <path d="M95 98 C95 66 116 49 140 48" fill="none" stroke="#f0d98f" strokeWidth="1.5" opacity="0.7" />
          <path d="M95 98 C92 78 80 66 62 64 C64 82 78 94 95 98 Z" fill="#a88f3e" />
          <text x="16" y="42" fill="#c2a74e" fontSize="16">✦</text>
          <text x="166" y="30" fill="#c2a74e" fontSize="12">✦</text>
          <text x="158" y="90" fill="#c2a74e" fontSize="10" opacity="0.8">✧</text>
        </svg>

        <div className="nf-tag">A little detour</div>
        <div className="nf-404">404</div>
        <h1 className="nf-title">This page is taking a spa day.</h1>
        <p className="nf-copy">
          We couldn&apos;t find that page — it may have moved or never existed. Don&apos;t worry, your
          relaxation is still right where you left it.
        </p>
        <div className="nf-actions">
          <Link href="/" className="nf-btn nf-btn--gold">Back to home</Link>
          <Link href="/services" className="nf-btn nf-btn--outline">Explore treatments</Link>
        </div>
        <div className="nf-foot">
          Need a hand? <Link href="/booking">Book a session</Link> and we&apos;ll take it from there.
        </div>
      </div>
    </main>
  );
}
