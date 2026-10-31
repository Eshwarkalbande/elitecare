import React from "react";
import {
  HeartPulse,
  ArrowLeft,
  ArrowRight,
  Languages,
  Beaker,
  Activity,
  Siren,
  Trophy,
  Watch,
  FileText,
  Bell,
  Gift,
  QrCode,
  Sparkles,
  Cpu,
  Users,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { FEATURES } from "../config/features";
import useT from "../i18n";

/**
 * Health Hub (Phase 0) — the single grouped entry point for every new patient
 * section. Each group card only lists the features whose flag in
 * `src/config/features.js` is `true`; a group with nothing switched on yet shows
 * a small "switched off for now" placeholder, so the view grows phase by phase
 * without ever rendering a half-built screen.
 *
 * Visual language mirrors the existing QuickSymptomLog panel (emerald/green/
 * slate, rounded cards, lucide icons). The page transition is inherited from
 * App.jsx's AnimatePresence wrapper.
 */
const GROUPS = [
  {
    id: "care",
    titleKey: "group.care",
    descKey: "group.care.desc",
    icon: Beaker,
    tint: "bg-emerald-50 text-emerald-600",
    features: [
      {
        flag: "labReportExplainer",
        tab: "Lab Report Explainer",
        titleKey: "feature.labReport",
        descKey: "feature.labReport.desc",
        icon: FileText,
      },
      {
        flag: "preConsultSummary",
        tab: "AI Consent",
        titleKey: "feature.preConsult",
        descKey: "feature.preConsult.desc",
        icon: Cpu,
      },
      {
        flag: "familyProfiles",
        tab: "Family Profiles",
        titleKey: "feature.family",
        descKey: "feature.family.desc",
        icon: Users,
      },
    ],
  },
  {
    id: "track",
    titleKey: "group.track",
    descKey: "group.track.desc",
    icon: Activity,
    tint: "bg-green-50 text-green-600",
    features: [
      {
        flag: "medicineReminders",
        tab: "Medicine Reminders",
        titleKey: "feature.medicineReminders",
        descKey: "feature.medicineReminders.desc",
        icon: Bell,
      },
      {
        flag: "healthTracker",
        tab: "Health Tracker",
        titleKey: "feature.healthTracker",
        descKey: "feature.healthTracker.desc",
        icon: Activity,
      },
    ],
  },
  {
    id: "safety",
    titleKey: "group.safety",
    descKey: "group.safety.desc",
    icon: Siren,
    tint: "bg-rose-50 text-rose-600",
    features: [
      {
        flag: "emergencySos",
        tab: "Emergency SOS",
        titleKey: "feature.sos",
        descKey: "feature.sos.desc",
        icon: Siren,
      },
      {
        flag: "emergencyCard",
        tab: "Emergency Health Card",
        titleKey: "feature.emergencyCard",
        descKey: "feature.emergencyCard.desc",
        icon: QrCode,
      },
    ],
  },
  {
    id: "rewards",
    titleKey: "group.rewards",
    descKey: "group.rewards.desc",
    icon: Trophy,
    tint: "bg-amber-50 text-amber-600",
    features: [
      {
        flag: "rewardsLedger",
        tab: "Rewards & Challenges",
        titleKey: "feature.rewards",
        descKey: "feature.rewards.desc",
        icon: Gift,
      },
      {
        flag: "referrals",
        tab: "Referrals",
        titleKey: "feature.referrals",
        descKey: "feature.referrals.desc",
        icon: UserPlus,
      },
    ],
  },
  {
    id: "language",
    titleKey: "group.language",
    descKey: "group.language.desc",
    icon: Languages,
    tint: "bg-sky-50 text-sky-600",
    features: [
      {
        flag: "healthTranslator",
        tab: "Health Translator",
        titleKey: "feature.translator",
        descKey: "feature.translator.desc",
        icon: Languages,
      },
    ],
  },
  {
    id: "devices",
    titleKey: "group.devices",
    descKey: "group.devices.desc",
    icon: Watch,
    tint: "bg-slate-100 text-slate-600",
    features: [
      {
        flag: "wearables",
        tab: "Wearables",
        titleKey: "feature.wearables",
        descKey: "feature.wearables.desc",
        icon: Watch,
      },
    ],
  },
];

export default function HealthHub({ onNavigate, onBack }) {
  const { t, language, setLanguage, languages } = useT();

  return (
    <div
      className="max-w-7xl mx-auto space-y-8 px-4 py-8 text-left font-sans animate-in fade-in duration-200"
      id="health-hub-page"
    >
      {/* Header — same treatment as the existing feature panels */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] bg-green-50 text-green-700 border border-green-100 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
            {t("hub.badge")}
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <HeartPulse className="text-green-600" size={24} />
            {t("hub.title")}
          </h2>
          <p className="text-xs text-gray-500 font-sans max-w-2xl">{t("hub.subtitle")}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Language selector — only the new Health Hub screens are translated */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-2.5 py-1.5">
            <Languages size={13} className="text-slate-400" />
            <label htmlFor="health-hub-language" className="sr-only">
              {t("common.language")}
            </label>
            <select
              id="health-hub-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="text-[11px] font-bold bg-transparent text-slate-700 focus:outline-none cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.nativeLabel}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="text-[10px] uppercase font-black tracking-wider text-slate-500 hover:text-emerald-700 bg-white border border-gray-200 px-3 py-2 rounded-xl transition cursor-pointer flex items-center gap-1.5"
            id="btn-health-hub-back"
          >
            <ArrowLeft size={13} />
            {t("hub.backToDashboard")}
          </button>
        </div>
      </div>

      {/* Grouped section cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {GROUPS.map((group) => {
          const GroupIcon = group.icon;
          const available = group.features.filter((f) => FEATURES[f.flag] === true);

          return (
            <div
              key={group.id}
              className="bg-white border border-gray-200 shadow-xl rounded-3xl p-6 space-y-4"
              id={`health-hub-group-${group.id}`}
            >
              <div className="flex items-start gap-3 border-b border-gray-100 pb-3">
                <span className={`p-2 rounded-xl shrink-0 ${group.tint}`}>
                  <GroupIcon size={18} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                    {t(group.titleKey)}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-sans leading-relaxed">{t(group.descKey)}</p>
                </div>
                {available.length > 0 && (
                  <span className="ml-auto text-[9px] font-bold text-slate-400 bg-slate-50 border border-slate-100 rounded px-2 py-0.5 shrink-0">
                    {t("hub.sectionCount", { count: available.length })}
                  </span>
                )}
              </div>

              {available.length > 0 ? (
                <div className="space-y-2.5">
                  {available.map((feature) => {
                    const FeatureIcon = feature.icon;
                    return (
                      <button
                        key={feature.flag}
                        type="button"
                        onClick={() => onNavigate && onNavigate(feature.tab)}
                        className="w-full text-left p-3 rounded-2xl border border-slate-200/60 bg-slate-50 hover:bg-white hover:border-emerald-300 transition flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <span className="size-8 rounded-lg bg-white border border-slate-200/70 text-emerald-600 flex items-center justify-center shrink-0">
                            <FeatureIcon size={15} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-xs font-bold text-slate-800 truncate">
                              {t(feature.titleKey)}
                            </span>
                            <span className="block text-[10px] text-slate-500 font-sans truncate">
                              {t(feature.descKey)}
                            </span>
                          </span>
                        </span>
                        <ArrowRight size={14} className="text-slate-400 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-5 rounded-2xl border border-dashed border-gray-200 bg-gray-50 text-xs font-sans text-slate-500">
                  {t("hub.comingSoonCard")}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Consent + safety note — repeated by every AI-backed section */}
      <div className="p-5 rounded-3xl border border-dashed border-gray-200 bg-gray-50 space-y-2">
        <span className="text-[9px] uppercase tracking-widest font-extrabold px-2.5 py-0.5 rounded bg-white border inline-flex items-center gap-1.5 text-gray-500">
          <Sparkles size={11} className="text-emerald-600" />
          AI &amp; safety
        </span>
        <p className="text-[11px] font-sans leading-relaxed text-slate-600">{t("hub.aiConsent")}</p>
        <p className="text-[11px] font-sans leading-relaxed font-bold text-slate-700">{t("hub.disclaimer")}</p>
      </div>

    </div>
  );
}
