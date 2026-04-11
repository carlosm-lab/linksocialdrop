"use client";

import { useState } from "react";
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

type LinkItem = Database["public"]["Tables"]["links"]["Row"];

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
  t: (key: string, args?: any) => string;
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
      transition || "transform 400ms cubic-bezier(0.175, 0.885, 0.32, 1.1)",
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group hover:border-outline-variant/30 flex flex-col gap-4 rounded-xl border border-transparent p-4 shadow-sm transition-all sm:flex-row sm:items-center sm:gap-6 sm:p-6 ${
        isDragging
          ? "ring-primary-container bg-surface-container z-50 opacity-50 ring-2"
          : link.visible
            ? "bg-surface-container-low"
            : "bg-surface-container-lowest opacity-60"
      }`}
    >
      <div className="flex w-full min-w-0 flex-grow items-center gap-4 sm:gap-6">
        <div
          className="flex shrink-0 cursor-grab touch-none p-2 text-slate-500 hover:text-white active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <Icon name="menu" />
        </div>

        <div className="min-w-0 flex-grow">
          <div className="mb-1 flex items-center gap-3">
            <Icon
              name={link.icon || "link"}
              className={`${link.visible ? "text-primary-container" : "text-slate-500"} shrink-0 text-lg`}
            />
            <h4
              className={`font-headline truncate text-lg font-bold ${link.visible ? "text-white" : "text-slate-300"}`}
            >
              {link.title}
            </h4>
          </div>
          <p className="truncate text-sm font-medium text-slate-500">
            {link.url}
          </p>
          {!link.visible && (
            <p className="mt-1 text-xs font-medium text-slate-600 italic">
              {t("hiddenFromProfile")}
            </p>
          )}
        </div>
      </div>

      <div className="mt-2 flex shrink-0 items-center justify-end gap-3 self-end sm:mt-0 sm:self-auto">
        <button
          onClick={onEdit}
          className="cursor-pointer text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-white"
        >
          {t("edit")}
        </button>
        <button
          onClick={onDelete}
          className="cursor-pointer text-xs font-bold tracking-widest text-red-500 uppercase transition-colors hover:text-red-400"
        >
          {t("delete")}
        </button>
        <button
          type="button"
          role="switch"
          aria-checked={link.visible ?? true}
          aria-label={`${t("edit")} ${link.title}`}
          onClick={onToggle}
          className={`relative flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-none px-1 ${link.visible ? "bg-primary-container" : "bg-surface-container-highest"}`}
        >
          <div
            className={`h-4 w-4 rounded-full ${link.visible ? "bg-on-primary-container ml-auto" : "bg-slate-600"}`}
          ></div>
        </button>
      </div>
    </div>
  );
}

export function LinksClient({ initialLinks }: { initialLinks: LinkItem[] }) {
  const t = useTranslations("adminLinks");
  const tc = useTranslations("common");
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Form State
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("link");
  const [error, setError] = useState("");

  const { execute: executeCreate, isExecuting: isCreatingAction } = useAction(
    createLink,
    {
      onSuccess: (res) => {
        if (res.data) {
          setLinks([...links, res.data as LinkItem]);
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
          setLinks(
            links.map((l) =>
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
        setLinks(links.filter((l) => l.id !== req.id));
        setDeleteId(null);
      },
    }
  );

  const { execute: executeToggle } = useAction(toggleLinkVisibility, {
    onSuccess: ({ input: req }) => {
      setLinks(
        links.map((l) => (l.id === req.id ? { ...l, visible: req.visible } : l))
      );
    },
  });

  const { execute: executeReorder } = useAction(reorderLinks);

  const openCreateModal = () => {
    setEditingLink(null);
    setTitle("");
    setUrl("");
    setIcon("link");
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (link: LinkItem) => {
    setEditingLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setIcon(link.icon || "link");
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setDeleteId(null);
  };

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    // Auto detect icon only if creating a new link and we haven't manually picked one (or if it's currently 'link')
    if (icon === "link") {
      const detected = getIconNameByUrl(newUrl);
      if (detected !== "link") {
        setIcon(detected);
      }
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

    if (editingLink) {
      executeUpdate({
        id: editingLink.id,
        title,
        url: finalUrl,
        icon,
        visible: editingLink.visible ?? true,
      });
    } else {
      executeCreate({ title, url: finalUrl, icon });
    }
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLinks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        // Re-assign positions based on new array order
        const reordered = newItems.map((li, idx) => ({ ...li, position: idx }));

        // Trigger server update
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
      {links.length === 0 && (
        <div className="border-outline-variant/30 bg-surface-container-low mt-12 flex flex-col items-center rounded-xl border border-dashed p-8 text-center">
          <Icon name="add_link" className="mb-4 text-4xl text-slate-700" />
          <p className="max-w-xs text-slate-500">{t("emptyStateText")}</p>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={links.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
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

      {/* Primary FAB */}
      <div className="fixed right-8 bottom-32 z-30 md:right-12 md:bottom-12">
        <button
          onClick={openCreateModal}
          aria-label={t("createLink")}
          className="luminous-glow text-on-primary-fixed group flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
        >
          <Icon
            name="add"
            className="text-3xl font-bold transition-transform duration-300 group-hover:rotate-90"
          />
        </button>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-surface-container border-outline-variant/30 animate-in fade-in zoom-in-95 w-full max-w-lg overflow-hidden rounded-2xl border shadow-2xl duration-200">
            <div className="bg-surface-container-high/50 flex items-center justify-between border-b border-white/5 p-6">
              <h3 className="text-xl font-bold text-white">
                {editingLink ? t("editLink") : t("createLink")}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 transition-colors hover:text-white"
              >
                <Icon name="close" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <p className="mb-4 rounded-lg border border-red-500/20 bg-red-400/10 p-3 text-sm text-red-400">
                  {error}
                </p>
              )}

              <div className="space-y-5">
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
                    placeholder="My Portfolio"
                  />
                </div>
                <div>
                  <label
                    htmlFor="link-url"
                    className="mb-1.5 block text-sm font-medium text-slate-400"
                  >
                    {t("urlLabel")}
                  </label>
                  <input
                    id="link-url"
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    className="bg-surface-container-highest text-on-surface focus:ring-primary-container/40 w-full rounded-xl border border-white/5 px-4 py-3 transition-all outline-none placeholder:text-slate-600 focus:ring-2"
                    placeholder="https://..."
                  />
                </div>
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
                <div className="flex justify-end gap-3 pt-6">
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
                      <Icon name="refresh" className="animate-spin text-sm" />
                    )}
                    {isFormLoading ? tc("saving") : tc("save")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE DIALOG */}
      {deleteId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="bg-surface-container animate-in zoom-in-95 w-full max-w-sm rounded-2xl border border-white/10 p-6 text-center shadow-2xl duration-200">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
              <Icon name="trash" className="text-2xl text-red-500" />
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
                className="w-1/2 rounded-xl bg-red-500 py-3 font-bold text-white shadow-lg transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {tc("delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
