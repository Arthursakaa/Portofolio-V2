import React from "react";
import Image from "next/image";

/**
 * Custom thematic pixel-retro visual illustrations & interactive system diagrams
 * for each project and engineering capability so the portfolio feels visually rich,
 * never text-only.
 */

export function ProjectVisualBanner({
  projectId,
  imageUrl,
  title,
}: {
  projectId: string;
  imageUrl?: string;
  title?: string;
}) {
  if (imageUrl) {
    return (
      <div className="relative w-full h-full bg-[#edf4fd]">
        <Image
          src={imageUrl}
          alt={title ? `${title} website preview` : `${projectId} website preview`}
          fill
          sizes="(max-width: 768px) 100vw, 560px"
          className="object-contain"
        />
      </div>
    );
  }

  switch (projectId) {
    case "fitnessvals":
      return (
        <svg
          viewBox="0 0 480 200"
          className="w-full h-full object-cover"
          role="img"
          aria-label="FitnessVals AI Gym & Health Dashboard Illustration"
        >
          {/* Background */}
          <rect width="480" height="200" fill="#1e293b" />
          {/* Pixel Grid */}
          <path
            d="M0 40h480M0 80h480M0 120h480M0 160h480M80 0v200M160 0v200M240 0v200M320 0v200M400 0v200"
            stroke="#334155"
            strokeWidth="1"
          />
          {/* Window Chrome */}
          <rect x="20" y="16" width="440" height="168" fill="#0f172a" stroke="#2b2723" strokeWidth="3" />
          <rect x="20" y="16" width="440" height="24" fill="#ea580c" />
          <rect x="28" y="23" width="10" height="10" fill="#fffdf9" />
          <rect x="44" y="23" width="10" height="10" fill="#eab308" />
          <rect x="60" y="23" width="10" height="10" fill="#10b981" />
          <text x="84" y="32" fill="#fffdf9" fontFamily="monospace" fontSize="10" fontWeight="bold">
            FITNESSVALS // AI GYM DASHBOARD (LARAVEL 12 + GO)
          </text>

          {/* Left Card: Heart Rate / Realtime WebSocket */}
          <rect x="34" y="52" width="195" height="118" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
          <text x="46" y="70" fill="#38bdf8" fontFamily="monospace" fontSize="10" fontWeight="bold">
            LIVE BIOMETRICS [WS]
          </text>
          {/* Pixel Heart */}
          <path
            d="M196 60h4v4h-4zM204 60h4v4h-4zM192 64h16v4h-16zM192 68h16v4h-16zM196 72h8v4h-8zM200 76h4v4h-4z"
            fill="#f43f5e"
          />
          {/* Pulse Graph Line */}
          <polyline
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            points="46,120 75,120 88,92 102,144 118,84 132,128 148,112 214,112"
          />
          <rect x="46" y="142" width="76" height="16" fill="#10b981" />
          <text x="52" y="153" fill="#0f172a" fontFamily="monospace" fontSize="9" fontWeight="bold">
            138 BPM • OK
          </text>

          {/* Right Card: Go Microservice & AI Workout Planner */}
          <rect x="244" y="52" width="202" height="54" fill="#1e293b" stroke="#eab308" strokeWidth="2" />
          <text x="254" y="69" fill="#eab308" fontFamily="monospace" fontSize="10" fontWeight="bold">
            AI WORKOUT ENGINE
          </text>
          <rect x="254" y="78" width="140" height="8" fill="#334155" />
          <rect x="254" y="78" width="112" height="8" fill="#eab308" />
          <text x="402" y="86" fill="#fffdf9" fontFamily="monospace" fontSize="9">
            80%
          </text>

          <rect x="244" y="116" width="202" height="54" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
          <text x="254" y="133" fill="#10b981" fontFamily="monospace" fontSize="10" fontWeight="bold">
            GO 1.25 METRICS NODE
          </text>
          {/* Bar Chart */}
          <rect x="256" y="148" width="16" height="14" fill="#38bdf8" />
          <rect x="280" y="142" width="16" height="20" fill="#38bdf8" />
          <rect x="304" y="138" width="16" height="24" fill="#10b981" />
          <rect x="328" y="144" width="16" height="18" fill="#38bdf8" />
          <text x="356" y="156" fill="#cbd5e1" fontFamily="monospace" fontSize="9">
            2.4ms latency
          </text>
        </svg>
      );

    case "edubot":
      return (
        <svg
          viewBox="0 0 480 200"
          className="w-full h-full object-cover"
          role="img"
          aria-label="EduBot Machine Learning VAK Learning Style Analyzer Illustration"
        >
          <rect width="480" height="200" fill="#eff6ff" />
          <path
            d="M0 40h480M0 80h480M0 120h480M0 160h480M80 0v200M160 0v200M240 0v200M320 0v200M400 0v200"
            stroke="#dbeafe"
            strokeWidth="1"
          />
          <rect x="20" y="16" width="440" height="168" fill="#fffdf9" stroke="#2b2723" strokeWidth="3" />
          <rect x="20" y="16" width="440" height="24" fill="#2563eb" />
          <text x="34" y="32" fill="#fffdf9" fontFamily="monospace" fontSize="10" fontWeight="bold">
            EDUBOT // VAK ANALYZER (EXPRESS.JS + MYSQL + FLASK ML)
          </text>

          {/* Left: AI Bot / Neural Classifier */}
          <rect x="36" y="54" width="130" height="114" fill="#f4efe6" stroke="#2b2723" strokeWidth="2" />
          {/* Pixel Robot Head */}
          <rect x="76" y="68" width="50" height="36" fill="#38bdf8" stroke="#2b2723" strokeWidth="2" />
          <rect x="86" y="78" width="8" height="8" fill="#2b2723" />
          <rect x="108" y="78" width="8" height="8" fill="#2b2723" />
          <rect x="88" y="92" width="26" height="4" fill="#2b2723" />
          <rect x="97" y="58" width="8" height="10" fill="#ea580c" stroke="#2b2723" strokeWidth="2" />
          <text x="101" y="124" textAnchor="middle" fill="#2b2723" fontFamily="monospace" fontSize="9" fontWeight="bold">
            VAK CLASSIFIER
          </text>
          <rect x="52" y="134" width="98" height="20" fill="#10b981" stroke="#2b2723" strokeWidth="1.5" />
          <text x="101" y="147" textAnchor="middle" fill="#fffdf9" fontFamily="monospace" fontSize="9" fontWeight="bold">
            MODEL: ACTIVE
          </text>

          {/* Right: VAK Result Bars */}
          <rect x="182" y="54" width="262" height="114" fill="#f8fafc" stroke="#2b2723" strokeWidth="2" />
          <text x="196" y="74" fill="#2b2723" fontFamily="monospace" fontSize="10" fontWeight="bold">
            DIAGNOSTIC OUTPUT (V-A-K SCORE)
          </text>

          {/* Visual */}
          <text x="196" y="96" fill="#2563eb" fontFamily="monospace" fontSize="9" fontWeight="bold">
            VISUAL
          </text>
          <rect x="268" y="86" width="156" height="12" fill="#e2e8f0" stroke="#2b2723" strokeWidth="1.5" />
          <rect x="268" y="86" width="128" height="12" fill="#2563eb" />

          {/* Auditory */}
          <text x="196" y="122" fill="#ea580c" fontFamily="monospace" fontSize="9" fontWeight="bold">
            AUDITORY
          </text>
          <rect x="268" y="112" width="156" height="12" fill="#e2e8f0" stroke="#2b2723" strokeWidth="1.5" />
          <rect x="268" y="112" width="92" height="12" fill="#ea580c" />

          {/* Kinesthetic */}
          <text x="196" y="148" fill="#10b981" fontFamily="monospace" fontSize="9" fontWeight="bold">
            KINESTHETIC
          </text>
          <rect x="268" y="138" width="156" height="12" fill="#e2e8f0" stroke="#2b2723" strokeWidth="1.5" />
          <rect x="268" y="138" width="110" height="12" fill="#10b981" />
        </svg>
      );

    case "debouquets":
      return (
        <svg
          viewBox="0 0 480 200"
          className="w-full h-full object-cover"
          role="img"
          aria-label="Debouquets Floral E-Commerce Platform Illustration"
        >
          <rect width="480" height="200" fill="#fdf2f8" />
          <rect x="20" y="16" width="440" height="168" fill="#fffdf9" stroke="#2b2723" strokeWidth="3" />
          <rect x="20" y="16" width="440" height="24" fill="#be185d" />
          <text x="34" y="32" fill="#fffdf9" fontFamily="monospace" fontSize="10" fontWeight="bold">
            DEBOUQUETS // FULL-STACK E-COMMERCE (LARAVEL + MYSQL)
          </text>

          {/* Product Cards */}
          {[0, 1, 2].map((idx) => {
            const x = 36 + idx * 140;
            return (
              <g key={idx}>
                <rect x={x} y="52" width="126" height="116" fill="#f4efe6" stroke="#2b2723" strokeWidth="2" />
                <rect x={x + 10} y="62" width="106" height="52" fill="#fbcfe8" stroke="#2b2723" strokeWidth="1.5" />
                {/* Pixel Flower */}
                <rect x={x + 58} y="74" width="10" height="10" fill="#eab308" />
                <rect x={x + 48} y="74" width="10" height="10" fill="#ec4899" />
                <rect x={x + 68} y="74" width="10" height="10" fill="#ec4899" />
                <rect x={x + 58} y="64" width="10" height="10" fill="#ec4899" />
                <rect x={x + 58} y="84" width="10" height="10" fill="#ec4899" />
                <rect x={x + 60} y="94" width="6" height="16" fill="#10b981" />

                <rect x={x + 10} y="122" width="70" height="8" fill="#2b2723" />
                <rect x={x + 10} y="138" width="106" height="20" fill="#10b981" stroke="#2b2723" strokeWidth="1.5" />
                <text x={x + 63} y="151" textAnchor="middle" fill="#fffdf9" fontFamily="monospace" fontSize="8" fontWeight="bold">
                  + ADD TO CART
                </text>
              </g>
            );
          })}
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 480 200"
          className="w-full h-full object-cover"
          role="img"
          aria-label="Interactive Web Portfolio Illustration"
        >
          <rect width="480" height="200" fill="#f4efe6" />
          <rect x="20" y="16" width="440" height="168" fill="#fffdf9" stroke="#2b2723" strokeWidth="3" />
          <rect x="20" y="16" width="440" height="24" fill="#2b2723" />
          <text x="34" y="32" fill="#fffdf9" fontFamily="monospace" fontSize="10" fontWeight="bold">
            WEBCV // INTERACTIVE BENTO PORTFOLIO (REACT + VITE)
          </text>
          <rect x="36" y="52" width="180" height="116" fill="#e9e2d5" stroke="#2b2723" strokeWidth="2" />
          <rect x="50" y="68" width="90" height="12" fill="#ea580c" />
          <rect x="50" y="88" width="140" height="8" fill="#2b2723" />
          <rect x="50" y="102" width="120" height="8" fill="#575049" />
          <rect x="50" y="134" width="80" height="20" fill="#2563eb" />

          <rect x="228" y="52" width="216" height="54" fill="#f4efe6" stroke="#2b2723" strokeWidth="2" />
          <rect x="242" y="66" width="80" height="10" fill="#10b981" />
          <rect x="242" y="84" width="160" height="8" fill="#2b2723" />

          <rect x="228" y="114" width="104" height="54" fill="#dbeafe" stroke="#2b2723" strokeWidth="2" />
          <rect x="340" y="114" width="104" height="54" fill="#fef3c7" stroke="#2b2723" strokeWidth="2" />
        </svg>
      );
  }
}

export function EngineeringPillarIllustration({ type }: { type: "fullstack" | "backend" | "ai" }) {
  if (type === "fullstack") {
    return (
      <svg viewBox="0 0 64 64" className="w-12 h-12 shrink-0" aria-hidden="true">
        <rect x="4" y="8" width="56" height="48" fill="#fffdf9" stroke="#2b2723" strokeWidth="4" />
        <rect x="4" y="8" width="56" height="12" fill="#ea580c" stroke="#2b2723" strokeWidth="4" />
        <rect x="12" y="28" width="18" height="20" fill="#38bdf8" stroke="#2b2723" strokeWidth="3" />
        <rect x="36" y="28" width="16" height="8" fill="#10b981" stroke="#2b2723" strokeWidth="3" />
        <rect x="36" y="40" width="16" height="8" fill="#eab308" stroke="#2b2723" strokeWidth="3" />
      </svg>
    );
  }
  if (type === "backend") {
    return (
      <svg viewBox="0 0 64 64" className="w-12 h-12 shrink-0" aria-hidden="true">
        <rect x="8" y="8" width="48" height="14" fill="#2563eb" stroke="#2b2723" strokeWidth="4" />
        <rect x="14" y="13" width="4" height="4" fill="#fffdf9" />
        <rect x="22" y="13" width="4" height="4" fill="#10b981" />
        <rect x="8" y="25" width="48" height="14" fill="#38bdf8" stroke="#2b2723" strokeWidth="4" />
        <rect x="14" y="30" width="4" height="4" fill="#fffdf9" />
        <rect x="22" y="30" width="4" height="4" fill="#10b981" />
        <rect x="8" y="42" width="48" height="14" fill="#10b981" stroke="#2b2723" strokeWidth="4" />
        <rect x="14" y="47" width="4" height="4" fill="#2b2723" />
        <rect x="22" y="47" width="4" height="4" fill="#fffdf9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 64 64" className="w-12 h-12 shrink-0" aria-hidden="true">
      <rect x="14" y="16" width="36" height="32" fill="#8b5cf6" stroke="#2b2723" strokeWidth="4" />
      <rect x="28" y="6" width="8" height="10" fill="#ea580c" stroke="#2b2723" strokeWidth="3" />
      <rect x="22" y="24" width="6" height="6" fill="#fffdf9" />
      <rect x="36" y="24" width="6" height="6" fill="#fffdf9" />
      <rect x="22" y="36" width="20" height="4" fill="#10b981" />
      <rect x="6" y="26" width="8" height="12" fill="#eab308" stroke="#2b2723" strokeWidth="3" />
      <rect x="50" y="26" width="8" height="12" fill="#eab308" stroke="#2b2723" strokeWidth="3" />
    </svg>
  );
}

