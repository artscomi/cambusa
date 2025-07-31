"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSharedListContext } from "@/context/useSharedListContext";
import { ArrowLeft, Save, Users } from "lucide-react";

const CreateSharedListPage = () => {
  const router = useRouter();
  const { createList } = useSharedListContext();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    groupId: "default-group", // Per ora usiamo un gruppo di default
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newList = await createList(
        formData.name,
        formData.description,
        formData.groupId
      );
      
      // Reindirizza alla nuova lista
      router.push(`/shared-lists/${newList.id}`);
    } catch (error) {
      console.error("Errore nella creazione della lista:", error);
      alert("Errore nella creazione della lista. Riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Crea una lista condivisa</h1>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nome lista */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nome della lista *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Es. Lista spesa weekend"
                required
              />
            </div>

            {/* Descrizione */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrizione (opzionale)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Aggiungi una descrizione per la tua lista..."
              />
            </div>

            {/* Gruppo */}
            <div>
              <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-2">
                Gruppo *
              </label>
              <div className="relative">
                <select
                  id="groupId"
                  value={formData.groupId}
                  onChange={(e) => handleInputChange("groupId", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent appearance-none"
                  required
                >
                  <option value="">Seleziona un gruppo</option>
                  <option value="group1">Gruppo 1</option>
                  <option value="group2">Gruppo 2</option>
                  {/* Qui dovrebbero essere caricati i gruppi dell'utente */}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">
                    Lista condivisa
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Tutti i membri del gruppo potranno vedere e modificare questa lista. 
                    Solo tu potrai aggiungere o rimuovere elementi.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-3 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit"
                disabled={!formData.name || !formData.groupId || isSubmitting}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creazione...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Crea lista
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateSharedListPage; 