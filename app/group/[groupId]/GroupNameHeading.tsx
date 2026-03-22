"use client";

import { updateGroupName } from "@/app/api/actions";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

type Layout = "menu" | "preferences";

export function GroupNameHeading({
  groupId,
  initialName,
  ownerClerkId,
  titleClassName,
  layout,
}: {
  groupId: string;
  initialName: string;
  /** Clerk user id del creatore del gruppo (come in DB `Group.ownerId`). */
  ownerClerkId: string;
  titleClassName: string;
  layout: Layout;
}) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(initialName);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(initialName);
  const [error, setError] = useState<string | null>(null);

  const isGroupOwner =
    isLoaded && Boolean(user?.id && user.id === ownerClerkId);

  useEffect(() => {
    setName(initialName);
    if (!editing) setDraft(initialName);
  }, [initialName, editing]);

  useEffect(() => {
    if (!isGroupOwner) setEditing(false);
  }, [isGroupOwner]);

  const rowJustify = "justify-center";

  if (!isLoaded || !isGroupOwner) {
    return <h1 className={titleClassName}>{name}</h1>;
  }

  const openEdit = () => {
    setDraft(name);
    setError(null);
    setEditing(true);
  };

  const cancel = () => {
    setDraft(name);
    setError(null);
    setEditing(false);
  };

  const save = () => {
    if (!isGroupOwner) return;
    const trimmed = draft.trim();
    if (!trimmed) {
      setError("Inserisci un nome per il gruppo");
      return;
    }
    if (trimmed === name) {
      setEditing(false);
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateGroupName(groupId, draft);
      if (result.error) {
        setError(result.error);
        return;
      }
      setName(trimmed);
      setDraft(trimmed);
      setEditing(false);
      router.refresh();
    });
  };

  if (!editing) {
    return (
      <h1
        className={cn(
          titleClassName,
          "flex flex-wrap items-center gap-x-2 gap-y-1",
          rowJustify,
        )}
      >
        <span className="min-w-0 break-words">{name}</span>
        <button
          type="button"
          onClick={openEdit}
          className="inline-flex shrink-0 items-center justify-center rounded-lg p-1.5 text-primary/80 transition-colors hover:bg-primary/[0.08] hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Modifica nome del gruppo"
        >
          <Pencil className="h-5 w-5 sm:h-[1.15rem] sm:w-[1.15rem]" strokeWidth={2} aria-hidden />
        </button>
      </h1>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-col items-center gap-3">
      <div
        className={cn(
          "flex w-full min-w-0 max-w-full flex-col gap-2",
          rowJustify,
        )}
      >
        <h1 className={cn(titleClassName, "w-full max-w-xl")}>
          <label htmlFor={`group-name-edit-${groupId}`} className="sr-only">
            Nome del gruppo
          </label>
          <input
            id={`group-name-edit-${groupId}`}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={isPending}
            maxLength={120}
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
              if (e.key === "Enter") {
                e.preventDefault();
                save();
              }
            }}
            className="mt-1 block w-full min-w-0 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-center font-inherit leading-tight tracking-inherit text-inherit shadow-sm outline-none transition-[box-shadow,border-color] focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={save}
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-95 disabled:opacity-50"
          >
            {isPending ? "Salvataggio…" : "Salva"}
          </button>
          <button
            type="button"
            onClick={cancel}
            disabled={isPending}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            Annulla
          </button>
        </div>
        {error ? (
          <p className="text-center text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
