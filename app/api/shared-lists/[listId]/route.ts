import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - Ottieni una lista specifica
export async function GET(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = await auth();
    const { listId } = params;

    const list = await prisma.sharedIngredientList.findUnique({
      where: {
        id: listId,
        isActive: true,
      },
      include: {
        items: {
          include: {
            votes: true,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!list) {
      return NextResponse.json(
        { error: "Lista non trovata" },
        { status: 404 }
      );
    }

    // Se l'utente è autenticato, aggiungi informazioni extra
    const response = {
      ...list,
      canEdit: userId ? list.createdBy === userId : false,
      canDelete: userId ? list.createdBy === userId : false,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Errore nel recupero della lista:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}

// PUT - Aggiorna una lista
export async function PUT(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = await auth();
    const { listId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const { name, description } = await request.json();

    const updatedList = await prisma.sharedIngredientList.update({
      where: {
        id: listId,
        createdBy: userId, // Solo il creatore può modificare
      },
      data: {
        name,
        description,
        updatedAt: new Date(),
      },
      include: {
        items: {
          include: {
            votes: true,
          },
        },
      },
    });

    return NextResponse.json(updatedList);
  } catch (error) {
    console.error("Errore nell'aggiornamento della lista:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}

// DELETE - Elimina una lista (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { listId: string } }
) {
  try {
    const { userId } = await auth();
    const { listId } = params;

    if (!userId) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    await prisma.sharedIngredientList.update({
      where: {
        id: listId,
        createdBy: userId, // Solo il creatore può eliminare
      },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Errore nell'eliminazione della lista:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
} 