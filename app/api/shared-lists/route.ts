import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - Ottieni tutte le liste dell'utente
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const lists = await prisma.sharedIngredientList.findMany({
      where: {
        createdBy: userId,
        isActive: true,
      },
      include: {
        items: {
          include: {
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(lists);
  } catch (error) {
    console.error("Errore nel recupero delle liste:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}

// POST - Crea una nuova lista
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const { name, description, groupId } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Nome è obbligatorio" },
        { status: 400 }
      );
    }

    const newList = await prisma.sharedIngredientList.create({
      data: {
        name,
        description,
        groupId: groupId || null, // Può essere null
        createdBy: userId,
        isActive: true,
      },
      include: {
        items: {
          include: {
            votes: true,
          },
        },
      },
    });

    return NextResponse.json(newList);
  } catch (error) {
    console.error("Errore nella creazione della lista:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
} 