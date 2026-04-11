"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Icon } from "@/components/ui/icon";
import { useTranslations } from "next-intl";
import {
  createLink,
  updateLink,
  deleteLink,
  toggleLinkVisibility,
  reorderLinks,
} from "@/actions/links";
import { useAction } from "next-safe-action/hooks";
import { Database } from "@/types/database";
import { getIconNameByUrl } from "@/lib/icons";
import { IconPicker } from "@/components/ui/IconPicker";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Loader2,
  X,
  Trash2,
  Palette,
} from "lucide-react";
import { siteConfig } from "@/config/site";

type LinkItem = Database["public"]["Tables"]["links"]["Row"];
type ProfileInfo = {
  username: string | null;
  button_style?: string | null;
  accent_color?: string | null;
};

// --- Sortable item with spring animation & hover micro-interaction ---
function SortableItem({
  link,
  onEdit,
  onDelete,
  onToggle,
  t,
}: {
  link: LinkItem;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
  t: any;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition:
      transition || "transform 350ms cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    zIndex: isDragging ? 50 : 1,
  };

  const hasCustomColors = link.bg_color || link.text_color;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      whileHover={{ scale: isDragging ? 1 : 1.005 }}
      className={`group cursor-pointer rounded-xl border transition-all duration-200 ${
        isDragging
          ? "ring-primary-container z-50 opacity-70 shadow-2xl ring-2"
          : link.visible
            ? "bg-surface-container-low border-outline-variant/10 hover:border-outline-variant/40 shadow-sm hover:shadow-md"
            : "bg-surface-container-lowest border-transparent opacity-50"
      }`}
    >
      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 sm:p-5">
        {/* Drag handle */}
        <div
          className="flex shrink-0 cursor-grab touch-none items-center p-1 text-slate-600 hover:text-white active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <Icon name="menu" className="text-base" />
        </div>

        {/* Link info */}
        <div className="min-w-0 flex-grow">
          <div className="mb-1 flex items-center gap-2.5">
            {/* Custom bg dot if has custom colors */}
            {hasCustomColors && (
              <div
                className="h-3 w-3 shrink-0 rounded-full border border-white/10"
                style={{ backgroundColor: link.bg_color || undefined }}
                title={t("customColors")}
              />
            )}
            <Icon
              name={link.icon || "link"}
              className={`shrink-0 text-lg ${link.visible ? "text-primary-container" : "text-slate-500"}`}
            />
            <h4
              className={`font-headline truncate text-base font-bold ${link.visible ? "text-white" : "text-slate-400"}`}
            >
              {link.title}
            </h4>
          </div>
          <p className="truncate text-sm text-slate-500">{link.url}</p>
          {!link.visible && (
            <p className="mt-1 text-xs font-medium text-slate-600 italic">
              {t("hiddenFromProfile")}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center justify-end gap-4">
          <button
            onClick={onEdit}
            className="text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-white"
          >
            {t("edit")}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-xs font-bold tracking-widest text-red-600 uppercase transition-colors hover:text-red-400"
          >
            {t("delete")}
          </button>
          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={link.visible ?? true}
            aria-label={`${t("edit")} ${link.title}`}
            onClick={onToggle}
            className={`relative flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-none px-1 transition-colors ${
              link.visible
                ? "bg-primary-container"
                : "bg-surface-container-highest"
            }`}
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 700, damping: 30 }}
              className={`h-4 w-4 rounded-full ${link.visible ? "bg-on-primary-container ml-auto" : "bg-slate-600"}`}
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Profile URL Bar component ---
function ProfileUrlBar({
  username,
  t,
}: {
  username: string;
  t: (key: string) => string;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${siteConfig.url}/${username}`;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [url]);

  return (
    <div className="bg-surface-container-low border-outline-variant/20 mb-6 flex flex-col items-start justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
      <div>
        <p className="text-on-surface-variant mb-0.5 text-xs font-medium tracking-wider uppercase">
          {t("profileUrl")}
        </p>
        <code className="text-on-surface text-sm font-bold">
          {url.replace("https://", "")}
        </code>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          aria-label={t("copyUrl")}
          className="border-outline-variant/30 hover:bg-surface-container-high flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-300 transition-all"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span
                key="check"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1 text-green-400"
              >
                <Check size={13} /> {t("copied")}
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-1"
              >
                <Copy size={13} /> {t("copyUrl")}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary-container/10 border-primary-container/20 text-primary-container hover:bg-primary-container/20 flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all"
        >
          <ExternalLink size={13} /> {t("viewLive")}
        </a>
      </div>
    </div>
  );
}

// --- Link Color Picker mini ---
function LinkColorSection({
  bgColor,
  textColor,
  onBgChange,
  onTextChange,
  t,
}: {
  bgColor: string;
  textColor: string;
  onBgChange: (v: string) => void;
  onTextChange: (v: string) => void;
  t: (key: string) => string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
      >
        <Palette size={16} />
        {t("customColors")}
        <span className="ml-auto text-xs text-slate-600">
          {open ? "▲" : "▼"}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  {t("bgColor")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor || "#1e2023"}
                    onChange={(e) => onBgChange(e.target.value)}
                    className="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-white/10 bg-transparent"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => onBgChange(e.target.value)}
                    placeholder="#RRGGBB"
                    maxLength={7}
                    className="bg-surface-container-highest w-full rounded-lg border border-white/5 px-2 py-1.5 text-xs text-slate-300 outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-500">
                  {t("textColor")}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={textColor || "#ffffff"}
                    onChange={(e) => onTextChange(e.target.value)}
                    className="h-8 w-8 shrink-0 cursor-pointer rounded-md border border-white/10 bg-transparent"
                  />
                  <input
                    type="text"
                    value={textColor}
                    onChange={(e) => onTextChange(e.target.value)}
                    placeholder="#RRGGBB"
                    maxLength={7}
                    className="bg-surface-container-highest w-full rounded-lg border border-white/5 px-2 py-1.5 text-xs text-slate-300 outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>
            {/* Preview chip */}
            {(bgColor || textColor) && (
              <div className="mt-3">
                <div
                  className="inline-block rounded-lg px-4 py-2 text-sm font-bold"
                  style={{
                    backgroundColor: bgColor || "#1e2023",
                    color: textColor || "#ffffff",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {t("customColors")} preview
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LinksClient({
  initialLinks,
  profile,
}: {
  initialLinks: LinkItem[];
  profile: ProfileInfo;
}) {
  const t = useTranslations("adminLinks");
  const tc = useTranslations("common");
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Form State
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("link");
  const [bgColor, setBgColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [error, setError] = useState("");

  const urlHasHttpsWarning =
    url.length > 5 && !url.startsWith("http://") && !url.startsWith("https://");

  const { execute: executeCreate, isExecuting: isCreatingAction } = useAction(
    createLink,
    {
      onSuccess: (res) => {
        if (res.data) {
          setLinks((prev) => [...prev, res.data as LinkItem]);
          closeModal();
        }
      },
      onError: (e) => {
        setError(e.error.serverError || "Error saving link");
      },
    }
  );

  const { execute: executeUpdate, isExecuting: isUpdatingAction } = useAction(
    updateLink,
    {
      onSuccess: (res) => {
        if (res.data) {
          setLinks((prev) =>
            prev.map((l) =>
              l.id === res.data!.id ? (res.data as LinkItem) : l
            )
          );
          closeModal();
        }
      },
      onError: (e) => {
        setError(e.error.serverError || "Error saving link");
      },
    }
  );

  const { execute: executeDelete, isExecuting: isDeletingAction } = useAction(
    deleteLink,
    {
      onSuccess: ({ input: req }) => {
        setLinks((prev) => prev.filter((l) => l.id !== req.id));
        setDeleteId(null);
      },
    }
  );

  const { execute: executeToggle } = useAction(toggleLinkVisibility, {
    onSuccess: ({ input: req }) => {
      setLinks((prev) =>
        prev.map((l) => (l.id === req.id ? { ...l, visible: req.visible } : l))
      );
    },
  });

  const { execute: executeReorder } = useAction(reorderLinks);

  const openCreateModal = () => {
    setEditingLink(null);
    setTitle("");
    setUrl("");
    setIcon("link");
    setBgColor("");
    setTextColor("");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (link: LinkItem) => {
    setEditingLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setIcon(link.icon || "link");
    setBgColor(link.bg_color || "");
    setTextColor(link.text_color || "");
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteId(null);
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    // Auto-detect icon only if we haven't manually changed it
    if (icon === "link" || icon === "external-link") {
      const detected = getIconNameByUrl(newUrl);
      if (detected !== "link") setIcon(detected);
    }
  };

  const handleSave = () => {
    setError("");
    if (!title || !url) {
      setError(t("titleUrlRequired"));
      return;
    }

    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }

    // Validate hex colors
    const isValidHex = (c: string) => !c || /^#[0-9A-Fa-f]{6}$/.test(c);
    if (!isValidHex(bgColor) || !isValidHex(textColor)) {
      setError("Color debe ser un hex válido: #RRGGBB");
      return;
    }

    if (editingLink) {
      executeUpdate({
        id: editingLink.id,
        title,
        url: finalUrl,
        icon,
        visible: editingLink.visible ?? true,
        bg_color: bgColor || null,
        text_color: textColor || null,
      });
    } else {
      executeCreate({
        title,
        url: finalUrl,
        icon,
        bg_color: bgColor || null,
        text_color: textColor || null,
      });
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        const reordered = newItems.map((li, idx) => ({ ...li, position: idx }));
        executeReorder({
          links: reordered.map((l) => ({ id: l.id, position: l.position! })),
        });
        return reordered;
      });
    }
  }

  const isFormLoading = isCreatingAction || isUpdatingAction;

  return (
    <div className="space-y-6">
      {/* Profile URL bar */}
      {profile.username && <ProfileUrlBar username={profile.username} t={t} />}

      {/* Empty state */}
      {links.length === 0 && (
        <div className="border-outline-variant/30 bg-surface-container-low mt-8 flex flex-col items-center rounded-xl border border-dashed p-12 text-center">
          <Icon name="link" className="mb-4 text-5xl text-slate-700" />
          <p className="mb-4 max-w-xs text-slate-500">{t("emptyStateText")}</p>
          <button
            onClick={openCreateModal}
            className="bg-primary-container/10 text-primary-container border-primary-container/20 hover:bg-primary-container/20 rounded-xl border px-6 py-2.5 text-sm font-bold transition-all"
          >
            + {t("addLink")}
          </button>
        </div>
      )}

      {/* Drag-and-drop list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {links.map((link) => (
              <SortableItem
                key={link.id}
                link={link}
                t={t}
                onEdit={() => openEditModal(link)}
                onDelete={() => setDeleteId(link.id)}
                onToggle={() =>
                  executeToggle({ id: link.id, visible: !link.visible })
                }
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* FAB */}
      <div className="fixed right-8 bottom-32 z-30 md:right-12 md:bottom-12">
        <motion.button
          onClick={openCreateModal}
          aria-label={t("addLink")}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="luminous-glow text-on-primary-fixed group flex h-16 w-16 items-center justify-center rounded-full shadow-2xl"
        >
          <motion.div
            animate={{ rotate: isModalOpen ? 45 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon name="add" className="text-3xl font-bold" />
          </motion.div>
        </motion.button>
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeModal();
            }}
          >
            <motion.div
              key="modal-content"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="bg-surface-container border-outline-variant/30 w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="bg-surface-container-high/60 flex items-center justify-between border-b border-white/5 px-6 py-4">
                <h3 className="text-lg font-bold text-white">
                  {editingLink ? t("editLink") : t("addLink")}
                </h3>
                <button
                  onClick={closeModal}
                  className="text-slate-400 transition-colors hover:text-white"
                  aria-label="Cerrar"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[80vh] overflow-y-auto p-6">
                {error && (
                  <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-400/10 p-3 text-sm text-red-400">
                    <AlertCircle size={16} />
                    {error}
                  </div>
                )}

                <div className="space-y-5">
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="link-title"
                      className="mb-1.5 block text-sm font-medium text-slate-400"
                    >
                      {t("titleLabel")}
                    </label>
                    <input
                      id="link-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-surface-container-highest text-on-surface focus:ring-primary-container/40 w-full rounded-xl border border-white/5 px-4 py-3 transition-all outline-none placeholder:text-slate-600 focus:ring-2"
                      placeholder="Mi Portfolio"
                    />
                  </div>

                  {/* URL */}
                  <div>
                    <label
                      htmlFor="link-url"
                      className="mb-1.5 block text-sm font-medium text-slate-400"
                    >
                      {t("urlLabel")}
                    </label>
                    <input
                      id="link-url"
                      type="text"
                      value={url}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="bg-surface-container-highest text-on-surface focus:ring-primary-container/40 w-full rounded-xl border border-white/5 px-4 py-3 transition-all outline-none placeholder:text-slate-600 focus:ring-2"
                      placeholder="https://..."
                    />
                    <AnimatePresence>
                      {urlHasHttpsWarning && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="mt-1.5 flex items-center gap-1.5 text-xs text-yellow-400"
                        >
                          <AlertCircle size={12} />
                          {t("urlWarning")}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Icon */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-400">
                      {t("iconLabel")}
                    </label>
                    <div className="flex items-center gap-4">
                      <IconPicker value={icon} onChange={setIcon} />
                      <span className="text-xs text-slate-500">
                        {t("iconHelperText")}
                      </span>
                    </div>
                  </div>

                  {/* Per-link custom colors */}
                  <div className="border-outline-variant/20 rounded-xl border p-4">
                    <LinkColorSection
                      bgColor={bgColor}
                      textColor={textColor}
                      onBgChange={setBgColor}
                      onTextChange={setTextColor}
                      t={t}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 font-medium text-slate-400 transition-colors hover:text-white"
                      disabled={isFormLoading}
                    >
                      {tc("cancel")}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isFormLoading}
                      className="bg-primary-container text-on-primary-container hover:bg-primary-container/90 flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold transition-all disabled:opacity-50"
                    >
                      {isFormLoading && (
                        <Loader2 size={16} className="animate-spin" />
                      )}
                      {isFormLoading ? tc("saving") : tc("save")}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* DELETE DIALOG */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            key="delete-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              key="delete-content"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-surface-container w-full max-w-sm rounded-2xl border border-white/10 p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <h3 className="font-headline mb-2 text-xl font-bold text-white">
                {t("deleteDialogTitle")}
              </h3>
              <p className="mb-6 text-sm text-slate-400">
                {t("deleteDialogDesc")}
              </p>
              <div className="flex w-full gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="bg-surface-container-highest hover:bg-surface-container-highest/80 w-1/2 rounded-xl py-3 font-bold text-white transition-colors"
                >
                  {tc("cancel")}
                </button>
                <button
                  disabled={isDeletingAction}
                  onClick={() => executeDelete({ id: deleteId })}
                  className="flex w-1/2 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-bold text-white shadow-lg transition-colors hover:bg-red-600 disabled:opacity-50"
                >
                  {isDeletingAction && (
                    <Loader2 size={16} className="animate-spin" />
                  )}
                  {tc("delete")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
