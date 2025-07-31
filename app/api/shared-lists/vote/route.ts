import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const { listId, itemId, vote } = await request.json();

    if (!listId || !itemId || typeof vote !== "boolean") {
      return NextResponse.json(
        { error: "Parametri mancanti" },
        { status: 400 }
      );
    }

    // Trova o crea il voto dell'utente per questo item
    const existingVote = await prisma.sharedIngredientItemVote.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    if (existingVote) {
      // Aggiorna il voto esistente
      await prisma.sharedIngredientItemVote.update({
        where: {
          userId_itemId: {
            userId,
            itemId,
          },
        },
        data: {
          vote,
          updatedAt: new Date(),
        },
      });
    } else {
      // Crea un nuovo voto
      await prisma.sharedIngredientItemVote.create({
        data: {
          userId,
          itemId,
          vote,
        },
      });
    }

    // Calcola il totale dei voti per questo item
    const votes = await prisma.sharedIngredientItemVote.findMany({
      where: { itemId },
    });

    const totalVotes = votes.reduce((total: number, v: any) => total + (v.vote ? 1 : -1), 0);

    // Aggiorna il totale nell'item
    await prisma.sharedIngredientItem.update({
      where: { id: itemId },
      data: { totalVotes },
    });

    return NextResponse.json({ 
      success: true, 
      totalVotes,
      userVote: vote 
    });

  } catch (error) {
    console.error("Errore nel voto:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Non autorizzato" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");

    if (!itemId) {
      return NextResponse.json(
        { error: "itemId mancante" },
        { status: 400 }
      );
    }

    // Ottieni il voto dell'utente per questo item
    const userVote = await prisma.sharedIngredientItemVote.findUnique({
      where: {
        userId_itemId: {
          userId,
          itemId,
        },
      },
    });

    // Ottieni il totale dei voti
    const votes = await prisma.sharedIngredientItemVote.findMany({
      where: { itemId },
    });

    const totalVotes = votes.reduce((total: number, v: any) => total + (v.vote ? 1 : -1), 0);

    return NextResponse.json({
      userVote: userVote?.vote || null,
      totalVotes,
    });

  } catch (error) {
    console.error("Errore nel recupero del voto:", error);
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    );
  }
} 