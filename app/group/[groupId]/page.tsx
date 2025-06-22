import { NextPage } from "next";
import React from "react";
import { PageContent } from "./pageContent";
import { currentUser } from "@clerk/nextjs/server";
import { getGroupInfo } from "@/app/api/actions";
import { Users, Heart, Wine, Droplets } from "lucide-react";
import { prisma } from "@/lib/prisma";

const GroupPage: NextPage<{
  params: { groupId: string };
}> = async ({ params }) => {
  const { groupId } = params;
  const user = await currentUser();
  const group = await getGroupInfo(groupId);
  const isTheGroupOwner = group?.isTheGroupOwner;
  if (!user || !group) return null;

  // Fetch existing user preferences for this group
  const existingFoodPreferences = await prisma.foodPreference.findMany({
    where: {
      groupId: groupId,
      userId: user.id,
    },
  });

  const existingAlcoholPreferences = await prisma.alcoholPreference.findMany({
    where: {
      groupId: groupId,
      userId: user.id,
    },
  });

  const existingWaterPreferences = await prisma.waterPreference.findMany({
    where: {
      groupId: groupId,
      userId: user.id,
    },
  });

  const hasExistingPreferences =
    existingFoodPreferences.length > 0 ||
    existingAlcoholPreferences.length > 0 ||
    existingWaterPreferences.length > 0;

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          {!isTheGroupOwner && (
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <Users className="w-5 h-5 text-primary" />
                <p className="text-lg font-medium text-gray-800">
                  Ciao {user.fullName}!
                </p>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {isTheGroupOwner ? (
              <>
                Hai creato il gruppo{" "}
                <span className="text-primary">{group?.groupName}</span>
              </>
            ) : (
              <>
                <span className="text-primary">{group.ownerName}</span> ti ha
                invitato al gruppo{" "}
                <span className="text-primary">{group?.groupName}</span>
              </>
            )}
          </h1>

          {!isTheGroupOwner && (
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Aggiungi le tue preferenze per creare una cambusa perfetta per
                il viaggio.
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <PageContent
          groupId={groupId}
          group={group}
          hasExistingPreferences={hasExistingPreferences}
          existingPreferences={{
            food: existingFoodPreferences,
            alcohol: existingAlcoholPreferences,
            water: existingWaterPreferences,
          }}
        />
      </div>
    </div>
  );
};

export default GroupPage;
