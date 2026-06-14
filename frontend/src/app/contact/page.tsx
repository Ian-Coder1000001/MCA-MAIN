"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import type { ContactPayload } from "@/types";

type FormState = ContactPayload;
type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: FormState = {
  full_name: "",
  email: "",
  subject: "",
  message: "",
};

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontFamily: "'DM Sans', sans-serif",
        fontSize: "0.82rem",
        fontWeight: 600,
        color: "var(--stone-700)",
        marginBottom: "0.4rem",
        letterSpacing: "0.01em",
      }}
    >
      {children}
      {required && (
        <span style={{ color: "#1d4ed8", marginLeft: "0.2rem" }} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}

export default function ContactPage() {
  const [form, setForm]     = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [serverMsg, setServerMsg] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.full_name.trim())  errs.full_name = "Full name is required.";
    if (!form.email.trim())      errs.email     = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Please enter a valid email address.";
    if (!form.subject.trim())    errs.subject   = "Subject is required.";
    if (!form.message.trim())    errs.message   = "Message is required.";
    else if (form.message.trim().length < 20)
      errs.message = "Message must be at least 20 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormState]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("submitting");
    try {
      const res = await api.contact(form);
      if (res.success) {
        setStatus("success");
        setServerMsg(res.message || "Your message has been received.");
        setForm(EMPTY);
        setErrors({});
      } else {
        setStatus("error");
        setServerMsg(res.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerMsg("Unable to send your message right now. Please try again later.");
    }
  }

  return (
    <>
      {/* Page header */}
      <div className="page-header">
        <div className="container-site" style={{ position: "relative", zIndex: 1 }}>
          <div className="divider" style={{ background: "#1d4ed8" }} aria-hidden="true" />
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              color: "#fff",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              marginBottom: "0.4rem",
            }}
          >
            Contact Us
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.55)",
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Reach the Elphas Shilosio campaign team — every message is read
          </p>
        </div>
      </div>

      {/* Main content */}
      <section
        style={{
          background: "var(--stone-50)",
          paddingTop: "4rem",
          paddingBottom: "5rem",
        }}
      >
        <div className="container-site">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "3rem",
              alignItems: "start",
            }}
          >
            {/* ── Contact form ── */}
            <div
              style={{
                background: "#fff",
                borderRadius: "1.25rem",
                border: "1.5px solid var(--stone-100)",
                padding: "2.25rem 2rem",
                boxShadow: "0 4px 32px rgba(0,0,0,0.04)",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  color: "var(--stone-800)",
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  marginBottom: "0.4rem",
                }}
              >
                Send a message
              </h2>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  color: "var(--stone-400)",
                  fontSize: "0.85rem",
                  marginBottom: "2rem",
                  lineHeight: 1.6,
                }}
              >
                Have a concern, idea, or request for Murhanda Ward? Fill in the form below.
              </p>

              {/* Success banner */}
              {status === "success" && (
                <div
                  role="alert"
                  style={{
                    background: "#eff6ff",
                    border: "1.5px solid #bfdbfe",
                    borderLeft: "4px solid #2563eb",
                    borderRadius: "0.625rem",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.75rem",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Checkmark */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: "0.05rem" }}
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="9" r="9" fill="#2563eb" />
                    <path
                      d="M5 9l3 3 5-5"
                      stroke="#fff"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        color: "#1e3a5f",
                        fontSize: "0.875rem",
                        marginBottom: "0.2rem",
                      }}
                    >
                      Message sent
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "#1d4ed8",
                        fontSize: "0.82rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {serverMsg}
                    </p>
                  </div>
                </div>
              )}

              {/* Error banner */}
              {status === "error" && (
                <div
                  role="alert"
                  style={{
                    background: "#fff5f5",
                    border: "1.5px solid #fecaca",
                    borderLeft: "4px solid #ef4444",
                    borderRadius: "0.625rem",
                    padding: "1rem 1.25rem",
                    marginBottom: "1.75rem",
                    display: "flex",
                    gap: "0.75rem",
                    alignItems: "flex-start",
                  }}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    style={{ flexShrink: 0, marginTop: "0.05rem" }}
                    aria-hidden="true"
                  >
                    <circle cx="9" cy="9" r="9" fill="#ef4444" />
                    <path
                      d="M9 5v5M9 12.5v.5"
                      stroke="#fff"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 600,
                        color: "#b91c1c",
                        fontSize: "0.875rem",
                        marginBottom: "0.2rem",
                      }}
                    >
                      Submission failed
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        color: "#dc2626",
                        fontSize: "0.82rem",
                        lineHeight: 1.5,
                      }}
                    >
                      {serverMsg}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Name + Email row */}
                <div
                  className="contact-name-email"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1.125rem",
                  }}
                >
                  <div>
                    <FieldLabel htmlFor="full_name" required>
                      Full name
                    </FieldLabel>
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      autoComplete="name"
                      placeholder="Jane Wanjiru"
                      value={form.full_name}
                      onChange={handleChange}
                      aria-invalid={!!errors.full_name}
                      aria-describedby={errors.full_name ? "err-full_name" : undefined}
                      className="form-field"
                    />
                    {errors.full_name && (
                      <p
                        id="err-full_name"
                        role="alert"
                        style={{
                          color: "#dc2626",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.75rem",
                          marginTop: "0.35rem",
                        }}
                      >
                        {errors.full_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <FieldLabel htmlFor="email" required>
                      Email address
                    </FieldLabel>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "err-email" : undefined}
                      className="form-field"
                    />
                    {errors.email && (
                      <p
                        id="err-email"
                        role="alert"
                        style={{
                          color: "#dc2626",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.75rem",
                          marginTop: "0.35rem",
                        }}
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div style={{ marginBottom: "1.125rem" }}>
                  <FieldLabel htmlFor="subject" required>
                    Subject
                  </FieldLabel>
                  <select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "err-subject" : undefined}
                    className="form-field"
                    style={{ appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239e9890' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 0.9rem center", paddingRight: "2.5rem" }}
                  >
                    <option value="">Select a subject...</option>
                    <option value="Road or infrastructure request">Road or infrastructure request</option>
                    <option value="Health services concern">Health services concern</option>
                    <option value="Education matter">Education matter</option>
                    <option value="Water & sanitation issue">Water &amp; sanitation issue</option>
                    <option value="Bursary enquiry">Bursary enquiry</option>
                    <option value="General feedback">General feedback</option>
                    <option value="Media or press enquiry">Media or press enquiry</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.subject && (
                    <p
                      id="err-subject"
                      role="alert"
                      style={{
                        color: "#dc2626",
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.75rem",
                        marginTop: "0.35rem",
                      }}
                    >
                      {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message */}
                <div style={{ marginBottom: "1.75rem" }}>
                  <FieldLabel htmlFor="message" required>
                    Message
                  </FieldLabel>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Describe your concern, idea, or request in detail..."
                    value={form.message}
                    onChange={handleChange}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "err-message" : undefined}
                    className="form-field"
                    style={{ resize: "vertical", minHeight: 140 }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.35rem",
                    }}
                  >
                    {errors.message ? (
                      <p
                        id="err-message"
                        role="alert"
                        style={{
                          color: "#dc2626",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.75rem",
                        }}
                      >
                        {errors.message}
                      </p>
                    ) : (
                      <span />
                    )}
                    <span
                      style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "0.72rem",
                        color:
                          form.message.length < 20
                            ? "var(--stone-400)"
                            : "#2563eb",
                      }}
                    >
                      {form.message.length} chars
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  style={{
                    width: "100%",
                    padding: "0.9rem 1.5rem",
                    background:
                      status === "submitting"
                        ? "var(--forest-400)"
                        : "#1d4ed8",
                    color: "#fff",
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    borderRadius: "0.625rem",
                    border: "none",
                    cursor: status === "submitting" ? "not-allowed" : "pointer",
                    transition: "background 0.18s, opacity 0.18s",
                    letterSpacing: "0.01em",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                  }}
                >
                  {status === "submitting" ? (
                    <>
                      {/* Spinner */}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        style={{ animation: "spin 0.8s linear infinite" }}
                        aria-hidden="true"
                      >
                        <circle
                          cx="8" cy="8" r="6"
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 2a6 6 0 0 1 6 6"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send message"
                  )}
                </button>

                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--stone-400)",
                    fontSize: "0.75rem",
                    textAlign: "center",
                    marginTop: "1rem",
                    lineHeight: 1.5,
                  }}
                >
                  Fields marked * are required. Your information is kept confidential.
                </p>
              </form>
            </div>

            {/* ── Info sidebar ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* About the office */}
              <div
                style={{
                  background: "#0f172a",
                  borderRadius: "1.25rem",
                  padding: "2rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "rgba(255,255,255,0.4)",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginBottom: "1.25rem",
                  }}
                >
                  Ward office
                </p>

                {[
                  {
                    label: "Location",
                    value: "Murhanda Ward, Kakamega County, Kenya",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                          stroke="#93c5fd"
                          strokeWidth="1.5"
                        />
                        <circle cx="12" cy="9" r="2.5" stroke="#93c5fd" strokeWidth="1.5" />
                      </svg>
                    ),
                  },
                  {
                    label: "Facebook",
                    value: "Follow us on Facebook",
                    href: "https://facebook.com/YOUR_PAGE",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                          stroke="#93c5fd"
                          strokeWidth="1.5"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ),
                  },
                ].map(({ label, value, href, icon }) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      gap: "0.875rem",
                      alignItems: "flex-start",
                      marginBottom: "1.125rem",
                    }}
                  >
                    <div
                      style={{
                        width: 32, height: 32,
                        borderRadius: "0.5rem",
                        background: "rgba(255,255,255,0.06)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </div>
                    <div>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.35)",
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: "0.7rem",
                          marginBottom: "0.2rem",
                        }}
                      >
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#93c5fd",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.85rem",
                            textDecoration: "none",
                          }}
                        >
                          {value}
                        </a>
                      ) : (
                        <p
                          style={{
                            color: "rgba(255,255,255,0.75)",
                            fontFamily: "'DM Sans', sans-serif",
                            fontSize: "0.85rem",
                            lineHeight: 1.5,
                          }}
                        >
                          {value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Response time notice */}
              <div
                style={{
                  background: "#fff",
                  border: "1.5px solid var(--stone-100)",
                  borderLeft: "4px solid #1d4ed8",
                  borderRadius: "0.875rem",
                  padding: "1.25rem 1.375rem",
                }}
              >
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontWeight: 600,
                    color: "var(--stone-700)",
                    fontSize: "0.85rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  Response time
                </p>
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    color: "var(--stone-500)",
                    fontSize: "0.82rem",
                    lineHeight: 1.6,
                  }}
                >
                  The team aims to respond within 2 business days.
                  Urgent ward matters are prioritised.
                </p>
              </div>

              {/* Pledge card */}
              <div
                style={{
                  background: "#eff6ff",
                  border: "1.5px solid #dbeafe",
                  borderRadius: "0.875rem",
                  padding: "1.25rem 1.375rem",
                }}
              >
                <blockquote style={{ margin: 0, padding: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontStyle: "italic",
                      color: "#1e3a5f",
                      fontSize: "0.95rem",
                      lineHeight: 1.7,
                      marginBottom: "0.75rem",
                    }}
                  >
                    &ldquo;Every concern raised by a resident of Murhanda Ward
                    deserves a response and a plan.&rdquo;
                  </p>
                  <cite
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.78rem",
                      color: "#2563eb",
                      fontStyle: "normal",
                    }}
                  >
                    &mdash; Elphas Shilosio
                  </cite>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
