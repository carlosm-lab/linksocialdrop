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

type LinkItem = Database["public"]["Tables"]["links"]["Row"];

export function LinksClient({ initialLinks }: { initialLinks: LinkItem[] }) {
  const t = useTranslations("adminLinks");
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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
          resetForm();
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
          resetForm();
        }
      },
      onError: (e) => {
        setError(e.error.serverError || "Error saving link");
      },
    }
  );

  const { execute: executeDelete } = useAction(deleteLink, {
    onSuccess: ({ input: req }) => {
      setLinks(links.filter((l) => l.id !== req.id));
    },
  });

  const { execute: executeToggle } = useAction(toggleLinkVisibility, {
    onSuccess: ({ input: req }) => {
      setLinks(
        links.map((l) => (l.id === req.id ? { ...l, visible: req.visible } : l))
      );
    },
  });

  const { execute: executeReorder } = useAction(reorderLinks);

  const resetForm = () => {
    setIsCreating(false);
    setEditingLink(null);
    setTitle("");
    setUrl("");
    setIcon("link");
    setError("");
  };

  const handleSave = () => {
    setError("");
    if (!title || !url) {
      setError("Title and URL are required");
      return;
    }

    if (editingLink) {
      executeUpdate({
        id: editingLink.id,
        title,
        url,
        icon,
        visible: editingLink.visible ?? true,
      });
    } else {
      executeCreate({ title, url, icon });
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[index - 1];
    newLinks[index - 1] = temp;

    // Update positions
    newLinks.forEach((l, i) => (l.position = i));
    setLinks(newLinks);

    executeReorder({
      links: newLinks.map((l) => ({ id: l.id, position: l.position! })),
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === links.length - 1) return;
    const newLinks = [...links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[index + 1];
    newLinks[index + 1] = temp;

    // Update positions
    newLinks.forEach((l, i) => (l.position = i));
    setLinks(newLinks);

    executeReorder({
      links: newLinks.map((l) => ({ id: l.id, position: l.position! })),
    });
  };

  const isFormLoading = isCreatingAction || isUpdatingAction;

  return (
    <div className="space-y-6">
      {(isCreating || editingLink) && (
        <div className="bg-surface-container border-outline-variant/30 rounded-xl border p-6">
          <h3 className="mb-4 text-xl font-bold text-white">
            {editingLink ? "Edit Link" : "Create Link"}
          </h3>

          {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="link-title"
                className="mb-1 block text-sm text-slate-400"
              >
                Title
              </label>
              <input
                id="link-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-surface-container-highest text-on-surface focus:ring-primary-container/40 w-full rounded-lg border-none px-4 py-3 outline-none focus:ring-1"
                placeholder="My Portfolio"
              />
            </div>
            <div>
              <label
                htmlFor="link-url"
                className="mb-1 block text-sm text-slate-400"
              >
                URL
              </label>
              <input
                id="link-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="bg-surface-container-highest text-on-surface focus:ring-primary-container/40 w-full rounded-lg border-none px-4 py-3 outline-none focus:ring-1"
                placeholder="https://..."
              />
            </div>
            <div>
              <label
                htmlFor="link-icon"
                className="mb-1 block text-sm text-slate-400"
              >
                Icon (Material Symbol)
              </label>
              <input
                id="link-icon"
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="bg-surface-container-highest text-on-surface focus:ring-primary-container/40 w-full rounded-lg border-none px-4 py-3 outline-none focus:ring-1"
                placeholder="link"
              />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-white"
                disabled={isFormLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isFormLoading}
                className="bg-primary-container text-on-primary-container rounded-lg px-6 py-2 font-bold disabled:opacity-50"
              >
                {isFormLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {links.length === 0 && !isCreating && !editingLink && (
        <div className="border-outline-variant/30 mt-12 flex flex-col items-center rounded-xl border border-dashed p-8 text-center">
          <Icon name="add_link" className="mb-4 text-4xl text-slate-700" />
          <p className="max-w-xs text-slate-500">{t("emptyStateText")}</p>
        </div>
      )}

      {links.map((link, index) => (
        <div
          key={link.id}
          className={`group flex flex-col gap-4 rounded-xl p-4 transition-all sm:flex-row sm:items-center sm:gap-6 sm:p-6 ${link.visible ? "bg-surface-container-low hover:bg-surface-container" : "bg-surface-container-lowest opacity-50"}`}
        >
          <div className="flex w-full min-w-0 flex-grow items-center gap-4 sm:gap-6">
            <div className="flex shrink-0 flex-col gap-1 text-slate-600">
              <button
                onClick={() => handleMoveUp(index)}
                className="hover:text-white disabled:opacity-30"
                disabled={index === 0}
              >
                <Icon name="keyboard_arrow_up" />
              </button>
              <button
                onClick={() => handleMoveDown(index)}
                className="hover:text-white disabled:opacity-30"
                disabled={index === links.length - 1}
              >
                <Icon name="keyboard_arrow_down" />
              </button>
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
              onClick={() => {
                setEditingLink(link);
                setTitle(link.title);
                setUrl(link.url);
                setIcon(link.icon || "link");
                setIsCreating(false);
              }}
              className="text-xs font-bold tracking-widest text-slate-400 uppercase transition-colors hover:text-white"
            >
              {t("edit")}
            </button>
            <button
              onClick={() => executeDelete({ id: link.id })}
              className="text-xs font-bold tracking-widest text-red-500 uppercase transition-colors hover:text-red-400"
            >
              Delete
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={link.visible ?? true}
              aria-label="Toggle visibility"
              onClick={() =>
                executeToggle({ id: link.id, visible: !link.visible })
              }
              className={`relative flex h-6 w-12 shrink-0 cursor-pointer items-center rounded-full border-none px-1 ${link.visible ? "bg-primary-container" : "bg-surface-container-highest"}`}
            >
              <div
                className={`h-4 w-4 rounded-full ${link.visible ? "bg-on-primary-container ml-auto" : "bg-slate-600"}`}
              ></div>
            </button>
          </div>
        </div>
      ))}

      {/* Primary FAB */}
      {!isCreating && !editingLink && (
        <div className="fixed right-8 bottom-32 z-40 md:right-12 md:bottom-12">
          <button
            onClick={() => setIsCreating(true)}
            className="luminous-glow text-on-primary-fixed group flex h-16 w-16 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
          >
            <Icon
              name="add"
              className="text-3xl font-bold transition-transform duration-300 group-hover:rotate-90"
            />
          </button>
        </div>
      )}
    </div>
  );
}
