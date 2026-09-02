import type { User } from "@/types/accessControl";

export const MOCK_USERS: User[] = [
  {
    id: "usr-admin",
    name: "Inspector A. Admin",
    role: "ADMIN",
    badgeNumber: "ADM-9001",
    department: "Central Cyber Crime HQ",
    avatar: "shield",
    email: "admin@tracia.gov.in",
  },
  {
    id: "IO-101",
    name: "Det. J. Smith",
    role: "INVESTIGATING_OFFICER",
    badgeNumber: "IO-10142",
    department: "Financial Fraud Cell",
    avatar: "person",
    email: "j.smith@tracia.gov.in",
  },
  {
    id: "IO-102",
    name: "Officer C. Patel",
    role: "INVESTIGATING_OFFICER",
    badgeNumber: "IO-10289",
    department: "Cyber Threat Taskforce",
    avatar: "person",
    email: "c.patel@tracia.gov.in",
  },
  {
    id: "IO-103",
    name: "FinAnalyst K. Roy",
    role: "INVESTIGATING_OFFICER",
    badgeNumber: "IO-10355",
    department: "Anti-Money Laundering Squad",
    avatar: "person",
    email: "k.roy@tracia.gov.in",
  },
  {
    id: "usr-senior",
    name: "Supv. M. Thorne",
    role: "SENIOR_OFFICER",
    badgeNumber: "SUP-3001",
    department: "Special Operations Division",
    avatar: "badge",
    email: "m.thorne@tracia.gov.in",
  },
  {
    id: "usr-cyber",
    name: "Cyber Expert R. Varma",
    role: "CYBER_OFFICER",
    badgeNumber: "CYB-4099",
    department: "Digital Forensics Lab",
    avatar: "terminal",
    email: "r.varma@tracia.gov.in",
  },
];

export const DEFAULT_USER = MOCK_USERS[0]; // Admin by default
