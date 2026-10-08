"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { fireLeadConversion } from "@/lib/fire-lead-conversion";
import { CONTACT_LIMITS, type ContactField } from "@/lib/contact";

type FormState = {
  name: string;
  email: string;
  company: string;
  message: string;
  website: string;
};

const initial: FormState = {
  name: "",
  email: "",
  company: "",
  message: "",
  website: "",
};

/** Lead form. Posts to /api/contact, then thank-you plus a GA4 lead event. */
export function ContactForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initial);
  const [pending, setPending] = useState(false);
  const [serverField, setServerField] = useState<ContactField | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerField(null);
    setPending(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        field?: ContactField;
        submissionId?: string;
      };

      if (!res.ok) {
        setServerField(data.field ?? null);
        toast.error(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      if (data.submissionId) {
        fireLeadConversion("contact", data.submissionId);
      }
      router.replace("/thank-you?source=contact");
    } catch {
      toast.error("Network error. Please try again or email us directly.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => update("website", e.target.value)}
        />
      </div>

      <Field label="Name" htmlFor="name">
        <Input
          id="name"
          name="name"
          required
          maxLength={CONTACT_LIMITS.name}
          aria-invalid={serverField === "name"}
          autoComplete="name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="h-12 rounded-xl px-4 text-base md:text-base"
        />
      </Field>

      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          required
          maxLength={CONTACT_LIMITS.email}
          aria-invalid={serverField === "email"}
          autoComplete="email"
          value={form.email}
          onChange={(e) => update("email", e.target.value)}
          className="h-12 rounded-xl px-4 text-base md:text-base"
        />
      </Field>

      <Field label="Business name" htmlFor="company">
        <Input
          id="company"
          name="company"
          autoComplete="organization"
          maxLength={CONTACT_LIMITS.company}
          aria-invalid={serverField === "company"}
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
          className="h-12 rounded-xl px-4 text-base md:text-base"
        />
      </Field>

      <Field label="How can we help?" htmlFor="message">
        <Textarea
          id="message"
          name="message"
          required
          maxLength={CONTACT_LIMITS.message}
          aria-invalid={serverField === "message"}
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="min-h-[140px] rounded-xl px-4 py-3 text-base md:text-base"
        />
      </Field>

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <Label htmlFor={htmlFor} className="text-[15px] font-medium text-foreground">
        {label}
      </Label>
      {children}
    </div>
  );
}
