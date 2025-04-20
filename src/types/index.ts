// Auth Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Candidate Types
export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'new' | 'screening' | 'interview' | 'selected' | 'rejected';
  position: string;
  department: string;
  expectedSalary: number;
  applyDate: Date;
  resume: {
    filename: string;
    path: string;
    originalName: string;
  };
  skills: string[];
  experience: number;
  notes?: string;
}

// Employee Types
export interface Employee {
  id: string;
  _id?: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joiningDate: string;
  status: 'active' | 'inactive' | 'onLeave';
  salary: number;
  profileImageUrl?: string;
  role?: 'employee' | 'manager' | 'hr' | 'admin' | 'director';
  address?: string;
}

// Attendance Types
export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  status: 'present' | 'absent' | 'halfDay' | 'workFromHome';
  checkIn?: string;
  checkOut?: string;
  workHours?: number;
  notes?: string;
}

// Leave Types
export interface Leave {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'casual' | 'sick' | 'annual' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  documentUrl?: string;
  approvedBy?: string;
  approvedDate?: string;
  notes?: string;
}

// Common UI Types
export interface TableColumn<T> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}