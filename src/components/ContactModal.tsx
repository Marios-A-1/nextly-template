"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface ContactModalProps {
  open: boolean;
  onClose: () => void;
}

type ViewState = "menu" | "form";

export function ContactModal({ open, onClose }: ContactModalProps) {
  const [view, setView] = useState<ViewState>("menu");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useForm({
    mode: "onTouched",
  });

  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!open) {
      setView("menu");
      setIsSuccess(false);
      setMessage("");
      reset();
    }
  }, [open, reset]);

  const onSubmit = async (data: any, e: any) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(
          {
            ...data,
            pageUrl:
              typeof window !== "undefined" ? window.location.href : undefined,
          },
          null,
          2
        ),
      });

      const json = await response.json().catch(() => null);
      if (response.ok && json?.success !== false) {
        setIsSuccess(true);
        setMessage(
          json?.message || "Ευχαριστούμε! Θα επικοινωνήσουμε μαζί σας σύντομα."
        );
        e.target.reset();
        reset();
      } else {
        setIsSuccess(false);
        setMessage(json?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage("Network error. Please try again.");
      console.log(error);
    }
  };

  const email = "info@artofthepossible.gr";
  const gmailHref = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}`;

  const handleClose = () => {
    onClose();
  };

  const panelClassName =
    view === "form"
      ? "w-full max-w-md overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
      : "w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl";

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-[60]" onClose={handleClose}>
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
              <Dialog.Panel className={panelClassName}>
                {view === "menu" && (
                  <>
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
                        className="group flex min-h-[48px] w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary via-primary/90 to-primarySoft px-4 py-3 text-center text-text  transition hover:-translate-y-0.5 hover:scale-[1.01]  hover:shadow-xl"
                      >
                        <span className="text-base font-semibold">
                          📞 Καλέστε μας
                        </span>
                        <span className="text-sm text-text/90">
                          2110 081 112
                        </span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setIsSuccess(false);
                          setMessage("");
                          reset();
                          setView("form");
                        }}
                        className="flex min-h-[48px] w-full flex-col items-center justify-center rounded-xl border border-border bg-card/90 px-4 py-3 text-center text-text transition hover:bg-card"
                      >
                        <span className="text-base font-semibold">
                          📝 Συμπληρώστε τη φόρμα
                        </span>
                        <span className="text-sm text-muted">
                          Και θα σας απαντήσουμε σύντομα
                        </span>
                        {/* <span className="mt-1 text-xs text-muted">
                          ⏱ απάντηση εντός 24 ωρών
                        </span> */}
                      </button>

                      <a
                        href={gmailHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[48px] w-full flex-col items-center justify-center rounded-xl border border-transparent bg-transparent px-4 py-3 text-center text-muted transition hover:border-border hover:bg-card/50 hover:text-text"
                      >
                        <span className="text-base font-semibold">
                          ✉️ Στείλτε email
                        </span>
                        <span className="text-sm text-muted">{email}</span>
                      </a>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="text-sm font-medium text-muted transition hover:text-text"
                      >
                        Κλείσιμο
                      </button>
                    </div>
                  </>
                )}

                {view === "form" && (
                  <div className="flex flex-col">
                    <div className="flex flex-col items-center rounded-xl justify-center h-24 w-auto p-5 bg-primary">
                      <h3 className="text-lg font-semibold text-center text-text">Πώς μπορούμε<br/>να βοηθήσουμε;</h3>
                    </div>
                    <div className="flex-grow h-full p-6 overflow-auto bg-card">
                      {!isSubmitSuccessful && (
                        <form onSubmit={handleSubmit(onSubmit)} noValidate>
                          <input
                            type="checkbox"
                            className="hidden"
                            style={{ display: "none" }}
                            {...register("botcheck")}
                          ></input>

                          <div className="mb-4">
                            <label
                              htmlFor="full_name"
                              className="block mb-2 text-sm text-muted dark:text-muted"
                            >
                              Ονοματεπώνυμο
                            </label>
                            <input
                              type="text"
                              id="full_name"
                              placeholder="Όνομα Επώνυμο"
                              {...register("name", {
                                required: "Το ονοματεπώνυμο είναι υποχρεωτικό",
                                maxLength: 80,
                              })}
                              className={`w-full px-3 py-2 text-muted placeholder:text-muted bg-card border border-border rounded-md focus:outline-none focus:ring   ${
                                errors.name
                                  ? "border-red-600 focus:border-red-600 ring-red-100"
                                  : "border-border focus:border-primary ring-primary"
                              }`}
                            />
                            {errors.name && (
                              <div className="mt-1 text-sm text-red-400 invalid-feedback">
                                {errors.name.message as string}
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="email"
                              className="block mb-2 text-sm text-muted dark:text-muted"
                            >
                              Διεύθυνση Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              {...register("email", {
                                required: "Συμπληρώστε το email σας",
                                pattern: {
                                  value: /^\S+@\S+$/i,
                                  message: "Παρακαλώ εισάγετε ένα έγκυρο email",
                                },
                              })}
                              placeholder="you@mail.com"
                              className={`w-full px-3 py-2 text-muted placeholder:text-muted bg-card border border-border rounded-md focus:outline-none focus:ring   ${
                                errors.email
                                  ? "border-red-600 focus:border-red-600 ring-red-100"
                                  : "border-border focus:border-primary ring-primary"
                              }`}
                            />

                            {errors.email && (
                              <div className="mt-1 text-sm text-red-400 invalid-feedback">
                                {errors.email.message as string}
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="phone"
                              className="block mb-2 text-sm text-muted dark:text-muted"
                            >
                              Τηλέφωνο
                            </label>
                            {/* <PhoneInput defaultCountry="gr" forceDialCode /> */}
                            <input
                              type="tel"
                              id="phone"
                              autoComplete="tel"
                              {...register("phone", {
                                required: "Συμπληρώστε το τηλέφωνό σας",
                                validate: (value) => {
                                  const digits = value?.replace(/\D/g, "") ?? "";
                                  if (!/^\+?[0-9\s().-]+$/.test(value ?? "")) {
                                    return "Παρακαλώ εισάγετε ένα έγκυρο τηλέφωνο";
                                  }
                                  if (digits.length < 10 || digits.length > 15) {
                                    return "Το τηλέφωνο πρέπει να έχει 10-15 ψηφία";
                                  }
                                  return true;
                                },
                              })}
                              placeholder="+30 690 000 0000"
                              className={`w-full px-3 py-2 text-muted placeholder:text-muted bg-card border border-border rounded-md focus:outline-none focus:ring   ${
                                errors.phone
                                  ? "border-red-600 focus:border-red-600 ring-red-100"
                                  : "border-border focus:border-primary ring-primary"
                              }`}
                            />

                            {errors.phone && (
                              <div className="mt-1 text-sm text-red-400 invalid-feedback">
                                {errors.phone.message as string}
                              </div>
                            )}
                          </div>

                          <div className="mb-4">
                            <label
                              htmlFor="message"
                              className="block mb-2 text-sm text-muted dark:text-muted"
                            >
                              Το Μήνυμά σας
                            </label>

                            <textarea
                              rows={4}
                              id="message"
                              {...register("message", {
                                required: "Συμπληρώστε το μήνυμά σας",
                              })}
                              placeholder="Το Μήνυμά σας"
                              className={`w-full px-3 py-2 text-muted placeholder:text-muted bg-card border border-border rounded-md h-28 focus:outline-none focus:ring   ${
                                errors.message
                                  ? "border-red-600 focus:border-red-600 ring-red-100"
                                  : "border-border focus:border-primary ring-primary"
                              }`}
                              required
                            ></textarea>
                            {errors.message && (
                              <div className="mt-1 text-sm text-red-400 invalid-feedback">
                                {errors.message.message as string}
                              </div>
                            )}
                          </div>
                          <div className="mb-3">
                            <button
                              type="submit"
                              className="w-full px-3 py-4 text-text bg-primary rounded-md focus:bg-primary focus:outline-none"
                            >
                              {isSubmitting ? (
                                <svg
                                  className="w-5 h-5 mx-auto text-text animate-spin"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                              ) : (
                                "Αποστολή Μηνύματος"
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-center text-muted" id="result">
                            Δεν θα κοινοποιήσουμε ποτέ τα στοιχεία σας.
                          </p>
                        </form>
                      )}

                      {isSubmitSuccessful && isSuccess && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-text rounded-md">
                          <svg
                            width="60"
                            height="60"
                            className="text-green-300"
                            viewBox="0 0 100 100"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M26.6666 50L46.6666 66.6667L73.3333 33.3333M50 96.6667C43.8716 96.6667 37.8033 95.4596 32.1414 93.1144C26.4796 90.7692 21.3351 87.3317 17.0017 82.9983C12.6683 78.6649 9.23082 73.5204 6.8856 67.8586C4.54038 62.1967 3.33331 56.1283 3.33331 50C3.33331 43.8716 4.54038 37.8033 6.8856 32.1414C9.23082 26.4796 12.6683 21.3351 17.0017 17.0017C21.3351 12.6683 26.4796 9.23084 32.1414 6.88562C37.8033 4.5404 43.8716 3.33333 50 3.33333C62.3767 3.33333 74.2466 8.24998 82.9983 17.0017C91.75 25.7534 96.6666 37.6232 96.6666 50C96.6666 62.3768 91.75 74.2466 82.9983 82.9983C74.2466 91.75 62.3767 96.6667 50 96.6667Z"
                              stroke="currentColor"
                              strokeWidth="3"
                            />
                          </svg>
                          <h3 className="py-5 text-xl text-green-500">
                            Το μήνυμα στάλθηκε επιτυχώς
                          </h3>
                          <p className="text-text md:px-3">{message}</p>
                          <button
                            className="mt-6 text-primary focus:outline-none"
                            onClick={() => reset()}
                          >
                            Πίσω
                          </button>
                        </div>
                      )}

                      {isSubmitSuccessful && !isSuccess && (
                        <div className="flex flex-col items-center justify-center h-full text-center text-text rounded-md">
                          <svg
                            width="60"
                            height="60"
                            viewBox="0 0 97 97"
                            className="text-red-400"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M27.9995 69C43.6205 53.379 52.3786 44.621 67.9995 29M26.8077 29L67.9995 69M48.2189 95C42.0906 95 36.0222 93.7929 30.3604 91.4477C24.6985 89.1025 19.554 85.6651 15.2206 81.3316C10.8872 76.9982 7.44975 71.8538 5.10454 66.1919C2.75932 60.53 1.55225 54.4617 1.55225 48.3333C1.55225 42.205 2.75932 36.1366 5.10454 30.4748C7.44975 24.8129 10.8872 19.6684 15.2206 15.335C19.554 11.0016 24.6985 7.56418 30.3604 5.21896C36.0222 2.87374 42.0906 1.66667 48.2189 1.66667C60.5957 1.66667 72.4655 6.58333 81.2172 15.335C89.9689 24.0867 94.8856 35.9566 94.8856 48.3333C94.8856 60.7101 89.9689 72.58 81.2172 81.3316C72.4655 90.0833 60.5957 95 48.2189 95Z"
                              stroke="CurrentColor"
                              strokeWidth="3"
                            />
                          </svg>

                          <h3 className="text-xl text-red-400 py-7">
                            Ωχ, κάτι πήγε στραβά!
                          </h3>
                          <p className="text-text md:px-3">{message}</p>
                          <button
                            className="mt-6 text-primary focus:outline-none"
                            onClick={() => reset()}
                          >
                            Πίσω
                          </button>
                        </div>
                      )}

                      <div className="mt-6 flex justify-center">
                        <button
                          type="button"
                          onClick={handleClose}
                          className="text-sm font-medium text-muted transition hover:text-text"
                        >
                          Κλείσιμο
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
