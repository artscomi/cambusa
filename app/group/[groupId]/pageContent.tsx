"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { TextArea } from "@/components/TextArea";
import { useUser } from "@clerk/nextjs";
import Toast from "@/components/Toast";
import { Button } from "@/components/Button";
import CopyLink from "@/components/CopyLinkButton";
import Link from "next/link";

export const PageContent: React.FC<{
  groupId: string;
  group: {
    groupId: string;
    groupName: string;
    isTheGroupOwner: boolean;
  };
}> = ({ groupId, group }) => {
  const [foodPreferences, setFoodPreferences] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToastSuccess, setShowToastSuccess] = useState(false);
  const [arePreferencesSaved, setArePreferencesSaved] = useState(false);
  const [error, setError] = useState("");
  const [groupLink, setGroupLink] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [fieldError, setFieldError] = useState("");
  const { user } = useUser();
  const isTheGroupOwner = group?.isTheGroupOwner;

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    groupId: string,
    preference: string
  ) => {
    e.preventDefault();
    if (!foodPreferences.trim()) {
      setFieldError("Le preferenze sono obbligatorie");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/groups/${groupId}/set-preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preference }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || "Errore durante il salvataggio delle preferenze"
        );
      }

      setShowToastSuccess(true);
      setArePreferencesSaved(true);
      group?.isTheGroupOwner && setGroupLink(`${baseUrl}/group/${groupId}/`);
    } catch (error) {
      console.error("Errore:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showToastSuccess) {
      confetti({
        particleCount: 500,
        spread: 500,
        origin: { y: 0.2 },
      });
    }
  }, [showToastSuccess]);

  if (!user) return null;

  return (
    <>
      <div className="relative max-sm:-mx-4 md:overflow-hidden mb-10">
        {!arePreferencesSaved && (
          <form
            onSubmit={(e) => handleSubmit(e, groupId, foodPreferences)}
            className="flex flex-col"
          >
            <TextArea
              rows={2}
              maxLength={200}
              value={foodPreferences}
              onChange={(e) => setFoodPreferences(e.target.value)}
              placeholder="Esempio: mangio 150g di yogurt greco a colazione, non mangio la pasta"
              id="food-preferences"
              label={"Inserisci le tue preferenze alimentari"}
              error={fieldError}
            />
            <Button disabled={isLoading} className="ml-auto mt-5">
              {isLoading ? "Salvataggio..." : "Salva preferenze"}
            </Button>
          </form>
        )}

        {showToastSuccess && (
          <Toast
            message={"Preferenze salvate con successo!"}
            type="success"
            showToast={showToastSuccess}
            onClose={() => setShowToastSuccess(false)}
          />
        )}

        {error && (
          <Toast
            message={error}
            type="error"
            showToast={!!error}
            onClose={() => setError("")}
          />
        )}
      </div>
      {isTheGroupOwner && groupLink && arePreferencesSaved && (
        <div className="mb-10">
          <p className="mb-8">
            Ecco fatto! Ora puoi condividere il link con il resto della ciurma:
          </p>
          <CopyLink url={groupLink} />
        </div>
      )}

      {arePreferencesSaved && (
        <>
          <p className="mb-8">
            Ora puoi monitorare le preferenze aggiunte dai tuoi compagni di
            viaggio
          </p>
          <Link href={`${groupId}/menu`}>
            <Button>Vai alla pagina del gruppo</Button>
          </Link>
        </>
      )}
    </>
  );
};
