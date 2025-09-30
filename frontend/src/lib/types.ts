export interface User {
  userId: string;
  role: 'operator' | 'faculty';
  token: string;
  email?: string;
  name?: string;
}

export interface Faculty {
  _id: string;
  name: string;
  email: string;
  role?: string;
  school?: string;
}

export interface Issue {
  _id: string;
  name: string;
  regNo: string;
  date: string;
  school: string;
  programme: string;
  category: string;
  gender: string;
  issue: string;
  status: 'Open' | 'Resolved';
  assignedFaculty?: {
    _id: string;
    name: string;
    email?: string;
    role?: string;
    school?: string;
  } | null;
  handler?: {
    _id: string;
    name: string;
    email?: string;
    role?: string;
  } | string;
  remark?: string | null;
  resolvedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueFilters {
  gender: string;
  school: string;
  status: string;
  category: string;
}