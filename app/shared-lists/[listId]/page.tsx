"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSharedListContext } from "@/context/useSharedListContext";
import { useUser } from "@clerk/nextjs";
import Checklist from "@/components/CheckList";
import ShareListModal from "@/components/ShareListModal";
import SharedListStats from "@/components/SharedListStats";
import { Share2, Edit } from "lucide-react";

const SharedListPage = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [newListName, setNewListName] = useState("");
  const { 
    sharedLists, 
    setSharedLists,
    setCurrentList, 
    addItemToList, 
    removeItemFromList, 
    toggleItemCompletion, 
    updateItemQuantity, 
    updateItemUnit,
    voteOnItem,
    getUserVote,
    getItemVoteCount
  } = useSharedListContext();
  const listId = params.listId as string;

  const currentList = sharedLists.find(list => list.id === listId);

  useEffect(() => {
    if (currentList) {
      setCurrentList(currentList);
      setNewListName(currentList.name || "");
    }
  }, [currentList, setCurrentList]);

  const handleUpdateListName = () => {
    if (newListName.trim() && currentList) {
      const updatedLists = sharedLists.map(list =>
        list.id === listId
          ? { ...list, name: newListName.trim() }
          : list
      );
      setSharedLists(updatedLists);
      setShowEditNameModal(false);
    }
  };

  if (!currentList) {
    return (
      <div className="px-6 md:px-10 lg:px-32">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Lista non trovata
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-md">
            La lista che stai cercando non esiste o è stata rimossa.
          </p>
          <button
            onClick={() => router.push("/shared-lists")}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Torna alle liste
          </button>
        </div>
      </div>
    );
  }

  // Usa l'ID utente reale da Clerk
  const currentUserId = user?.id || "anonymous";
  const isOwner = currentList.createdBy === currentUserId;
  const completedBy = currentUserId;

  // Converti SharedIngredientItem[] in Ingredient[]
  const items = currentList.items.map(item => ({
    id: item.id,
    item: item.item,
    quantity: item.quantity,
    unit: item.unit,
    isCompleted: item.isCompleted,
    votes: item.votes,
    totalVotes: item.totalVotes,
  }));

  const handleAddItem = (item: any) => {
    addItemToList(listId, {
      item: item.item,
      quantity: item.quantity,
      unit: item.unit,
      isCompleted: false,
    });
  };

  const handleRemoveItem = (itemId: string) => {
    removeItemFromList(listId, itemId);
  };

  const handleUpdateQuantity = (itemId: string, quantity: number, unit?: string) => {
    updateItemQuantity(listId, itemId, quantity);
    if (unit) {
      updateItemUnit(listId, itemId, unit);
    }
  };

  const handleToggleCompletion = (itemId: string) => {
    toggleItemCompletion(listId, itemId, completedBy);
  };

  const handleVote = (itemId: string, vote: boolean) => {
    voteOnItem(listId, itemId, currentUserId, vote);
  };

  const handleGetUserVote = (item: any): boolean | null => {
    return getUserVote(item, currentUserId);
  };

  const handleGetItemVoteCount = (item: any): number => {
    return getItemVoteCount(item);
  };

  return (
    <div className="px-6 md:px-10 lg:px-32">
      {/* Header con pulsante di condivisione */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {currentList.name && currentList.name.trim() !== "" 
              ? currentList.name 
              : `Lista della spesa ${listId.slice(-4)}`}
          </h1>
          <button
            onClick={() => setShowEditNameModal(true)}
            className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-700"
            title="Modifica nome lista"
          >
            <Edit size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-gray-600 text-sm">
            Lista condivisa • {currentList.items.length} elementi
          </p>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Share2 size={16} />
            Condividi
          </button>
        </div>
      </div>

      {/* Statistiche */}
      <SharedListStats
        items={currentList.items}
        totalVotes={currentList.items.reduce((sum, item) => sum + (item.totalVotes || 0), 0)}
        uniqueVoters={new Set(
          currentList.items
            .flatMap(item => Object.keys(item.votes || {}))
        ).size}
      />

      <Checklist
        items={items}
        isSharedList={true}
        onAddItem={handleAddItem} // Chiunque può aggiungere
        onRemoveItem={handleRemoveItem} // Chiunque può rimuovere
        onUpdateQuantity={handleUpdateQuantity} // Chiunque può modificare
        onToggleCompletion={handleToggleCompletion} // Chiunque può completare
        onVote={handleVote} // Chiunque può votare
        getUserVote={handleGetUserVote}
        getItemVoteCount={handleGetItemVoteCount}
        canEdit={true} // Chiunque può editare
        canRemove={true} // Chiunque può rimuovere
        canAdd={true} // Chiunque può aggiungere
        canVote={true} // Chiunque può votare
        completedBy={completedBy}
        currentUserId={currentUserId}
        listName={currentList.name}
      />

      {/* Modal di condivisione */}
      <ShareListModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        listId={listId}
        listName={currentList.name}
        currentUrl={window.location.href}
      />

      {/* Modal per modificare il nome */}
      {showEditNameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Modifica nome lista</h3>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary mb-4"
              placeholder="Nome della lista"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowEditNameModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={handleUpdateListName}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                disabled={!newListName.trim()}
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedListPage; 