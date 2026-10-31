import React, { useEffect, useMemo, useRef, useState } from "react";
import { Upload, Save, Share2, Trash2, Sparkles, AlertTriangle, FileText } from "lucide-react";
import useT from "../i18n";
import {
  HubSection,
  HubCard,
  HubButton,
  HubNote,
  HubMotion,
  Spinner,
  ErrorBanner,
  EmptyState,
  Field,
  inputClass,
  Pill,
} from "./hub/HubUI";
import { explainLabReport, getLabReports, saveLabReport, shareLabReport, deleteLabReport } from "../services/hubService";
import { getAppointments } from "../services/patientService";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ".jpg,.jpeg,.png,.pdf";
const STATUS_TONE = { low: "red", high: "red", normal: "green", unknown: "slate" };

/**
 * Phase 1A — Lab Report Explainer (Health Hub > Care).
 *
 * The privacy behaviour is visible in the UI on purpose:
 *   * the consent box must be ticked before anything is sent to the AI provider;
 *   * the report is NOT stored — "Save summary" is a separate, explicit tap;
 *   * the disclaimer states the AI does not diagnose.
 */
export default function LabReportExplainer({ onBack }) {
  const { t, language } = useT();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [aiLanguage, setAiLanguage] = useState(language);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState([]);
  const [savedMessage, setSavedMessage] = useState(null);
  const [savingId, setSavingId] = useState(false);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    let alive = true;
    getLabReports()
      .then((rows) => alive && setSaved(rows))
      .catch(() => alive && setSaved([]));
    // The patient may only share with a doctor they really have a visit with,
    // so the share dropdown is built from their own appointments.
    getAppointments()
      .then((rows) => {
        if (!alive || !Array.isArray(rows)) return;
        const unique = new Map();
        for (const row of rows) {
          const id = row.doctor_id ?? row.doctorId;
          const name = row.doctor_name ?? row.doctorName;
          if (id && name && !unique.has(id)) unique.set(id, name);
        }
        setDoctors(Array.from(unique, ([id, name]) => ({ id, name })));
      })
      .catch(() => alive && setDoctors([]));
    return () => {
      alive = false;
    };
  }, []);

  const flagged = useMemo(
    () => (result ? result.items.filter((item) => item.status === "low" || item.status === "high") : []),
    [result]
  );

  function pickFile(event) {
    const chosen = event.target.files && event.target.files[0];
    setError(null);
    setResult(null);
    if (!chosen) return;
    if (chosen.size > MAX_BYTES) {
      setError(t("lab.error.size", "The report must be 5 MB or smaller."));
      return;
    }
    const nameOk = /\.(jpe?g|png|pdf)$/i.test(chosen.name);
    const typeOk = ["image/jpeg", "image/png", "application/pdf"].includes(chosen.type);
    if (!nameOk && !typeOk) {
      setError(t("lab.error.type", "Choose a JPG, PNG or PDF file."));
      return;
    }
    setFile(chosen);
  }

  // Phase 2B — the app-wide language follows the header picker, so the
  // explanation arrives in the language the patient is actually reading.
  useEffect(() => setAiLanguage(language), [language]);

  async function runExplain() {
    if (!file || !consent || busy) return;
    setBusy(true);
    setError(null);
    setSavedMessage(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("language", aiLanguage);
      form.append("consent", "true");
      form.append("save", "false"); // storage happens only through the Save button
      const data = await explainLabReport(form);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.error || t("lab.error.failed", "Could not explain that report. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  async function save() {
    if (!result || savingId) return;
    setSavingId(true);
    setError(null);
    try {
      const data = await saveLabReport({
        title: file ? file.name.slice(0, 150) : t("lab.saved.untitled", "Lab report"),
        summary: result.summary,
        items: result.items,
        questionsForDoctor: result.questionsForDoctor,
        urgency: result.urgency,
        language: aiLanguage,
      });
      setSaved(await getLabReports());
      setSavedMessage(`${t("lab.saved.done", "Summary saved.")} (#${data.labReportId})`);
      setResult(null);
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      setError(err?.response?.data?.error || t("lab.error.saveFailed", "Could not save the summary."));
    } finally {
      setSavingId(false);
    }
  }

  async function share(reportId, doctorId) {
    try {
      await shareLabReport(reportId, doctorId);
      setSaved(await getLabReports());
      setSavedMessage(t("lab.shared", "Shared with your doctor."));
    } catch (err) {
      setError(err?.response?.data?.error || t("lab.error.shareFailed", "Could not share that summary."));
    }
  }

  async function remove(reportId) {
    try {
      await deleteLabReport(reportId);
      setSaved((rows) => rows.filter((row) => row.id !== reportId));
    } catch (err) {
      setError(err?.response?.data?.error || t("lab.error.deleteFailed", "Could not remove that summary."));
    }
  }


  return (
    <HubSection
      title={t("feature.labReport", "Lab Report Explainer")}
      subtitle={t(
        "lab.subtitle",
        "Upload a report and read it in plain language. Nothing is stored unless you tap Save summary."
      )}
      badge={t("hub.badge", "Your Health Hub")}
      onBack={onBack}
    >
      <HubMotion className="space-y-6">
        <HubCard title={t("lab.upload", "Upload a report")} icon={Upload}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label={t("common.language", "Language")}>
                <select id="lab-language" name="aiLanguage" className={inputClass} value={aiLanguage} onChange={(e) => setAiLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="mr">मराठी</option>
                </select>
              </Field>
              <Field label={t("lab.file", "Report file")} hint={t("lab.fileHint", "JPG, PNG or PDF — up to 5 MB.")}>
                <input id="lab-report-file" name="report" ref={fileRef} type="file" accept={ACCEPTED} onChange={pickFile} className={inputClass} />
              </Field>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 cursor-pointer">
              <input
                id="lab-consent"
                name="consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 size-4 accent-emerald-600 cursor-pointer"
              />
              <span className="text-[11px] font-sans text-slate-700 leading-relaxed">
                {t(
                  "lab.consent",
                  "I understand this report is sent to the AI provider so it can be explained to me, and that the file is not kept unless I save the summary."
                )}
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              <HubButton onClick={runExplain} disabled={!file || !consent || busy}>
                <Sparkles size={13} />
                {busy ? t("lab.explaining", "Reading your report…") : t("lab.explain", "Explain this report")}
              </HubButton>
              {file && <Pill tone="slate">{file.name}</Pill>}
              {!consent && <Pill tone="amber">{t("lab.consentRequired", "Consent needed")}</Pill>}
            </div>

            <ErrorBanner message={error} />
            {savedMessage && <HubNote tone="ok">{savedMessage}</HubNote>}
            {busy && <Spinner label={t("lab.explaining", "Reading your report…")} />}
          </div>
        </HubCard>
        {result && (
          <HubCard
            title={t("lab.result", "What your report says")}
            icon={FileText}
            right={
              <Pill tone={result.isMock ? "amber" : "green"}>
                {result.isMock ? t("common.simulated", "simulated") : t("common.ai", "AI")}
              </Pill>
            }
          >
            <div className="space-y-4">
              <p className="text-xs font-sans leading-relaxed text-slate-700 whitespace-pre-line">{result.summary}</p>

              {result.items.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] font-sans">
                    <thead>
                      <tr className="text-slate-400 uppercase text-[9px] tracking-wide">
                        <th className="py-1.5 pr-2">{t("lab.col.name", "Test")}</th>
                        <th className="py-1.5 pr-2">{t("lab.col.value", "Value")}</th>
                        <th className="py-1.5 pr-2">{t("lab.col.range", "Reference")}</th>
                        <th className="py-1.5">{t("lab.col.status", "Status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.items.map((item, index) => (
                        <tr key={`${item.name}-${index}`} className="border-t border-slate-100">
                          <td className="py-2 pr-2 font-bold text-slate-700">{item.name}</td>
                          <td className="py-2 pr-2 font-mono text-slate-700">
                            {item.value} {item.unit}
                          </td>
                          <td className="py-2 pr-2 text-slate-500">{item.referenceRange || "—"}</td>
                          <td className="py-2">
                            <Pill tone={STATUS_TONE[item.status] || "slate"}>{item.status}</Pill>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {flagged.length > 0 && (
                <HubNote tone="warn">
                  {t("lab.flagged", "Flagged rows")}: {flagged.map((item) => item.name).join(", ")} —{" "}
                  {t("lab.flaggedNote", "your doctor decides what these mean.")}
                </HubNote>
              )}

              {result.questionsForDoctor.length > 0 && (
                <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
                  <p className="text-[10px] font-black uppercase tracking-wide text-slate-500 mb-1.5">
                    {t("lab.questions", "Questions to ask your doctor")}
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px] font-sans text-slate-700">
                    {result.questionsForDoctor.map((question, index) => (
                      <li key={index}>{question}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <HubButton onClick={save} disabled={savingId || result.isMock}>
                  <Save size={13} />
                  {t("lab.saveSummary", "Save summary")}
                </HubButton>
                {result.isMock && (
                  <HubNote tone="warn">
                    {t(
                      "lab.mockNoSave",
                      "This was a simulated answer, so there is nothing real to save. Add an AI key to analyse a real report."
                    )}
                  </HubNote>
                )}
              </div>

              <HubNote tone="ai">{result.disclaimer}</HubNote>
            </div>
          </HubCard>
        )}

        <HubCard
          title={t("lab.saved.title", "Saved summaries")}
          description={t(
            "lab.saved.desc",
            "Only the summaries you saved are stored on the ELITECARE server. You can share one with a doctor you have visited, or delete it."
          )}
          icon={FileText}
        >
          {saved.length === 0 ? (
            <EmptyState icon={FileText} title={t("lab.saved.empty", "No saved summaries yet")}>
              {t("lab.saved.emptyHint", "Analyse a report and tap Save summary to keep it here.")}
            </EmptyState>
          ) : (
            <ul className="space-y-2.5">
              {saved.map((row) => (
                <li key={row.id} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{row.title}</p>
                      <p className="text-[10px] font-sans text-slate-500">
                        {new Date(row.created_at).toLocaleString()} ·{" "}
                        {t("lab.saved.items", "{count} value(s)", { count: (row.items || []).length })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {row.shared_with_doctor_at && <Pill tone="green">{t("lab.sharedBadge", "shared")}</Pill>}
                      <HubButton variant="danger" size="sm" onClick={() => remove(row.id)} aria-label="Delete summary">
                        <Trash2 size={12} />
                      </HubButton>
                    </div>
                  </div>
                  {row.summary && <p className="text-[11px] font-sans text-slate-600">{row.summary.slice(0, 240)}</p>}
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      className={`${inputClass} max-w-[14rem]`}
                      defaultValue=""
                      disabled={doctors.length === 0}
                      onChange={(event) => {
                        if (event.target.value) share(row.id, Number(event.target.value));
                        event.target.value = "";
                      }}
                    >
                      <option value="">
                        {doctors.length === 0
                          ? t("lab.share.noDoctor", "No doctor to share with yet")
                          : t("lab.share.pick", "Share with my doctor…")}
                      </option>
                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                    <HubButton variant="secondary" size="sm" onClick={() => share(row.id)}>
                      <Share2 size={12} />
                      {t("lab.share.generic", "Mark as shared")}
                    </HubButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </HubCard>

      </HubMotion>
    </HubSection>
  );
}
