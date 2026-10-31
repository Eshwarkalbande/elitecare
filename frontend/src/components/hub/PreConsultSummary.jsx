/**
 * Phase 1C — the doctor's pre-consult panel.
 *
 * It is embedded in the existing DoctorDashboard rather than replacing
 * anything: the doctor opens it for one of their own appointments and it shows
 * a short brief. Three promises the panel makes visible:
 *
 *   1. the source is always stated ("template" or "gemini"), so the doctor can
 *      tell a server-built fact sheet from an AI-written one;
 *   2. when the patient has NOT consented, the brief is built on the server
 *      from on-file data and no patient data left the server;
 *   3. the brief is a summary, never a diagnosis.
 */
import React, { useEffect, useState } from "react";
import { FileText, RefreshCw, Cpu, Server, X } from "lucide-react";
import useT from "../../i18n";
import { HubButton, HubNote, HubMotion, Spinner, ErrorBanner, Pill } from "./HubUI";
import { getPreConsultSummary } from "../../services/hubService";

export default function PreConsultSummary({ appointmentId, onClose }) {
  const { t } = useT();
  const [data, setData] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  async function load(refresh = false) {
    setBusy(true);
    setError(null);
    try {
      setData(await getPreConsultSummary(appointmentId, { refresh }));
    } catch (err) {
      setError(err.response?.data?.error || t("pre.error", "This brief could not be loaded."));
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId]);

  const isAi = data && data.source === "gemini";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3" id={`pre-consult-${appointmentId}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className={`p-2 rounded-xl shrink-0 ${isAi ? "bg-violet-50 text-violet-600" : "bg-slate-100 text-slate-500"}`}>
            {isAi ? <Cpu size={16} /> : <Server size={16} />}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              {t("pre.title", "Pre-consult summary")}
              {data && <Pill tone={isAi ? "blue" : "slate"}>{data.source}</Pill>}
            </h3>
            <p className="text-[11px] font-sans text-slate-500">
              {t("pre.subtitle", "A short brief of what is already on file for this patient.")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <HubButton variant="ghost" size="sm" onClick={() => load(true)} disabled={busy} aria-label={t("pre.refresh", "Rebuild")}>
            <RefreshCw size={12} className={busy ? "animate-spin" : ""} />
          </HubButton>
          {onClose && (
            <HubButton variant="ghost" size="sm" onClick={onClose} aria-label={t("pre.close", "Close")}>
              <X size={12} />
            </HubButton>
          )}
        </div>
      </div>

      {error && <ErrorBanner>{error}</ErrorBanner>}
      {!data && !error && <Spinner label={t("common.loading", "Loading…")} />}

      {data && (
        <HubMotion className="space-y-3">
          {/* Provenance first, so the doctor knows what they are reading. */}
          <HubNote tone={data.aiConsent ? "info" : "warn"}>
            {data.aiConsent
              ? t(
                  "pre.consentOn",
                  "The patient has switched on AI summaries. This brief may have been written by the AI provider; check anything clinical."
                )
              : t(
                  "pre.consentOff",
                  "The patient has NOT switched on AI summaries, so this brief was built on the server from on-file data only and nothing was sent to an AI provider."
                )}
          </HubNote>

          {data.note && <p className="text-[11px] font-sans text-slate-500">{data.note}</p>}

          <pre className="text-[11px] font-sans leading-relaxed text-slate-700 whitespace-pre-wrap bg-slate-50 border border-slate-200 rounded-xl p-3 max-h-96 overflow-y-auto">
            {data.summary}
          </pre>

          <div className="flex flex-wrap items-center gap-2 text-[10px] font-sans text-slate-400">
            <FileText size={11} />
            <span>
              {t("pre.generated", "Generated")}:{" "}
              {new Date(data.generatedAt || Date.now()).toLocaleString()}
            </span>
            {data.cached && <span>· {t("pre.cached", "cached")}</span>}
          </div>

          <HubNote tone="warn">
            {t(
              "pre.disclaimer",
              "This brief lists what is on file. It is not a diagnosis and it must not replace your own clinical judgement."
            )}
          </HubNote>
        </HubMotion>
      )}
    </div>
  );
}