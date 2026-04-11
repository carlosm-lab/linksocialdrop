"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Database } from "@/types/database";
import { createTheme, updateTheme, toggleThemeActive } from "@/actions/themes";
import { Plus, Edit2, Check, X, Loader2, Sparkles } from "lucide-react";

type ThemeRow = Database["public"]["Tables"]["themes"]["Row"];

interface AdminThemesClientProps {
  themes: ThemeRow[];
  themeUserCounts: Record<string, number>;
}

export function AdminThemesClient({
  themes,
  themeUserCounts,
}: AdminThemesClientProps) {
  const t = useTranslations("adminThemes");
  const [isPending, startTransition] = useTransition();

  const [editingTheme, setEditingTheme] = useState<Partial<ThemeRow> | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenNew = () => {
    setEditingTheme({
      name: "",
      slug: "",
      description: "",
      price: 0,
      is_active: true,
      config: {
        accent_color: "#00F5FF",
        background_color: "#111316",
        button_style: "pill",
        font_family: "Inter",
        layout_mode: "list",
      },
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (theme: ThemeRow) => {
    setEditingTheme(theme);
    setIsModalOpen(true);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleThemeActive({ id, is_active: !currentStatus });
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTheme) return;

    startTransition(async () => {
      try {
        if (editingTheme.id) {
          await updateTheme({
            id: editingTheme.id,
            name: editingTheme.name!,
            slug: editingTheme.slug!,
            description: editingTheme.description || "",
            price: Number(editingTheme.price),
            is_active: editingTheme.is_active,
            config:
              typeof editingTheme.config === "string"
                ? JSON.parse(editingTheme.config)
                : (editingTheme.config as any),
          });
        } else {
          await createTheme({
            name: editingTheme.name!,
            slug: editingTheme.slug!,
            description: editingTheme.description || "",
            price: Number(editingTheme.price),
            is_active: editingTheme.is_active ?? true,
            config:
              typeof editingTheme.config === "string"
                ? JSON.parse(editingTheme.config)
                : (editingTheme.config as any),
          });
        }
        setIsModalOpen(false);
      } catch (error) {
        console.error(error);
        alert("Error saving theme");
      }
    });
  };

  return (
    <div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleOpenNew}
          className="flex items-center gap-2 rounded-lg bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/30"
        >
          <Plus className="h-4 w-4" />
          {t("createNew")}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {themes.map((theme) => {
          const activeUsers = themeUserCounts[theme.id] || 0;
          return (
            <div
              key={theme.id}
              className="glass-panel flex flex-col justify-between overflow-hidden rounded-xl"
            >
              <div className="p-5">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="text-lg font-bold text-white">{theme.name}</h3>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${theme.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
                  >
                    {theme.is_active ? t("active") : t("inactive")}
                  </span>
                </div>
                <p className="mb-4 line-clamp-2 text-xs text-slate-400">
                  {theme.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-300">
                  <div>
                    <span className="font-bold text-white">${theme.price}</span>
                  </div>
                  <div>
                    <span className="font-bold text-white">{activeUsers}</span>{" "}
                    users
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/5 bg-black/20 p-3">
                <button
                  onClick={() => handleToggleActive(theme.id, theme.is_active)}
                  disabled={isPending}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${theme.is_active ? "text-slate-400 hover:bg-white/5" : "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20"}`}
                >
                  {theme.is_active ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleOpenEdit(theme)}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-[#00F5FF] transition-colors hover:bg-[#00F5FF]/10"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  {t("edit")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isModalOpen && editingTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
            role="presentation"
            aria-hidden="true"
          />
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-[#111316] p-6 shadow-2xl">
            <h2 className="mb-4 text-xl font-bold text-white">
              {editingTheme.id ? t("edit") : t("createNew")}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400">
                    {t("name")}
                  </label>
                  <input
                    required
                    value={editingTheme.name || ""}
                    onChange={(e) =>
                      setEditingTheme({ ...editingTheme, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:border-[#00F5FF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400">
                    {t("slug")}
                  </label>
                  <input
                    required
                    value={editingTheme.slug || ""}
                    onChange={(e) =>
                      setEditingTheme({ ...editingTheme, slug: e.target.value })
                    }
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:border-[#00F5FF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="theme-description"
                  className="text-xs font-medium text-slate-400"
                >
                  Description
                </label>
                <textarea
                  id="theme-description"
                  value={editingTheme.description || ""}
                  onChange={(e) =>
                    setEditingTheme({
                      ...editingTheme,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:border-[#00F5FF] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400">
                    {t("price")} (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editingTheme.price || 0}
                    onChange={(e) =>
                      setEditingTheme({
                        ...editingTheme,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-sm text-white focus:border-[#00F5FF] focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={editingTheme.is_active ?? true}
                      onChange={(e) =>
                        setEditingTheme({
                          ...editingTheme,
                          is_active: e.target.checked,
                        })
                      }
                      className="rounded border-white/20 bg-black/50 text-[#00F5FF] focus:ring-[#00F5FF] focus:ring-offset-black"
                    />
                    <span className="text-sm font-medium text-white">
                      {t("active")}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label
                  htmlFor="theme-config"
                  className="text-xs font-medium text-slate-400"
                >
                  Config (JSON format)
                </label>
                <textarea
                  id="theme-config"
                  rows={5}
                  value={
                    typeof editingTheme.config === "string"
                      ? editingTheme.config
                      : JSON.stringify(editingTheme.config || {}, null, 2)
                  }
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setEditingTheme({ ...editingTheme, config: parsed });
                    } catch (err) {
                      // Keep as string if invalid JSON while typing
                      setEditingTheme({
                        ...editingTheme,
                        config: e.target.value as any,
                      });
                    }
                  }}
                  className="w-full rounded-lg border border-white/10 bg-black/50 px-3 py-2 font-mono text-sm text-white focus:border-[#00F5FF] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/5"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-primary-container text-on-primary-container flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold hover:shadow-lg hover:shadow-[#00F5FF]/20 disabled:opacity-50"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  {isPending ? t("saving") : t("save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
