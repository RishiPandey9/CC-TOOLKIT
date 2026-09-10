"use client";

import { useState } from "react";
import { submitContact, type ContactPayload } from "@/lib/firebase/contact";

const PROJECT_TYPES = ["Web Application", "AI Integration", "Full-Stack Product", "API / Backend", "Consulting", "Other"];
const BUDGETS = ["< $1K", "$1K – $5K", "$5K – $15K", "$15K+", "Let's discuss"];

export default function ContactFormClient() {
  const [form, setForm] = useState<ContactPayload>({
    name: "", email: "", projectType: "", budget: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const set = (k: keyof ContactPayload) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setStatus("loading");
    try {
      await submitContact(form);
      setStatus("success");
      setForm({ name: "", email: "", projectType: "", budget: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputCls =
    "w-full min-h-[48px] rounded-xl bg-[#fffdfa] border border-black/[0.16] px-4 py-3 text-[13px] text-[#040403] placeholder:text-black/45 focus:outline-none focus:border-[#69a65b] transition-colors duration-200 shadow-sm";
  const labelCls = "block text-[10px] font-mono font-semibold tracking-[0.18em] text-black/65 uppercase mb-1.5";

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#69a65b] text-[#040403] shadow-[0_4px_25px_rgba(105,166,91,0.5)]">
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h3 className="text-2xl font-black tracking-tight text-[#040403]">Message Dispatched!</h3>
        <p className="text-[13px] text-black/70 max-w-[32ch] font-medium leading-relaxed">
          Thanks for reaching out, Rishi will respond within 24 hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-3 flex min-h-[44px] items-center text-[11px] font-mono font-bold tracking-widest text-[#d63d21] underline underline-offset-4"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:gap-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className={labelCls}>Your Name *</label>
          <input id="cf-name" type="text" placeholder="e.g. Alex Miller" value={form.name}
            onChange={set("name")} required className={inputCls} />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelCls}>Your Email *</label>
          <input id="cf-email" type="email" placeholder="alex@company.com" value={form.email}
            onChange={set("email")} required className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-type" className={labelCls}>Project Type</label>
          <select id="cf-type" value={form.projectType} onChange={set("projectType")}
            className={`${inputCls} appearance-none cursor-pointer`}>
            <option value="">Select project scope</option>
            {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="cf-budget" className={labelCls}>Estimated Budget</label>
          <select id="cf-budget" value={form.budget} onChange={set("budget")}
            className={`${inputCls} appearance-none cursor-pointer`}>
            <option value="">Select target budget</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cf-msg" className={labelCls}>Project Details *</label>
        <textarea id="cf-msg" rows={4} placeholder="Describe the problem, timeline, or key objectives..."
          value={form.message} onChange={set("message")} required
          className={`${inputCls} resize-none py-3`} />
      </div>

      {status === "error" && (
        <p className="text-[12px] font-mono text-[#d63d21] font-semibold">
          Submission issue encountered. Please reach out directly to rishipandey3691@gmail.com.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex min-h-[48px] w-full items-center justify-center gap-3 rounded-full bg-[#69a65b] py-3.5 text-[11px] font-black tracking-widest text-[#102012] shadow-[0_6px_25px_rgba(105,166,91,0.4)] transition-[background-color,transform] duration-200 hover:bg-[#82bd70] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "TRANSMITTING..." : "START A CONVERSATION"}
        {status !== "loading" && (
          <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M1 13L13 1M13 1H5M13 1V9" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>
    </form>
  );
}

