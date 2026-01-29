"use client";

import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import { Fragment } from "react";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

export function ContactModal({ open, onClose }: ContactModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-4 py-10 sm:px-6">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
                <div className="space-y-2 text-center">
                  <Dialog.Title className="text-2xl font-semibold text-text">
                    Επικοινωνία
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-muted">
                    Επιλέξτε τον τρόπο που σας εξυπηρετεί καλύτερα
                  </Dialog.Description>
                </div>

                <div className="mt-6 space-y-3">
                  <a
                    href="tel:2110081112"
                    className="group flex min-h-[48px] w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primarySoft px-4 py-3 text-center text-text shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-xl"
                  >
                    <span className="text-base font-semibold">
                      📞 Καλέστε μας
                    </span>
                    <span className="text-sm text-text/90">
                      2110 081 112
                    </span>
                  </a>

                  <a
                    href="mailto:info@artofthepossible.gr"
                    className="flex min-h-[48px] w-full flex-col items-center justify-center rounded-xl border border-border bg-card/90 px-4 py-3 text-center text-text transition hover:bg-card"
                  >
                    <span className="text-base font-semibold">
                      ✉️ Στείλτε email
                    </span>
                    <span className="text-sm text-muted">info@artofthepossible.gr</span>
                  </a>

                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="flex min-h-[48px] w-full flex-col items-center justify-center rounded-xl border border-transparent bg-transparent px-4 py-3 text-center text-muted transition hover:border-border hover:bg-card/50 hover:text-text"
                  >
                    <span className="text-base font-semibold">
                      📝 Συμπληρώστε τη φόρμα
                    </span>
                    <span className="text-sm text-muted">
                      Θα σας απαντήσουμε σύντομα
                    </span>
                  </Link>
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-sm font-medium text-muted transition hover:text-text"
                  >
                    Κλείσιμο
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
