import { NextRequest, NextResponse } from "next/server";
import { MOCK_CASES_DATA } from "@/mocks/cases";
import { MOCK_EVIDENCE_FILES } from "@/mocks/evidence";
import { MOCK_CDR_RECORDS } from "@/mocks/cdr";
import { MOCK_GRAPH_NODES } from "@/mocks/graph";
import type { DataSourceCounts } from "@/types/graph";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("caseId");

    // Dynamic counts calculated from active investigation data
    let firCount = MOCK_EVIDENCE_FILES.length + MOCK_GRAPH_NODES.filter((n) => n.type === "evidence").length;
    let cdrCount = MOCK_CDR_RECORDS.length;
    let financialCount = MOCK_GRAPH_NODES.filter((n) => n.type === "account" || n.type === "organization").length * 16;
    let locationCount = MOCK_GRAPH_NODES.filter((n) => n.type === "location" || n.type === "vehicle").length * 24;

    if (caseId) {
      const activeCase = MOCK_CASES_DATA.find((c) => c.id.toLowerCase() === caseId.toLowerCase());
      if (activeCase) {
        const factor = Math.max(0.6, (activeCase.entities || 20) / 20);
        firCount = Math.round(MOCK_EVIDENCE_FILES.length * factor + 4);
        cdrCount = Math.round(MOCK_CDR_RECORDS.length * factor * 5);
        financialCount = Math.round(18 * factor);
        locationCount = Math.round(32 * factor);
      }
    }

    const counts: DataSourceCounts = {
      fir: firCount,
      cdr: cdrCount,
      financial: financialCount,
      location: locationCount,
    };

    return NextResponse.json(counts);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to calculate data source counts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
