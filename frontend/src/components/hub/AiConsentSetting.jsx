/**
 * Phase 1C (patient side) — the AI-summary consent switch.
 *
 * The single most important control in this phase, so it is a plain question
 * with a plain answer rather than a settings row: "may ELITECARE send my
 * on-file records to the AI provider to write a short brief for your doctor?"
 *
 * The default is OFF. Turning it off again takes effect immediately — the
 * server checks this flag on every read and falls back to the on-server
 * template, sending nothing to any provider.
 */
import React, { useEffect, useState } from "react";
import { Cpu, Server } from "lucide-react";
import useT from "../../i18n";
import { HubCard, HubNote, HubMotion, Spinner, ErrorBanner, ConsentToggle } from "./HubUI";
import { getProfile, updateProfile } from "../../services/patientService";

export default function AiConsentSetting() {
  const { t } = useT();
  const [consent, setConsent] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    getProfile()
      .then((data) => {
        if (!alive) return;
        const profile = data.profile || data;
        setConsent(profile.ai_summary_consent === true);
      })
      .catch((err) => alive && setError(err.response?.data?.error || t("consent.error", "Could not load this setting.")));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function change(next) {
    setBusy(true);
    setError(null);
    try {
      await updateProfile({ aiSummaryConsent: next });
      setConsent(next);
    } catch (err) {
      setError(err.response?.data?.error || t("consent.saveError", "That choice could not be saved."));
    } finally {
      setBusy(false);
    }
  }

  if (error && consent === null) return <ErrorBanner>{error}</ErrorBanner>;
  if (consent === null) return <Spinner label={t("common.loading", "Loading…")} />;

  return (
    <HubMotion>
      <HubCard
        title={t("consent.title", "AI summaries for my doctor")}
        description={t(
          "consent.desc",
          "Off by default. Your doctor still gets a short brief either way — only the wording changes."
        )}
        icon={consent ? Cpu : Server}
        tint={consent ? "bg-violet-50 text-violet-600" : "bg-slate-100 text-slate-500"}
      >
        <div className="space-y-3">
          <ConsentToggle
            id="ai-summary-consent"
            checked={consent}
            onChange={change}
            label={t(
              "consent.label",
              "Yes, ELITECARE may use an AI provider to summarise my on-file records for my doctor"
            )}
            description={t(
              "consent.labelDesc",
              "Only the records already in your file are sent: your profile, your visit reason, your history entries and your current medicines. You can turn this off at any time."
            )}
          />

          {busy && <p className="text-[10px] font-sans text-slate-400">{t("consent.saving", "Saving…")}</p>}
          {error && <ErrorBanner>{error}</ErrorBanner>}

          <HubNote tone={consent ? "info" : "ok"}>
            {consent
              ? t(
                  "consent.onState",
                  "On. The brief your doctor reads is written by the AI provider from your on-file records."
                )
              : t(
                  "consent.offState",
                  "Off. Nothing about you is sent to an AI provider. The brief is assembled on the ELITECARE server from your own records, and it says so."
                )}
          </HubNote>

          <HubNote tone="warn">
            {t(
              "consent.disclaimer",
              "An AI brief can still be wrong, and it is never a diagnosis. Please still tell your doctor anything that matters to you."
            )}
          </HubNote>
        </div>
      </HubCard>
    </HubMotion>
  );
}