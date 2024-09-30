"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { TextArea } from "@/components/TextArea";
import { useUser } from "@clerk/nextjs";
import Toast from "@/components/Toast";
import { Button } from "@/components/Button";
import { getGroupInfo } from "@/app/api/actions";
import CopyLink from "@/components/CopyLinkButton";
import Link from "next/link";
import { GroupInfo } from "@/types/types";

export const PageContent: React.FC<{ groupId: string }> = ({ groupId }) => {
  const [foodPreferences, setFoodPreferences] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showToastSucess, setShowToastSuccess] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [error, setError] = useState("");
  const [groupLink, setGroupLink] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [group, setGroup] = useState<GroupInfo | undefined>();
  const [fieldError, setFieldError] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const fetch = async () => {
      const group = await getGroupInfo({ groupId });
      setGroup(group);
    };
    fetch();
  }, [groupId]);

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
      setShowCta(true);
      group?.isTheGroupOwner && setGroupLink(`${baseUrl}/group/${groupId}/`);
    } catch (error) {
      console.error("Errore:", error);
      setError((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showToastSucess) {
      confetti({
        particleCount: 500,
        spread: 500,
        origin: { y: 0.2 },
      });
    }
  }, [showToastSucess]);

  if (!user) return null;

  return (
    <>
      <div className="md:rounded-lg p-8 md:p-14 md:shadow-md relative max-sm:-mx-4 md:overflow-hidden bg-white mb-10">
        <form
          onSubmit={(e) => handleSubmit(e, groupId, foodPreferences)}
          className="flex flex-col"
        >
          <h1 className="text-3xl font-bold mb-4">
            Congratulazioni! <br />
            {group?.isTheGroupOwner
              ? "Hai creato il gruppo"
              : "Hai ricevuto un invito al gruppo"}{" "}
            <span className="text-tertiary capitalize">{group?.groupName}</span>
          </h1>
          <p className="text-lg text-gray-700 mb-4">
            Aggiungi le tue preferenze alimentari per creare una cambusa per il
            viaggio.
          </p>
          <TextArea
            rows={2}
            maxLength={200}
            value={foodPreferences}
            onChange={(e) => setFoodPreferences(e.target.value)}
            placeholder="Esempio: mangio 150g di yogurt greco a colazione, non mangio la pasta"
            id={"food-preferences"}
            label={"Inserisci le tue preferenze alimentari"}
            error={fieldError}
          />
          <Button disabled={isLoading} className="ml-auto mt-5">
            {isLoading ? "Salvataggio..." : "Salva preferenze"}
          </Button>
        </form>

        {showToastSucess && (
          <Toast
            message={"Preferenze salvate con successo!"}
            type="success"
            showToast={showToastSucess}
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
      {group?.isTheGroupOwner && groupLink && (
        <>
          <p className="text-center mb-8">
            Ecco fatto! Ora puoi condividere il link con il resto della ciurma:
          </p>
          <CopyLink url={groupLink} />
        </>
      )}

      {showCta && (
        <>
          <p>
            Ora puoi accedere alla tua area privata e monitorare le preferenze
            aggiunte dai tuoi compagni di viaggio
          </p>
          <Link href={`${groupId}/menu`}>
            <Button>Vai</Button>
          </Link>
        </>
      )}
    </>
  );
};
