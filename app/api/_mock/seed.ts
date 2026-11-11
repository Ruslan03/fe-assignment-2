import type {
  Department,
  EmploymentType,
  Member,
  MemberAnalytics,
  UserProfile,
} from "./types"

export const SEED_CURRENT_USER: UserProfile = {
  id: "usr-001",
  name: "Alex Vance",
  role: "Lead Architect",
}

export const SEED_DEPARTMENTS: Department[] = [
  { id: "dept-001", name: "Engineering" },
  { id: "dept-002", name: "Design" },
  { id: "dept-003", name: "Product" },
  { id: "dept-004", name: "Marketing" },
  { id: "dept-005", name: "Operations" },
]

export const SEED_EMPLOYMENT_TYPES: EmploymentType[] = [
  { id: "emp-001", name: "Full-Time" },
  { id: "emp-002", name: "Part-Time" },
  { id: "emp-003", name: "Contract" },
  { id: "emp-004", name: "Internship" },
]

export const SEED_MEMBERS: Member[] = [
  {
    id: "mem-001",
    name: "Ruslan Wanandi",
    email: "ruslan.wanandi@company.com",
    role: "Front-end Engineer",
    department: "Engineering",
    status: "active",
    joinDate: "2025-03-10T09:00:00.000Z",
  },
  {
    id: "mem-002",
    name: "Alya Putri",
    email: "alya.putri@company.com",
    role: "Product Designer",
    department: "Design",
    status: "active",
    joinDate: "2025-06-15T09:00:00.000Z",
  },
  {
    id: "mem-003",
    name: "Bima Pratama",
    email: "bima.pratama@company.com",
    role: "Backend Engineer",
    department: "Engineering",
    status: "active",
    joinDate: "2025-09-01T09:00:00.000Z",
  },
  {
    id: "mem-004",
    name: "Citra Lestari",
    email: "citra.lestari@company.com",
    role: "Product Manager",
    department: "Product",
    status: "active",
    joinDate: "2026-01-20T09:00:00.000Z",
  },
  {
    id: "mem-005",
    name: "Dimas Nugroho",
    email: "dimas.nugroho@company.com",
    role: "QA Engineer",
    department: "Engineering",
    status: "inactive",
    joinDate: "2026-04-12T09:00:00.000Z",
  },
  {
    id: "mem-006",
    name: "Eka Wijaya",
    email: "eka.wijaya@company.com",
    role: "Growth Specialist",
    department: "Marketing",
    status: "active",
    joinDate: "2026-08-05T09:00:00.000Z",
  },
  {
    id: "mem-007",
    name: "Farah Nabila",
    email: "farah.nabila@company.com",
    role: "Operations Lead",
    department: "Operations",
    status: "active",
    joinDate: "2026-11-02T09:00:00.000Z",
  },
  {
    id: "mem-008",
    name: "Gilang Ramadhan",
    email: "gilang.ramadhan@company.com",
    role: "UI/UX Researcher",
    department: "Design",
    status: "inactive",
    joinDate: "2026-11-05T09:00:00.000Z",
  },
]

export const SEED_PENDING_INVITES = 3

export const SEED_MEMBER_ANALYTICS: Record<string, MemberAnalytics> = {
  "mem-001": { totalRepository: 42, totalDeployment: 1489 },
  "mem-002": { totalRepository: 18, totalDeployment: 312 },
  "mem-003": { totalRepository: 57, totalDeployment: 2140 },
  "mem-004": { totalRepository: 11, totalDeployment: 94 },
  "mem-005": { totalRepository: 26, totalDeployment: 645 },
  "mem-006": { totalRepository: 8, totalDeployment: 120 },
  "mem-007": { totalRepository: 15, totalDeployment: 430 },
  "mem-008": { totalRepository: 14, totalDeployment: 185 },
}
