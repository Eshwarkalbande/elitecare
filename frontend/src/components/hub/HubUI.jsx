/**
 * Shared presentational kit for every section added after Phase 0.
 *
 * It exists so the new screens copy the EXISTING design language instead of
 * each inventing its own: emerald/green/slate palette, rounded-2xl/3xl cards,
 * lucide-react icons, and the same type scale (text-[10px]/text-xs/text-sm)
 * that PatientDashboard and QuickSymptomLog already use.
 *
 * Nothing here loads a new font, a new colour or a CSS file.
 */
import React from "react";
import { motion } from "motion/react";
import { ArrowLeft, Loader2, AlertTriangle, Sparkles, CheckCircle2, Info } from "lucide-react";
import useT from "../../i18n";

export function slug(value) {
  return String(value || "section")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Page shell for a Health Hub section: back button, heading, optional right slot. */
export function HubSection({ title, subtitle, onBack, actions, children, badge }) {
  const { t } = useT();
  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 p-3" id={`hub-section-${slug(title)}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="size-9 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-emerald-700 hover:border-emerald-300 transition flex items-center justify-center shrink-0 cursor-pointer"
              aria-label={t("hub.backToDashboard", "Back to dashboard")}
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <div className="min-w-0">
            {badge && (
              <span className="text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-700 inline-flex items-center gap-1.5">
                <Sparkles size={10} />
                {badge}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs font-sans text-slate-500 mt-0.5 max-w-3xl">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

/** White rounded card — the shape used by every existing dashboard panel. */
export function HubCard({
  title,
  description,
  icon: Icon,
  tint = "bg-emerald-50 text-emerald-600",
  right,
  children,
  className = "",
}) {
  return (
    <div className={`bg-white border border-slate-200/70 rounded-2xl p-5 shadow-2xs text-left ${className}`}>
      {(title || right) && (
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            {Icon && (
              <span className={`p-2 rounded-xl shrink-0 ${tint}`}>
                <Icon size={16} />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800">{title}</h3>
              {description && <p className="text-[11px] text-slate-500 font-sans leading-relaxed">{description}</p>}
            </div>
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

export function HubButton({ children, variant = "primary", size = "md", className = "", ...rest }) {
  const palette = {
    primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-700",
    danger: "bg-white border border-rose-200 text-rose-600 hover:bg-rose-50",
    dark: "bg-slate-900 hover:bg-slate-800 text-white",
    ghost: "text-slate-500 hover:text-emerald-700 hover:bg-emerald-50",
  }[variant];
  const sizing = { sm: "text-[10px] py-1.5 px-2.5 rounded-lg", md: "text-xs py-2 px-3.5 rounded-xl" }[size];
  const state = rest.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
  return (
    <button
      type="button"
      {...rest}
      className={`font-bold transition inline-flex items-center justify-center gap-1.5 ${palette} ${sizing} ${state} ${className}`}
    >
      {children}
    </button>
  );
}

export function Spinner({ label }) {
  return (
    <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-500 text-xs font-semibold">
      <Loader2 className="animate-spin text-emerald-600" size={20} />
      {label && <span>{label}</span>}
    </div>
  );
}

export function ErrorBanner({ message, onRetry, retryLabel }) {
  if (!message) return null;
  return (
    <div className="p-3 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 text-[11px] font-sans flex items-start gap-2">
      <AlertTriangle size={14} className="shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry} className="font-bold underline shrink-0 cursor-pointer">
          {retryLabel || "Try again"}
        </button>
      )}
    </div>
  );
}


export function HubNote({ children, tone = "neutral", icon: Icon }) {
  const tones = {
    neutral: { cls: "border-dashed border-gray-200 bg-gray-50 text-slate-600", icon: Info, iconCls: "text-slate-400" },
    ai: { cls: "border-emerald-100 bg-emerald-50/60 text-slate-700", icon: Sparkles, iconCls: "text-emerald-600" },
    warn: { cls: "border-amber-200 bg-amber-50 text-amber-800", icon: AlertTriangle, iconCls: "text-amber-500" },
    ok: { cls: "border-green-200 bg-green-50 text-green-800", icon: CheckCircle2, iconCls: "text-green-600" },
  }[tone];
  const Resolved = Icon || tones.icon;
  return (
    <div className={`p-3 rounded-2xl border text-[11px] font-sans leading-relaxed flex items-start gap-2 ${tones.cls}`}>
      <Resolved size={13} className={`shrink-0 mt-0.5 ${tones.iconCls}`} />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="p-6 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-center space-y-1.5">
      {Icon && <Icon size={20} className="mx-auto text-slate-300" />}
      <p className="text-xs font-bold text-slate-600">{title}</p>
      {children && <p className="text-[11px] font-sans text-slate-500 max-w-md mx-auto">{children}</p>}
    </div>
  );
}

export const inputClass =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-sans focus:outline-none focus:border-emerald-400 focus:bg-white transition";

/** Label + input, matching the form rows used across the existing panels. */
export function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block space-y-1 ${className}`}>
      {label && <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</span>}
      {children}
      {hint && <span className="block text-[10px] font-sans text-slate-400">{hint}</span>}
    </label>
  );
}

export function Pill({ children, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-600 border-slate-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    red: "bg-rose-50 text-rose-600 border-rose-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    blue: "bg-sky-50 text-sky-700 border-sky-200",
  }[tone];
  return (
    <span className={`text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded border inline-flex items-center gap-1 ${tones}`}>
      {children}
    </span>
  );
}

/** Opt-in toggle with a short plain-language consent line. */
export function ConsentToggle({ checked, onChange, label, description, id }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-2xl border border-slate-200 bg-slate-50">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        id={id}
        onClick={() => onChange(!checked)}
        className={`mt-0.5 w-10 h-5 rounded-full transition relative shrink-0 cursor-pointer ${
          checked ? "bg-emerald-500" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 size-4 bg-white rounded-full transition-all ${checked ? "left-5" : "left-0.5"}`}
        />
      </button>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-700">{label}</p>
        {description && <p className="text-[10px] font-sans text-slate-500 leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}

/** Fade/slide wrapper so new sections animate like the existing pages. */
export function HubMotion({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
