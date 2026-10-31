import React, { useState, useEffect } from "react";
import {
  Video, Cpu, Beaker, Activity, Dumbbell, Apple, Mic,
  HeartHandshake, Siren, CalendarDays, Stethoscope, Clock,
  Heart, ArrowRight, RotateCcw, MousePointerClick, Sparkles,
  Play, Pause,
} from "lucide-react";
import { motion } from "motion/react";
import { SERVICES } from "../mockData";

const ICON_MAP = {
  Video, Cpu, Beaker, Activity, Dumbbell, Apple, Mic,
  HeartHandshake, Siren, CalendarDays, Stethoscope, Clock,
};

const renderServiceIcon = (iconName, className = "text-green-600", size = 24) => {
  const Icon = ICON_MAP[iconName] || Heart;
  return <Icon className={className} size={size} />;
};

export default function SmartServices({ onLaunch }) {
  const [flipped, setFlipped] = useState({});
  const [tilt, setTilt] = useState({});
  const [glare, setGlare] = useState({});
  const [showcase, setShowcase] = useState(false);

  const toggleFlip = (id) => setFlipped((f) => ({ ...f, [id]: !f[id] }));

  const handleMove = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt((t) => ({ ...t, [id]: { rx: -py * 18, ry: px * 18 } }));
    setGlare((g) => ({ ...g, [id]: { x: (px + 0.5) * 100, y: (py + 0.5) * 100 } }));
  };

  const handleLeave = (id) => {
    setTilt((t) => ({ ...t, [id]: { rx: 0, ry: 0 } }));
    setGlare((g) => ({ ...g, [id]: { x: 50, y: 50 } }));
  };

  // 3D Showcase: auto cascades a flip wave through every card
  useEffect(() => {
    if (!showcase) return;
    let idx = 0;
    const wave = setInterval(() => {
      const id = SERVICES[idx % SERVICES.length].id;
      setFlipped((f) => ({ ...f, [id]: true }));
      setTimeout(() => setFlipped((f) => ({ ...f, [id]: false })), 1050);
      idx += 1;
    }, 240);
    return () => clearInterval(wave);
  }, [showcase]);

  return (
    <section className="space-y-8">
      {/* Section header */}
      <div className="text-center space-y-3">
        <span className="text-[10px] bg-green-50 text-green-700 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
          <Sparkles size={11} />
          Our Smart Services
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
          Comprehensive Digital Healthcare
        </h2>
        <p className="text-xs md:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          Move your cursor to tilt a card in 3D, click to flip it, or let the
          whole grid showcase itself.
        </p>
        <button
          type="button"
          onClick={() => setShowcase((s) => !s)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition active:scale-95 cursor-pointer border ${
            showcase
              ? "bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/25"
              : "bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50"
          }`}
        >
          {showcase ? <Pause size={12} /> : <Play size={12} />}
          {showcase ? "Pause 3D Showcase" : "Play 3D Showcase"}
        </button>
      </div>

      {/* 6x2 Interactive 3D Flip Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
        {SERVICES.map((serv, i) => {
          const isFlipped = !!flipped[serv.id];
          const t = tilt[serv.id] || { rx: 0, ry: 0 };
          const g = glare[serv.id] || { x: 50, y: 50 };

          return (
            <motion.div
              key={serv.id}
              className="flip-scene min-h-[230px]"
              style={{ perspective: "1600px", animationDelay: `${(i % 6) * 0.45}s` }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.06 }}
              onMouseMove={(e) => handleMove(e, serv.id)}
              onMouseLeave={() => handleLeave(serv.id)}
            >
              {/* Tilt wrapper (fast cursor follow) */}
              <div
                className="flip-tilt"
                style={{
                  transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (showcase) setShowcase(false);
                  toggleFlip(serv.id);
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isFlipped}
                aria-label={`${serv.title}. Tap to flip.`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleFlip(serv.id);
                  }
                }}
              >
{/* Flip card (slow 3D turnover) */}
                <div
                  className="flip-card"
                  style={{
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                    transformStyle: "preserve-3d",
                    transition: "transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)",
                    willChange: "transform",
                  }}
                >
                  {/* ===== FRONT FACE ===== */}
                  <div
                    className="flip-face bg-white border border-slate-100 shadow-xs p-4 text-left hover:border-emerald-300"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="flex flex-col h-full relative">
                      <div className="flex justify-between items-start mb-3">
                        <span
                          className="size-10 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner ring-1 ring-emerald-100"
                          style={{ transform: "translateZ(46px)" }}
                        >
                          {renderServiceIcon(serv.iconName)}
                        </span>
                        {serv.badge && (
                          <span
                            className="text-[8px] bg-amber-50 text-amber-700 border border-amber-100 font-extrabold px-1.5 py-0.5 rounded uppercase"
                            style={{ transform: "translateZ(30px)" }}
                          >
                            {serv.badge}
                          </span>
                        )}
                      </div>

                      <h4
                        className="font-extrabold text-slate-800 text-[13px] tracking-tight leading-snug"
                        style={{ transform: "translateZ(28px)" }}
                      >
                        {serv.title}
                      </h4>
                      <p
                        className="text-[10px] text-gray-400 mt-1.5 leading-relaxed"
                        style={{ transform: "translateZ(16px)" }}
                      >
                        {serv.description}
                      </p>

                      <div
                        className="mt-auto pt-3 text-[9px] font-bold text-emerald-500 flex items-center gap-1"
                        style={{ transform: "translateZ(22px)" }}
                      >
                        <MousePointerClick size={10} />
                        Tap to flip
                      </div>

                      {/* Cursor-following spotlight */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-[16px]"
                        style={{
                          background: `radial-gradient(circle at ${g.x}% ${g.y}%, rgba(255,255,255,0.55), transparent 55%)`,
                          transform: "translateZ(40px)",
                        }}
                      />
                    </div>
                  </div>
{/* ===== BACK FACE ===== */}
                  <div
                    className="flip-face flip-face-back bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white p-4 text-left"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <div className="flex flex-col h-full relative">
                      <span
                        className="text-[8px] uppercase tracking-widest font-bold text-emerald-100"
                        style={{ transform: "translateZ(30px)" }}
                      >
                        EliteCare · Launch Panel
                      </span>

                      <div
                        className="mt-2.5 mb-2.5 size-9 rounded-lg bg-white/15 flex items-center justify-center ring-1 ring-white/20"
                        style={{ transform: "translateZ(44px)" }}
                      >
                        {renderServiceIcon(serv.iconName, "text-white", 18)}
                      </div>

                      <h4
                        className="font-extrabold text-[13px] leading-tight"
                        style={{ transform: "translateZ(26px)" }}
                      >
                        {serv.title}
                      </h4>
                      <p
                        className="text-[10px] text-emerald-50/90 mt-1.5 leading-relaxed"
                        style={{ transform: "translateZ(16px)" }}
                      >
                        {serv.description}
                      </p>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLaunch(serv.id);
                        }}
                        className="mt-auto w-full bg-white text-emerald-700 text-[10px] font-black rounded-lg py-2 flex items-center justify-center gap-1.5 hover:bg-emerald-50 hover:shadow-lg active:scale-95 transition cursor-pointer"
                        style={{ transform: "translateZ(34px)" }}
                      >
                        Launch Applet
                        <ArrowRight size={12} />
                      </button>

                      <span
                        className="mt-2 text-[8px] text-emerald-100/70 text-center flex items-center justify-center gap-1"
                        style={{ transform: "translateZ(18px)" }}
                      >
                        <RotateCcw size={9} />
                        Tap card to return
                      </span>

                      {/* Cursor-following spotlight (mirrored) */}
                      <div
                        className="pointer-events-none absolute inset-0 rounded-[16px]"
                        style={{
                          background: `radial-gradient(circle at ${100 - g.x}% ${100 - g.y}%, rgba(255,255,255,0.28), transparent 55%)`,
                          transform: "translateZ(38px)",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
