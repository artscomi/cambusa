"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSharedListContext } from "@/context/useSharedListContext";
import { CreateSharedListBox } from "@/components/CreateSharedListBox";
import { 
  List, 
  Users, 
  Calendar, 
  CheckCircle, 
  Circle,
  Plus,
  ArrowRight 
} from "lucide-react";

const SharedListsPage = () => {
  const { sharedLists } = useSharedListContext();

  const completedItems = sharedLists.flatMap(list => 
    list.items.filter(item => item.isCompleted)
  );
  const pendingItems = sharedLists.flatMap(list => 
    list.items.filter(item => !item.isCompleted)
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Liste condivise
          </h1>
          <p className="text-gray-600">
            Gestisci le tue liste di ingredienti condivise con i tuoi gruppi
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <List className="w-6 h-6 text-primary" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{sharedLists.length}</p>
                <p className="text-sm text-gray-600">Liste totali</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <Circle className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingItems.length}</p>
                <p className="text-sm text-gray-600">Da completare</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedItems.length}</p>
                <p className="text-sm text-gray-600">Completati</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {sharedLists.length > 0 ? 
                    Math.round((completedItems.length / (completedItems.length + pendingItems.length)) * 100) : 0
                  }%
                </p>
                <p className="text-sm text-gray-600">Completato</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Create new list */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <CreateSharedListBox />
        </motion.div>

        {/* Lists */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Le tue liste</h2>
          
          {sharedLists.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <List className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessuna lista condivisa
              </h3>
              <p className="text-gray-600 mb-6">
                Crea la tua prima lista condivisa per iniziare a collaborare con il tuo gruppo.
              </p>
              <Link
                href="/shared-lists/create"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-4 h-4" />
                Crea la prima lista
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sharedLists.map((list, index) => {
                const completedCount = list.items.filter(item => item.isCompleted).length;
                const totalCount = list.items.length;
                const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <motion.div
                    key={list.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <Link href={`/shared-lists/${list.id}`}>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {list.name}
                            </h3>
                            {list.description && (
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {list.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        </div>

                        <div className="space-y-3">
                          {/* Progress bar */}
                          <div>
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progresso</span>
                              <span>{completedCount}/{totalCount}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary h-2 rounded-full transition-all duration-300"
                                style={{ width: `${progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                {new Date(list.createdAt).toLocaleDateString('it-IT')}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>Condivisa</span>
                            </div>
                          </div>

                          {/* Items preview */}
                          {list.items.length > 0 && (
                            <div className="pt-3 border-t border-gray-100">
                              <p className="text-xs text-gray-500 mb-2">
                                Ultimi elementi:
                              </p>
                              <div className="space-y-1">
                                {list.items.slice(0, 3).map((item) => (
                                  <div
                                    key={item.id}
                                    className={`text-sm flex items-center gap-2 ${
                                      item.isCompleted ? "text-gray-500 line-through" : "text-gray-700"
                                    }`}
                                  >
                                    {item.isCompleted ? (
                                      <CheckCircle className="w-3 h-3 text-green-500" />
                                    ) : (
                                      <Circle className="w-3 h-3 text-gray-400" />
                                    )}
                                    <span className="truncate">
                                      {item.item} - {item.quantity} {item.unit}
                                    </span>
                                  </div>
                                ))}
                                {list.items.length > 3 && (
                                  <p className="text-xs text-gray-500">
                                    +{list.items.length - 3} altri...
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedListsPage; 