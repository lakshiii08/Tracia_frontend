import { NextRequest, NextResponse } from "next/server";
import { queryGraphFromNeo4j } from "@/lib/neo4j";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cypher = searchParams.get("cypher") || undefined;
    const result = await queryGraphFromNeo4j(cypher);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch graph data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cypher = body.cypher as string | undefined;
    const result = await queryGraphFromNeo4j(cypher);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to execute Cypher query";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
