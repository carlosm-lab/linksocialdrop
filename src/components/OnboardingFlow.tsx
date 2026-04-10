"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAction } from "next-safe-action/hooks";
import { completeOnboarding } from "@/actions/onboarding";
import { useRouter } from "next/navigation";
import {
  Loader2,
  ArrowRight,
  User,
  Link as LinkIcon,
  CheckCircle2,
} from "lucide-react";

export function OnboardingFlow() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    full_name: "",
    bio: "",
    link_title: "",
    link_url: "",
  });

  const { execute, status, result } = useAction(completeOnboarding, {
    onSuccess: () => {
      router.push("/es/dashboard/links");
    },
  });

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleComplete = () => {
    // Basic validation to fix missing protocol
    let finalUrl = formData.link_url;
    if (
      finalUrl &&
      !finalUrl.startsWith("http://") &&
      !finalUrl.startsWith("https://")
    ) {
      finalUrl = "https://" + finalUrl;
    }

    execute({ ...formData, link_url: finalUrl });
  };

  const isStep1Valid = formData.username.length >= 3;
  const isStep2Valid = formData.full_name.length >= 1;
  const checkUrl = formData.link_url.startsWith("http")
    ? formData.link_url
    : "https://" + formData.link_url;
  const isStep3Valid =
    formData.link_title.length >= 1 &&
    formData.link_url.length > 3 &&
    checkUrl.includes(".");

  return (
    <div className="glass-panel bg-noise relative mx-auto w-full max-w-md overflow-hidden rounded-3xl p-8 shadow-2xl">
      <div className="relative z-10 mb-8 flex items-center justify-between">
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step
                  ? "bg-primary w-8"
                  : i < step
                    ? "bg-primary/50 w-8"
                    : "bg-outline-variant/30 w-4"
              }`}
            />
          ))}
        </div>
        <span className="text-outline text-sm font-medium">
          Paso {step} de 3
        </span>
      </div>

      <div className="relative z-10 min-h-[320px]">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-headline text-on-surface mb-2 text-3xl font-bold">
                  Reclama tu enlace
                </h2>
                <p className="text-on-surface-variant text-base">
                  Elige un nombre de usuario único para tu perfil público
                  premium.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-on-surface text-sm font-medium"
                >
                  Nombre de usuario
                </label>
                <div className="relative flex items-center">
                  <span className="text-on-surface-variant absolute left-4 font-medium">
                    linkdrop.com/
                  </span>
                  <input
                    id="username"
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-surface-container-highest border-outline-variant focus:border-primary text-on-surface focus:ring-primary w-full rounded-xl border py-3 pr-4 pl-[114px] transition-colors outline-none focus:ring-1"
                    placeholder="tunombre"
                  />
                </div>
                {result?.serverError && (
                  <p className="text-error mt-1 text-sm">
                    {result.serverError}
                  </p>
                )}
                {result?.validationErrors?.username?._errors && (
                  <p className="text-error mt-1 text-sm">
                    {result.validationErrors.username._errors[0]}
                  </p>
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={!isStep1Valid}
                className="bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20 mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 font-bold shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continuar <ArrowRight size={18} />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-headline text-on-surface mb-2 text-3xl font-bold">
                  Preséntate
                </h2>
                <p className="text-on-surface-variant text-base">
                  Añade tu nombre y una breve descripción de lo que haces.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="full_name"
                    className="text-on-surface text-sm font-medium"
                  >
                    Nombre para mostrar
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="text-on-surface-variant absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <input
                      id="full_name"
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      className="bg-surface-container-highest border-outline-variant focus:border-primary text-on-surface focus:ring-primary w-full rounded-xl border py-3 pr-4 pl-10 transition-colors outline-none focus:ring-1"
                      placeholder="Ej. Jane Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="bio"
                    className="text-on-surface text-sm font-medium"
                  >
                    Biografía{" "}
                    <span className="text-outline text-xs font-normal">
                      (Opcional)
                    </span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="bg-surface-container-highest border-outline-variant focus:border-primary text-on-surface focus:ring-primary h-24 w-full resize-none rounded-xl border px-4 py-3 transition-colors outline-none focus:ring-1"
                    placeholder="Creadora de contenido & Artista..."
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleBack}
                  className="border-outline-variant text-on-surface hover:bg-surface-container rounded-xl border px-4 py-3 font-medium transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isStep2Valid}
                  className="bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Siguiente paso <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="space-y-6"
            >
              <div>
                <h2 className="font-headline text-on-surface mb-2 text-3xl font-bold">
                  Tu primer enlace
                </h2>
                <p className="text-on-surface-variant text-base">
                  Agrega el enlace más importante para tus seguidores.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="link_title"
                    className="text-on-surface text-sm font-medium"
                  >
                    Título del enlace
                  </label>
                  <input
                    id="link_title"
                    type="text"
                    name="link_title"
                    value={formData.link_title}
                    onChange={handleChange}
                    className="bg-surface-container-highest border-outline-variant focus:border-primary text-on-surface focus:ring-primary w-full rounded-xl border px-4 py-3 transition-colors outline-none focus:ring-1"
                    placeholder="Mi canal de YouTube"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="link_url"
                    className="text-on-surface text-sm font-medium"
                  >
                    URL
                  </label>
                  <div className="relative">
                    <LinkIcon
                      size={18}
                      className="text-on-surface-variant absolute top-1/2 left-3 -translate-y-1/2"
                    />
                    <input
                      id="link_url"
                      type="url"
                      name="link_url"
                      value={formData.link_url}
                      onChange={handleChange}
                      className="bg-surface-container-highest border-outline-variant focus:border-primary text-on-surface focus:ring-primary w-full rounded-xl border py-3 pr-4 pl-10 transition-colors outline-none focus:ring-1"
                      placeholder="youtube.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleBack}
                  disabled={status === "executing"}
                  className="border-outline-variant text-on-surface hover:bg-surface-container rounded-xl border px-4 py-3 font-medium transition-colors disabled:opacity-50"
                >
                  Volver
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!isStep3Valid || status === "executing"}
                  className="bg-primary text-on-primary hover:bg-primary/90 shadow-primary/20 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 font-bold shadow-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "executing" ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Creando
                      perfil...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> ¡Listo, comenzar!
                    </>
                  )}
                </button>
              </div>
              {result?.serverError && (
                <p className="text-error mt-2 text-center text-sm">
                  {result.serverError}
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
