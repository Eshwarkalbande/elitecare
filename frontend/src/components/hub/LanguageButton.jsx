/**
 * The app-wide language control (Phase 2B).
 *
 * This is the ONLY existing chrome the phase work is allowed to change, and it
 * stays visually identical to the other header pills: a bordered white pill
 * with a lucide icon. It renders nothing at all while `features.appLanguage`
 * is false, so the header is byte-for-byte the original when the flag is off.
 */
import React, { useState, useRef, useEffect } from "react";
import { Languages, Check } from "lucide-react";
import useT from "../../i18n";
import { FEATURES } from "../../config/features";

export default function LanguageButton() {
  const { t, language, setLanguage, languages } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (ref.current && ref.current.contains(event.target)) return;
      setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!FEATURES.appLanguage) return null;

  const current = languages.find((item) => item.code === language);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("common.language", "Language")}
        title={t("common.language", "Language")}
        id="btn-app-language"
        className="h-10 px-3 rounded-full border border-gray-200 bg-white hover:bg-gray-50 text-slate-600 flex items-center gap-1.5 transition cursor-pointer text-[11px] font-bold"
      >
        <Languages size={15} />
        <span className="hidden sm:inline">{current ? current.nativeLabel : "English"}</span>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-2xl rounded-2xl p-1.5 z-50"
        >
          {languages.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={item.code === language}
              onClick={() => {
                setLanguage(item.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between gap-2 text-xs cursor-pointer ${
                item.code === language
                  ? "text-green-700 bg-green-50 font-bold"
                  : "text-slate-700 hover:bg-gray-50"
              }`}
            >
              <span>
                <span className="block font-bold">{item.nativeLabel}</span>
                <span className="block text-[10px] text-slate-400">{item.label}</span>
              </span>
              {item.code === language && <Check size={13} className="text-green-600 shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}