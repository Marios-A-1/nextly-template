"use client";

import { useRef, useState, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

const fields = [
  { name: "name", label: "Ονοματεπώνυμο", type: "text", autoComplete: "name", maxLength: 120 },
  { name: "email", label: "Email", type: "email", autoComplete: "email", maxLength: 254 },
  { name: "phone", label: "Τηλέφωνο", type: "tel", autoComplete: "tel", maxLength: 32 },
] as const;

const networkError = "Το αίτημα δεν στάλθηκε. Δοκιμάστε ξανά ή καλέστε την κλινική.";

export function ContactForm() {
  const sending = useRef(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    sending.current = true;
    setStatus("sending");
    setFeedback("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, pageUrl: window.location.href }),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        setStatus("error");
        setFeedback(result.message || networkError);
        return;
      }

      form.reset();
      setStatus("success");
      setFeedback(result.message);
    } catch {
      setStatus("error");
      setFeedback(networkError);
    } finally {
      sending.current = false;
    }
  }

  return (
    <form className="space-y-3" onSubmit={submit} aria-busy={status === "sending"}>
      <input name="botcheck" hidden tabIndex={-1} autoComplete="off" />
      {fields.map(({ label, ...field }) => (
        <label key={field.name} className="block space-y-1 text-sm font-semibold">
          <span>{label}</span>
          <Input {...field} required />
        </label>
      ))}
      <label className="block space-y-1 text-sm font-semibold">
        <span>Μήνυμα</span>
        <Textarea name="message" required maxLength={3000} rows={3} />
      </label>
      <AnimatedButton type="submit" disabled={status === "sending"} className="min-h-11">
        {status === "sending" ? "Αποστολή…" : "Αποστολή αιτήματος"}
      </AnimatedButton>
      {feedback && (
        <p role={status === "error" ? "alert" : "status"} className={status === "error" ? "text-sm text-red-800" : "text-sm text-bronze"}>
          {feedback}
        </p>
      )}
    </form>
  );
}
