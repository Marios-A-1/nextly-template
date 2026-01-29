"use client";

import type { ReactNode } from "react";

export const CONTACT_MODAL_EVENT = "open-contact-modal";

export function openContactModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONTACT_MODAL_EVENT));
}

interface ContactModalTriggerProps {
  children: ReactNode;
  className?: string;
}

export function ContactModalTrigger({ children, className }: ContactModalTriggerProps) {
  return (
    <button
      type="button"
      onClick={openContactModal}
      className={className}
    >
      {children}
    </button>
  );
}
