"use client";
import { AnimatePresence, motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/animations/framer-variants";
import { EmptyMealList } from "./EmptyMealList";
import { CreateShoppingListCta } from "./CreateShoppingListCta";
import { useUser } from "@clerk/nextjs";
import { useFormConfig } from "@/hooks/useFormConfig";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { DialogStripe } from "../ui/dialogs/Stripe";
import {
  getMaxAiCall,
  getUserInfo,
  regenerateSingleMeal,
  saveMealList,
  saveGroupMealList,
  getGroupMenuVotes,
  getGroupMealListForViewer,
  getMyMenuSourcesForViewer,
  getGroupShoppingListGateForViewer,
  isViewerGroupOwner,
} from "@/app/api/actions";
import { RefreshCcw, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useMealContext } from "@/context/useMealContext";
import { MealList } from "@/types/types";
import { MealVoteStars } from "@/app/group/[groupId]/menu/MealVoteStars";

const LottieAnimation = dynamic(() => import("@/components/LottieAnimation"), {
  ssr: false,
});

export const MealListComponent = () => {
  const { mealList, setMealList, currentGroupId, loadMenuForSource } =
    useMealContext();
  const { user } = useUser();
  const pathname = usePathname();
  const isMyMenuPage = pathname === "/my-menu";
  const [menuSources, setMenuSources] = useState<{
    hasPersonalMenu: boolean;
    groups: { id: string; name: string }[];
  } | null>(null);
  const { formState } = useFormConfig();
  const [isDialogStripeOpen, setIsDialogStripeOpen] = useState(false);
  const [loadingMealId, setLoadingMealId] = useState<string | null>(null);
  const [votesByKey, setVotesByKey] = useState<
    Record<string, { average: number; count: number; userVote?: number }>
  >({});
  const [viewerIsGroupOwner, setViewerIsGroupOwner] = useState<boolean | null>(
    null,
  );
  const [shoppingListUnlocked, setShoppingListUnlocked] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    if (!currentGroupId) {
      setVotesByKey({});
      setViewerIsGroupOwner(null);
      return;
    }
    setViewerIsGroupOwner(null);
    getGroupMenuVotes(currentGroupId).then((data) => {
      if (data?.byKey) setVotesByKey(data.byKey);
    });
    isViewerGroupOwner(currentGroupId).then(setViewerIsGroupOwner);
  }, [currentGroupId]);

  useEffect(() => {
    if (!currentGroupId) {
      setShoppingListUnlocked(null);
      return;
    }
    let cancelled = false;
    getGroupShoppingListGateForViewer(currentGroupId).then((data) => {
      if (!cancelled) {
        setShoppingListUnlocked(data?.unlocked ?? null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [currentGroupId]);

  const groupShoppingListBlocked = useMemo(() => {
    if (!currentGroupId) return false;
    if (shoppingListUnlocked === null) return true;
    return !shoppingListUnlocked;
  }, [currentGroupId, shoppingListUnlocked]);

  useEffect(() => {
    if (!isMyMenuPage || !user?.id) {
      setMenuSources(null);
      return;
    }
    getMyMenuSourcesForViewer().then(setMenuSources);
  }, [isMyMenuPage, user?.id]);

  const menuOptions = useMemo(() => {
    if (!menuSources) return [];
    const o: { value: string; label: string }[] = [];
    if (menuSources.hasPersonalMenu) {
      o.push({ value: "personal", label: "Il mio menu (personale)" });
    }
    for (const g of menuSources.groups) {
      o.push({ value: g.id, label: g.name });
    }
    return o;
  }, [menuSources]);

  const showMenuSourceSelector = isMyMenuPage && menuOptions.length > 1;

  const selectorValue = useMemo(() => {
    const v = currentGroupId ?? "personal";
    if (menuOptions.some((o) => o.value === v)) return v;
    return menuOptions[0]?.value ?? "personal";
  }, [currentGroupId, menuOptions]);

  useEffect(() => {
    if (!currentGroupId || !user?.id) return;

    const refreshGroupMenuClient = () => {
      getGroupMenuVotes(currentGroupId).then((data) => {
        if (data?.byKey) setVotesByKey(data.byKey);
      });
      getGroupMealListForViewer(currentGroupId).then((fresh) => {
        if (fresh && fresh.length > 0) setMealList(fresh);
      });
      getGroupShoppingListGateForViewer(currentGroupId).then((data) => {
        if (data) setShoppingListUnlocked(data.unlocked);
      });
    };

    refreshGroupMenuClient();

    const onVisible = () => {
      if (document.visibilityState === "visible") refreshGroupMenuClient();
    };

    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [currentGroupId, setMealList, user?.id]);

  const menuSourceSelector = showMenuSourceSelector ? (
    <div className="mx-auto mb-6 max-w-screen-xl px-5">
      <label
        htmlFor="my-menu-source"
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        Quale menu vuoi vedere?
      </label>
      <select
        id="my-menu-source"
        value={selectorValue}
        onChange={(e) => {
          if (user?.id) void loadMenuForSource(e.target.value, user.id);
        }}
        className="w-full max-w-md rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary sm:w-auto sm:min-w-[280px]"
      >
        {menuOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  ) : null;

  const showRegenerateDelete =
    !currentGroupId || viewerIsGroupOwner === true;

  const refreshVotes = () => {
    if (currentGroupId) {
      getGroupMenuVotes(currentGroupId).then((data) => {
        if (data?.byKey) setVotesByKey(data.byKey);
      });
      getGroupShoppingListGateForViewer(currentGroupId).then((data) => {
        if (data) setShoppingListUnlocked(data.unlocked);
      });
    }
  };

  const openDialogStripe = () => {
    setIsDialogStripeOpen(true);
  };

  if (!mealList || Object.keys(mealList).length === 0) {
    return (
      <>
        {menuSourceSelector}
        <EmptyMealList />
      </>
    );
  }

  const findMealById = (mealList: MealList, mealId: string) => {
    for (const mealType of mealList) {
      const foundMeal = mealType.meals.find((meal) => meal.id === mealId);
      if (foundMeal) {
        return foundMeal;
      }
    }
    return null;
  };

  const handleRegenerateMeal = async (mealTypeId: string, mealId: string) => {
    if (!user) return;
    
    const { apiCallCount, hasPaidForIncrease } = await getUserInfo(user.id);
    const maxAiCall = await getMaxAiCall(hasPaidForIncrease, user.id);

    if (apiCallCount && apiCallCount >= maxAiCall) {
      openDialogStripe();
      return;
    }

    setLoadingMealId(mealId);

    setTimeout(async () => {
      const mealToRegenerate = findMealById(mealList, mealId);
      if (!mealToRegenerate) return;

      try {
        if (!user) return null;
        const response = await regenerateSingleMeal({
          dietaryPreferences: formState.dietaryPreferences,
          userId: user.id,
          meal: mealToRegenerate,
        });

        if (response.type === "success") {
          const updatedMealList = mealList.map((mealType) => {
            if (mealType.id === mealTypeId) {
              return {
                ...mealType,
                meals: mealType.meals.map((meal) =>
                  meal.id === mealId ? response.meal : meal
                ),
              };
            }
            return mealType;
          });

          if (user) {
            if (currentGroupId) {
              const { error } = await saveGroupMealList(
                currentGroupId,
                updatedMealList,
              );
              if (error) console.error(error);
            } else {
              saveMealList(JSON.stringify(updatedMealList), user.id);
            }
          }
          setMealList(updatedMealList);
        }
      } catch (error) {
        console.error("Failed to regenerate meal", error);
      } finally {
        setLoadingMealId(null);
      }
    }, 1000);
  };

  const handleDeleteMeal = async (mealTypeId: string, mealId: string) => {
    const updatedMealList = mealList.map((mealType) => {
      if (mealType.id === mealTypeId) {
        return {
          ...mealType,
          meals: mealType.meals.filter((meal) => meal.id !== mealId),
        };
      }
      return mealType;
    });

    const cleanedMealList = updatedMealList.filter(
      (mealType) => mealType.meals.length > 0
    );

    if (user) {
      if (currentGroupId) {
        const { error } = await saveGroupMealList(
          currentGroupId,
          cleanedMealList,
        );
        if (error) console.error(error);
      } else {
        saveMealList(JSON.stringify(cleanedMealList), user.id);
      }
    }
    setMealList(cleanedMealList);
  };

  return (
    <AnimatePresence mode="sync">
      <div className="px-5 max-w-screen-xl mx-auto" key={0}>
        {menuSourceSelector}
        <h1>Et voilà! Ecco le proposte di menu</h1>
        {currentGroupId ? (
          <p className="mb-6 mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 sm:mb-8 sm:text-[0.95rem]">
            Questo è il menu condiviso del gruppo:{" "}
            <span className="font-medium text-gray-800">
              vota ogni pasto da 1 a 5 stelle
            </span>{" "}
            (un voto a persona per ogni proposta). Quando tutta la ciurma
            avrà votato, sarà possibile generare la lista della spesa. Lo fai
            dalla pagina menu del gruppo; nella pagina Lista della spesa solo
            il proprietario del gruppo potrà apportare modifiche alla lista
            della spesa.
          </p>
        ) : null}
        {mealList.length === 0 ? (
          <EmptyMealList />
        ) : (
          <motion.div key="meal-list" exit={{ opacity: 0 }}>
            {mealList?.map(
              (mealType) =>
                mealType.meals?.length > 0 && (
                  <motion.div key={mealType.id} exit={{ opacity: 0 }}>
                    <h2 className="py-3 text-2xl font-semibold">
                      {mealType.mealTypeName}
                    </h2>
                    <motion.div
                      key={mealType.id}
                      className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(230px,1fr))] mb-8"
                      initial="hidden"
                      animate="visible"
                      variants={containerVariants}
                    >
                      {mealType.meals?.map((meal) => {
                        return (
                          <motion.div
                            layout
                            key={meal.id}
                            variants={itemVariants}
                            className="relative flex h-full flex-col justify-between overflow-hidden rounded-lg border border-gray-200 bg-white p-6"
                          >
                            {loadingMealId === meal.id && (
                              <div className="absolute left-0 right-0 top-0 z-10 bg-white bg-opacity-80">
                                <LottieAnimation
                                  key={loadingMealId}
                                  name="waveBig"
                                  isResponsive={false}
                                />
                              </div>
                            )}

                            {meal.dishes?.map((dish) => (
                              <ul key={dish.id} className="mb-4">
                                <p className="mb-3 text-lg font-medium tracking-wide bg-primary/10 text-primary py-0.5 rounded-sm inline-block">
                                  {dish.dishName}
                                </p>
                                {dish.ingredients?.map(
                                  (ingredient, ingredientIndex) => (
                                    <li
                                      key={ingredientIndex}
                                      className="text-gray-700 text-sm mb-1"
                                    >
                                      <span className="font-medium">
                                        {ingredient.item}
                                      </span>{" "}
                                      -{" "}
                                      <span className="text-gray-500">
                                        {ingredient.quantity} {ingredient.unit}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            ))}
                            {currentGroupId && (
                              <MealVoteStars
                                groupId={currentGroupId}
                                mealTypeId={mealType.id}
                                mealId={meal.id}
                                voteData={votesByKey[`${mealType.id}-${meal.id}`]}
                                onVoteSuccess={refreshVotes}
                              />
                            )}
                            {showRegenerateDelete ? (
                              <div className="mt-3 flex justify-end opacity-80 hover:opacity-100">
                                <motion.button
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() =>
                                    handleRegenerateMeal(mealType.id, meal.id)
                                  }
                                  className="rounded-md p-2 text-gray-600 transition-colors duration-300 hover:bg-gray-50"
                                >
                                  <RefreshCcw
                                    className="text-primary"
                                    width={25}
                                  />
                                </motion.button>
                                <motion.button
                                  whileTap={{ scale: 0.97 }}
                                  onClick={() =>
                                    handleDeleteMeal(mealType.id, meal.id)
                                  }
                                  className="ml-2 rounded-md p-2 text-red-500 transition-colors duration-300 hover:bg-red-50"
                                >
                                  <Trash2 className="text-red-500" />
                                </motion.button>
                              </div>
                            ) : null}
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </motion.div>
                )
            )}
            <CreateShoppingListCta
              groupIdForShoppingContext={currentGroupId || undefined}
              disabled={groupShoppingListBlocked}
            />
          </motion.div>
        )}
      </div>

      <DialogStripe
        key={1}
        isOpen={isDialogStripeOpen}
        setIsOpen={setIsDialogStripeOpen}
      />
    </AnimatePresence>
  );
};
