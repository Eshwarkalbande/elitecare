/**
 * Phase 5B — the Emergency Health Card.
 *
 * The card is OFF until the patient switches it on, and every field is a
 * separate opt-in. The screen never shows a QR code for a card that is off or
 * revoked, because a picture of a dead link would be misleading.
 */
import React, { useEffect, useState } from "react";
import { QrCode, ShieldCheck, RefreshCw, Trash2, ExternalLink, Copy } from "lucide-react";
import useT from "../../i18n";
import {
  HubSection,
  HubCard,
  HubButton,
  HubNote,
  HubMotion,
  Spinner,
  ErrorBanner,
  Field,
  inputClass,
  Pill,
  ConsentToggle,
} from "./HubUI";
import {
  getEmergencyCard,
  updateEmergencyCard,
  regenerateEmergencyCard,
  revokeEmergencyCard,
} from "../../services/wellnessService";

const FIELD_LABELS = {
  name: "Your name",
  blood_group: "Blood group",
  allergies: "Allergies",
  conditions: "Ongoing conditions",
  medicines: "Current medicines",
  emergency_contact: "Emergency contacts",
};

export default function EmergencyCard({ onBack }) {
  const { t } = useT();
  const [card, setCard] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function refresh() {
    try {
      const data = await getEmergencyCard();
      setCard(data.card || null);
    } catch (err) {
      setError(err.response?.data?.error || t("card.error", "Could not load your emergency card."));
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(nextEnabled, nextFields) {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await updateEmergencyCard({ enabled: nextEnabled, showFields: nextFields });
      await refresh();
      setMessage(t("card.saved", "Saved."));
    } catch (err) {
      setError(err.response?.data?.error || t("card.saveError", "That change could not be saved."));
    } finally {
      setBusy(false);
    }
  }

  async function regenerate() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await regenerateEmergencyCard();
      await refresh();
      setMessage(t("card.regenerated", "A new link was created. The old QR code no longer works."));
    } catch (err) {
      setError(err.response?.data?.error || t("card.regenerateError", "The link could not be recreated."));
    } finally {
      setBusy(false);
    }
  }

  async function revoke() {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await revokeEmergencyCard();
      await refresh();
      setMessage(t("card.revoked", "Card revoked. The public link now returns nothing."));
    } catch (err) {
      setError(err.response?.data?.error || t("card.revokeError", "The card could not be revoked."));
    } finally {
      setBusy(false);
    }
  }

  if (!card) {
    return (
      <HubSection title={t("card.title", "Emergency Health Card")} onBack={onBack}>
        {error ? <ErrorBanner>{error}</ErrorBanner> : <Spinner label={t("common.loading", "Loading…")} />}
      </HubSection>
    );
  }

  const fields = card.showFields || {};

  return (
    <HubSection
      badge={t("card.badge", "Phase 5B")}
      title={t("card.title", "Emergency Health Card")}
      subtitle={t(
        "card.subtitle",
        "A single read-only page a helper can open from your phone. Off by default, and you choose exactly what it shows."
      )}
      onBack={onBack}
    >
      <HubMotion className="space-y-5">
        {error && <ErrorBanner>{error}</ErrorBanner>}
        {message && <HubNote tone="ok">{message}</HubNote>}

        <HubCard
          title={t("card.switch", "Is the card switched on?")}
          description={t("card.switch.desc", "When it is off the public link returns nothing at all, and no QR code is shown.")}
          icon={ShieldCheck}
          tint={card.enabled ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"}
          right={<Pill tone={card.enabled ? "green" : "slate"}>{card.enabled ? t("card.on", "on") : t("card.off", "off")}</Pill>}
        >
          <div className="space-y-3">
            <ConsentToggle
              id="card-enabled"
              checked={card.enabled}
              onChange={(on) => save(on, fields)}
              label={t("card.switch.label", "Let anyone holding the link read this card")}
              description={t(
                "card.switch.labelDesc",
                "The link is a long random token. Without it nobody can read the card, and every view is written to the audit log with a hashed IP."
              )}
            />
            <div className="flex flex-wrap gap-2">
              <HubButton variant="secondary" size="sm" onClick={regenerate} disabled={busy}>
                <RefreshCw size={12} /> {t("card.regenerate", "Create a new link")}
              </HubButton>
              {card.enabled && (
                <HubButton variant="danger" size="sm" onClick={revoke} disabled={busy}>
                  <Trash2 size={12} /> {t("card.revoke", "Revoke now")}
                </HubButton>
              )}
            </div>
          </div>
        </HubCard>

        <HubCard
          title={t("card.fields", "What the card shows")}
          description={t("card.fields.desc", "Every box is off unless you tick it. Anything you leave off is never sent.")}
          icon={QrCode}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.keys(FIELD_LABELS).map((key) => (
              <label
                key={key}
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer"
              >
                <input
                  id={`ecard-field-${key}`}
                  name={key}
                  type="checkbox"
                  className="accent-emerald-600"
                  checked={fields[key] === true}
                  onChange={(event) => save(card.enabled, { ...fields, [key]: event.target.checked })}
                />
                <span className="text-[11px] font-sans text-slate-700">{FIELD_LABELS[key]}</span>
              </label>
            ))}
          </div>
        </HubCard>

        {card.enabled && card.qrDataUrl && (
          <HubCard
            title={t("card.qr", "Your QR code")}
            description={t("card.qr.desc", "Print it, or just show it from this screen.")}
            icon={QrCode}
          >
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <img
                src={card.qrDataUrl}
                alt={t("card.qr.alt", "Emergency card QR code")}
                className="size-48 rounded-xl border border-slate-200"
              />
              <div className="space-y-3 flex-1 w-full min-w-0">
                <Field label={t("card.link", "Public link")}>
                  <input id="ecard-public-link" name="publicLink" aria-label={t("card.link", "Public link")} className={`${inputClass} font-mono text-[10px]`} readOnly value={card.url} />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <HubButton variant="secondary" size="sm" onClick={() => navigator.clipboard?.writeText(card.url)}>
                    <Copy size={12} /> {t("card.copy", "Copy link")}
                  </HubButton>
                  <a href={card.path} target="_blank" rel="noreferrer" className="inline-flex">
                    <HubButton variant="ghost" size="sm">
                      <ExternalLink size={12} /> {t("card.preview", "Preview the public page")}
                    </HubButton>
                  </a>
                </div>
              </div>
            </div>
          </HubCard>
        )}

        <HubNote tone="warn">
          {t(
            "card.disclaimer",
            "This card is not a medical record and it is not a diagnosis. In an emergency in India, call 112 first."
          )}
        </HubNote>
      </HubMotion>
    </HubSection>
  );
}