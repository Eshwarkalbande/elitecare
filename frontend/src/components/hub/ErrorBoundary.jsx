/**
 * Phase 2B — a crash guard for the main content area.
 *
 * Without this, any render-time throw inside a view takes the whole app to a
 * white screen with nothing on it. Here the tree is caught and a small message
 * is drawn in the SAME alert style VoiceAssistance already uses, plus a Reload
 * button.
 *
 * It is deliberately a no-op when nothing throws: with no error it renders
 * exactly `children`, so every existing screen looks identical.
 *
 * `App` keys it by activeTab, so moving to another view clears a crash instead
 * of leaving the recovery message stuck on screen for the rest of the session.
 */
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Keep the detail in the console for whoever is debugging; the UI stays
    // deliberately non-technical.
    console.error("ELITECARE: a view crashed and was caught by the error boundary.", error, info);
  }

  render() {
    const { error } = this.state;
    const { children } = this.props;

    if (!error) return children;

    return (
      <div
        data-error-boundary="true"
        className="p-4 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-start gap-3 text-xs text-amber-900 shadow-sm animate-in fade-in"
      >
        <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5"/>
        <div className="space-y-2 flex-1">
          <span className="font-extrabold">Something went wrong</span>
          <p className="leading-relaxed text-amber-800/90">
            This screen could not be shown. Reload the page to try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw size={12}/>
            <span>Reload</span>
          </button>
        </div>
      </div>
    );
  }
}