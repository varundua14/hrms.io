import { Candidate, Employee, Attendance, Leave } from '../types';

// API Configuration
export const API_URL = 'https://hrms-backend.onrender.com/api';

// Mock data
const mockCandidates: Candidate[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    status: 'new',
    position: 'Software Engineer',
    department: 'Engineering',
    expectedSalary: 85000,
    applyDate: '2024-01-15',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: 3,
    resume: {
      filename: 'resume-john.pdf',
      path: '/files/resume-john.pdf',
      originalName: 'John_Doe_Resume.pdf'
    }
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 234-5678',
    status: 'screening',
    position: 'UI/UX Designer',
    department: 'Design',
    expectedSalary: 75000,
    applyDate: '2024-01-16',
    skills: ['Figma', 'Adobe XD', 'User Research'],
    experience: 2,
    resume: {
      filename: 'resume-jane.pdf',
      path: '/files/resume-jane.pdf',
      originalName: 'Jane_Smith_Resume.pdf'
    }
  },
  {
    id: '3',
    firstName: 'Mike',
    lastName: 'Johnson',
    email: 'mike.johnson@example.com',
    phone: '(555) 345-6789',
    status: 'interview',
    position: 'Product Manager',
    department: 'Product',
    expectedSalary: 95000,
    applyDate: '2024-01-17',
    skills: ['Agile', 'Scrum', 'Product Strategy'],
    experience: 5,
    resume: {
      filename: 'resume-mike.pdf',
      path: '/files/resume-mike.pdf',
      originalName: 'Mike_Johnson_Resume.pdf'
    }
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@example.com',
    phone: '(555) 456-7890',
    status: 'selected',
    position: 'Marketing Manager',
    department: 'Marketing',
    expectedSalary: 80000,
    applyDate: '2024-01-18',
    skills: ['Digital Marketing', 'SEO', 'Content Strategy'],
    experience: 4,
    resume: {
      filename: 'resume-sarah.pdf',
      path: '/files/resume-sarah.pdf',
      originalName: 'Sarah_Williams_Resume.pdf'
    }
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@example.com',
    phone: '(555) 567-8901',
    status: 'rejected',
    position: 'Marketing Manager',
    department: 'Marketing',
    expectedSalary: 85000,
    applyDate: '2024-01-19',
    skills: ['Digital Marketing', 'SEO', 'Social Media'],
    experience: 6,
    resume: {
      filename: 'resume-david.pdf',
      path: '/files/resume-david.pdf',
      originalName: 'David_Wilson_Resume.pdf'
    }
  }
];

const mockEmployees: Employee[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 111-2222',
    department: 'Engineering',
    position: 'Senior Developer',
    joiningDate: '2022-01-15',
    status: 'active',
    salary: 85000,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 333-4444',
    department: 'Design',
    position: 'UI/UX Designer',
    joiningDate: '2022-03-10',
    status: 'active',
    salary: 75000,
    profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    firstName: 'Robert',
    lastName: 'Johnson',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '(555) 555-6666',
    department: 'Marketing',
    position: 'Marketing Manager',
    joiningDate: '2021-11-05',
    status: 'inactive',
    salary: 90000,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    firstName: 'Lisa',
    lastName: 'Brown',
    name: 'Lisa Brown',
    email: 'lisa.brown@example.com',
    phone: '(555) 777-8888',
    department: 'HR',
    position: 'HR Coordinator',
    joiningDate: '2023-02-20',
    status: 'active',
    salary: 65000,
    profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    firstName: 'Michael',
    lastName: 'Wilson',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    phone: '(555) 999-0000',
    department: 'Finance',
    position: 'Financial Analyst',
    joiningDate: '2022-06-15',
    status: 'inactive',
    salary: 80000,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/5.jpg'
  }
];

const mockAttendance: Attendance[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    date: '2025-05-15',
    status: 'present',
    checkIn: '09:00',
    checkOut: '17:30',
    workHours: 8.5,
    notes: 'Regular day at office'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jane Smith',
    date: '2025-05-15',
    status: 'present',
    checkIn: '08:45',
    checkOut: '17:15',
    workHours: 8.5,
    notes: 'Completed design review'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Robert Johnson',
    date: '2025-05-15',
    status: 'absent',
    notes: 'Sick leave'
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Lisa Brown',
    date: '2025-05-15',
    status: 'present',
    checkIn: '09:10',
    checkOut: '18:00',
    workHours: 8.83,
    notes: 'Extended hours for HR meeting'
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Michael Wilson',
    date: '2025-05-15',
    status: 'halfDay',
    checkIn: '09:00',
    checkOut: '13:00',
    workHours: 4,
    notes: 'Doctor appointment'
  }
];

const mockLeaves: Leave[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'John Doe',
    type: 'casual',
    startDate: '2025-05-20',
    endDate: '2025-05-21',
    days: 2,
    reason: 'Personal matters',
    status: 'approved',
    approvedBy: 'Lisa Brown',
    approvedDate: '2025-05-16',
    notes: 'Approved by HR'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Jane Smith',
    type: 'sick',
    startDate: '2025-05-18',
    endDate: '2025-05-19',
    days: 2,
    reason: 'Feeling unwell',
    status: 'pending',
    documentUrl: '/files/medical-jane.pdf',
    notes: 'Medical certificate attached'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Robert Johnson',
    type: 'annual',
    startDate: '2025-06-01',
    endDate: '2025-06-07',
    days: 7,
    reason: 'Family vacation',
    status: 'approved',
    approvedBy: 'Lisa Brown',
    approvedDate: '2025-05-10',
    notes: 'Annual leave approved'
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'Lisa Brown',
    type: 'casual',
    startDate: '2025-05-25',
    endDate: '2025-05-25',
    days: 1,
    reason: 'Family commitment',
    status: 'pending',
    notes: 'Pending approval from manager'
  },
  {
    id: '5',
    employeeId: '5',
    employeeName: 'Michael Wilson',
    type: 'sick',
    startDate: '2025-05-16',
    endDate: '2025-05-17',
    days: 2,
    reason: 'Medical appointment',
    status: 'rejected',
    documentUrl: '/files/medical-michael.pdf',
    approvedBy: 'Lisa Brown',
    approvedDate: '2025-05-15',
    notes: 'Insufficient sick leave balance'
  }
];

interface DatabaseCandidate {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'new' | 'screening' | 'interview' | 'selected' | 'rejected';
  position: string;
  department: string;
  expectedSalary: number;
  applyDate: string;
  resume?: {
    filename: string;
    path: string;
    originalName: string;
  };
  skills: string[];
  experience: number;
  notes?: string;
}

function transformCandidate(data: DatabaseCandidate): Candidate {
  return {
    id: data._id,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    status: data.status,
    position: data.position,
    department: data.department || 'Engineering',
    expectedSalary: data.expectedSalary || 0,
    applyDate: data.applyDate,
    resume: data.resume,
    skills: data.skills,
    experience: data.experience,
    notes: data.notes
  };
}

// Mock API service
export const api = {
  // Auth
  login: async (email: string, password: string) => {
    // This would be an actual API call
    if (email === 'hr@example.com' && password === 'password') {
      return {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          username: 'hrmanager',
          email: 'hr@example.com',
          role: 'HR Manager',
          firstName: 'John',
          lastName: 'Doe',
        },
      };
    }
    throw new Error('Invalid credentials');
  },

  // Candidates
  getCandidates: async (): Promise<Candidate[]> => {
    try {
      console.log('Fetching candidates from both sources...');
      
      // Start with mock data
      let allCandidates = [...mockCandidates];
      console.log('Added mock candidates:', allCandidates.length);
      
      // Try to fetch from database
      try {
        const response = await fetch(`${API_URL}/candidates`);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Raw database candidates:', data);
          
          if (Array.isArray(data)) {
            // Transform database data to match frontend format
            const databaseCandidates = data.map((candidate: any) => ({
              id: candidate._id || candidate.id,
              firstName: candidate.firstName,
              lastName: candidate.lastName,
              email: candidate.email,
              phone: candidate.phone,
              status: candidate.status,
              position: candidate.position,
              department: candidate.department || 'Engineering',
              expectedSalary: candidate.expectedSalary || 0,
              applyDate: new Date(candidate.applyDate).toISOString().split('T')[0],
              resume: candidate.resume,
              skills: candidate.skills || [],
              experience: candidate.experience || 0,
              notes: candidate.notes || ''
            }));
            
            console.log('Transformed database candidates:', databaseCandidates.length);
            
            // Add database candidates to the list
            allCandidates = [...allCandidates, ...databaseCandidates];
            console.log('Total candidates after adding database data:', allCandidates.length);
          }
        }
      } catch (dbError) {
        console.error('Error fetching from database:', dbError);
        console.log('Continuing with mock data only');
      }
      
      // Sort by apply date (newest first)
      allCandidates.sort((a: Candidate, b: Candidate) => 
        new Date(b.applyDate).getTime() - new Date(a.applyDate).getTime()
      );
      
      console.log('Final combined candidates list:', allCandidates.length);
      return allCandidates;
    } catch (error) {
      console.error('Error in getCandidates:', error);
      return [...mockCandidates]; // Fallback to mock data only
    }
  },

  getCandidate: async (id: string): Promise<Candidate | undefined> => {
    try {
      const response = await fetch(`${API_URL}/candidates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch candidate');
      const data = await response.json();
      return { ...data, id: data._id };
    } catch (error) {
      console.log('Using mock candidate data');
      return mockCandidates.find(candidate => candidate.id === id);
    }
  },

  createCandidate: async (formData: FormData): Promise<Candidate> => {
    try {
      const response = await fetch(`${API_URL}/candidates`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create candidate');
      }

      const savedCandidate = await response.json();
      return transformCandidate(savedCandidate);
    } catch (error) {
      console.log('Using mock data - creating candidate');
      const formDataObj = Object.fromEntries(formData.entries());
      const newCandidate: Candidate = {
        id: (mockCandidates.length + 1).toString(),
        firstName: formDataObj.firstName as string,
        lastName: formDataObj.lastName as string,
        email: formDataObj.email as string,
        phone: formDataObj.phone as string,
        status: 'new',
        position: formDataObj.position as string,
        department: formDataObj.department as string || 'Engineering',
        expectedSalary: Number(formDataObj.expectedSalary) || 0,
        applyDate: new Date().toISOString().split('T')[0],
        skills: (formDataObj.skills as string).split(','),
        experience: Number(formDataObj.experience),
        resume: formDataObj.resume ? {
          filename: (formDataObj.resume as File).name,
          path: URL.createObjectURL(formDataObj.resume as Blob),
          originalName: (formDataObj.resume as File).name
        } : undefined
    };
    mockCandidates.push(newCandidate);
    return newCandidate;
    }
  },

  updateCandidate: async (id: string, formData: FormData): Promise<Candidate> => {
    try {
      const response = await fetch(`${API_URL}/candidates/${id}`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }

      const updatedCandidate = await response.json();
      return transformCandidate(updatedCandidate);
    } catch (error) {
      console.log('Using mock data - updating candidate');
      const formDataObj = Object.fromEntries(formData.entries());
      const candidateIndex = mockCandidates.findIndex(c => c.id === id);
      if (candidateIndex === -1) {
        throw new Error('Candidate not found');
      }
      const updatedCandidate: Candidate = {
        ...mockCandidates[candidateIndex],
        firstName: formDataObj.firstName as string,
        lastName: formDataObj.lastName as string,
        email: formDataObj.email as string,
        phone: formDataObj.phone as string,
        position: formDataObj.position as string,
        skills: (formDataObj.skills as string).split(','),
        experience: Number(formDataObj.experience),
        resume: formDataObj.resume ? {
          filename: (formDataObj.resume as File).name,
          path: URL.createObjectURL(formDataObj.resume as Blob),
          originalName: (formDataObj.resume as File).name
        } : mockCandidates[candidateIndex].resume
      };
      mockCandidates[candidateIndex] = updatedCandidate;
    return updatedCandidate;
    }
  },

  deleteCandidate: async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/candidates/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete candidate');
    } catch (error) {
      console.log('Using mock data - deleting candidate');
      const candidateIndex = mockCandidates.findIndex(c => c.id === id);
      if (candidateIndex === -1) throw new Error('Candidate not found');
      mockCandidates.splice(candidateIndex, 1);
    }
  },

  downloadResume: async (id: string): Promise<void> => {
    try {
      // First try to get the candidate to check if resume exists
      const candidate = await api.getCandidate(id);
      if (!candidate?.resume) {
        throw new Error('Resume not found');
      }

      // For mock data, handle the blob URL directly
      if (candidate.resume.path.startsWith('blob:')) {
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = candidate.resume.path;
        link.download = candidate.resume.originalName || `${candidate.firstName}_${candidate.lastName}_resume.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return;
      }

      // For real API, make the request
      const response = await fetch(`${API_URL}/candidates/${id}/resume`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = url;
      link.download = candidate.resume.originalName || `${candidate.firstName}_${candidate.lastName}_resume.pdf`;
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Error downloading resume:', error);
      throw error;
    }
  },

  moveToEmployee: async (id: string, employeeData: { department: string; salary: number }): Promise<void> => {
    try {
      // First try to get the candidate from the database
      let candidate;
      try {
        const response = await fetch(`${API_URL}/candidates/${id}`);
        if (response.ok) {
          const data = await response.json();
          candidate = transformCandidate(data);
        }
      } catch (dbError) {
        console.log('Failed to fetch candidate from database, trying mock data:', dbError);
      }

      // If not found in database, try mock data
      if (!candidate) {
        candidate = mockCandidates.find(c => c.id === id);
      }

      // If still not found, throw error
      if (!candidate) {
        throw new Error('Candidate not found');
      }

      // Ensure we have a department value
      const department = employeeData.department || candidate.department || 'Engineering';
      const salary = employeeData.salary || candidate.expectedSalary || 0;

      try {
        // Try to move candidate to employee in the database
        const response = await fetch(`${API_URL}/candidates/${id}/move-to-employee`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            department: department,
            salary: salary,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            position: candidate.position,
            joiningDate: new Date().toISOString().split('T')[0],
            status: 'active',
            role: 'employee'
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to move candidate to employee');
        }

        // If successful, remove from mock candidates if it exists there
        const candidateIndex = mockCandidates.findIndex(c => c.id === id);
        if (candidateIndex !== -1) {
          mockCandidates.splice(candidateIndex, 1);
        }
      } catch (apiError) {
        console.log('Failed to move candidate in database, using mock data:', apiError);
        
        // Create new mock employee
        const newEmployee = {
          id: (mockEmployees.length + 1).toString(),
          firstName: candidate.firstName,
          lastName: candidate.lastName,
          name: `${candidate.firstName} ${candidate.lastName}`,
          email: candidate.email,
          phone: candidate.phone,
          department: department,
          position: candidate.position,
          joiningDate: new Date().toISOString().split('T')[0],
          status: 'active' as const,
          salary: salary,
          role: 'employee' as const
        };

        // Add to mock employees
        mockEmployees.push(newEmployee);

        // Remove from mock candidates
        const candidateIndex = mockCandidates.findIndex(c => c.id === id);
        if (candidateIndex !== -1) {
          mockCandidates.splice(candidateIndex, 1);
        }
      }
    } catch (error) {
      console.error('Error moving candidate to employee:', error);
      throw error;
    }
  },

  // Employees
  getEmployees: async (): Promise<Employee[]> => {
    try {
      // Try to fetch from database first
      const response = await fetch(`${API_URL}/employees`);
      let databaseEmployees: Employee[] = [];
      if (response.ok) {
        const data = await response.json();
        databaseEmployees = data.map((emp: any) => ({
          ...emp,
          id: emp.id || emp._id, // Handle both id formats
          name: `${emp.firstName} ${emp.lastName}`.trim()
        }));
        console.log('Database employees:', databaseEmployees);
      }

      // Get mock data
      const mockData = [...mockEmployees].map(emp => ({
        ...emp,
        name: `${emp.firstName} ${emp.lastName}`.trim()
      }));
      console.log('Mock employees:', mockData);

      // Combine both sets of data
      const combinedEmployees = [...databaseEmployees, ...mockData];
      console.log('Combined employees:', combinedEmployees);
      return combinedEmployees;
    } catch (error) {
      console.log('Error fetching database data, falling back to mock data only');
      return [...mockEmployees].map(emp => ({
        ...emp,
        name: `${emp.firstName} ${emp.lastName}`.trim()
      }));
    }
  },

  getEmployee: async (id: string): Promise<Employee | undefined> => {
    try {
      const response = await fetch(`${API_URL}/employees/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch employee');
      }
      const data = await response.json();
      return {
        ...data,
        id: data.id || data._id,
        name: `${data.firstName} ${data.lastName}`.trim()
      };
    } catch (error) {
      console.error('Error fetching employee:', error);
      return undefined;
    }
  },

  createEmployee: async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
    // Transform the data to match the server's schema
    const employeeData = {
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      salary: employee.salary || 0,
      status: employee.status || 'active',
      joinDate: employee.joiningDate, // Note: backend uses joinDate, not joiningDate
    };

    console.log('Sending employee data to server:', employeeData);

    const response = await fetch(`${API_URL}/employees`, {
      method: 'POST',
      body: JSON.stringify(employeeData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Server error:', errorData);
      throw new Error(errorData.message || 'Failed to create employee');
    }

    const savedEmployee = await response.json();
    // Transform the response to match our frontend model
    return {
      ...savedEmployee,
      id: savedEmployee.id || savedEmployee._id, // Handle both id formats
      name: `${savedEmployee.firstName} ${savedEmployee.lastName}`,
      joiningDate: savedEmployee.joinDate, // Convert joinDate to joiningDate for frontend
    };
  },

  updateEmployee: async (id: string, employeeData: Partial<Employee>): Promise<Employee> => {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to update employee');
    return response.json();
  },

  deleteEmployee: async (id: string): Promise<boolean> => {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete employee');
    return true;
  },

  // Attendance
  getAttendance: async (filters?: { date?: string }): Promise<Attendance[]> => {
    try {
      // Try to fetch from database first
      const queryParams = filters?.date ? `?date=${filters.date}` : '';
      const response = await fetch(`${API_URL}/attendance${queryParams}`);
      let databaseAttendance: Attendance[] = [];
      
      if (response.ok) {
        const data = await response.json();
        console.log('Raw database attendance:', data);
        
        // Transform database data to match frontend format
        databaseAttendance = data.map((att: any) => ({
          id: att._id || att.id,
          employeeId: att.employeeId,
          employeeName: att.employeeName,
          date: new Date(att.date).toISOString().split('T')[0],
          status: att.status,
          checkIn: att.checkIn || null,
          checkOut: att.checkOut || null,
          workHours: att.workHours || 0,
          notes: att.notes || ''
        }));
        console.log('Transformed database attendance:', databaseAttendance);
      }

      // Get mock data
      let mockData = [...mockAttendance];
      if (filters?.date) {
        mockData = mockData.filter(a => a.date === filters.date);
      }
      console.log('Mock attendance:', mockData);

      // Combine both sets of data
      let combinedAttendance = [...databaseAttendance, ...mockData];
      console.log('Combined attendance:', combinedAttendance);
      
      // Sort by date (newest first) and then by employee name
      combinedAttendance.sort((a, b) => {
        const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateCompare === 0) {
          return a.employeeName.localeCompare(b.employeeName);
        }
        return dateCompare;
      });

      return combinedAttendance;
    } catch (error) {
      console.log('Error fetching database data, falling back to mock data only:', error);
      let result = [...mockAttendance];
      if (filters?.date) {
        result = result.filter(a => a.date === filters.date);
      }
    return result;
    }
  },

  markAttendance: async (attendance: Omit<Attendance, 'id'>): Promise<Attendance> => {
    try {
      // Ensure we have all required fields
      if (!attendance.employeeId || !attendance.date || !attendance.status) {
        throw new Error('Missing required fields');
      }

      // Get all employees (both mock and database)
      const allEmployees = await api.getEmployees();
      const employee = allEmployees.find(emp => emp.id === attendance.employeeId);

      if (!employee) {
        throw new Error('Employee not found');
      }

      const attendanceData = {
        employeeId: employee._id || employee.id, // Use MongoDB _id if available
        employeeName: `${employee.firstName} ${employee.lastName}`.trim(),
        date: new Date(attendance.date).toISOString(), // Properly format date
        status: attendance.status,
        checkIn: attendance.checkIn || null,
        checkOut: attendance.checkOut || null,
        workHours: attendance.workHours || 0,
        notes: attendance.notes || ''
      };

      try {
        console.log('Sending attendance data to server:', attendanceData);
        const response = await fetch(`${API_URL}/attendance`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(attendanceData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const savedAttendance = await response.json();
        console.log('Saved attendance to database:', savedAttendance);
        
        return {
          ...savedAttendance,
          id: savedAttendance._id || savedAttendance.id,
          date: new Date(savedAttendance.date).toISOString().split('T')[0], // Format date for frontend
          checkIn: savedAttendance.checkIn,
          checkOut: savedAttendance.checkOut
        };
      } catch (dbError) {
        console.log('Failed to save to database, using mock data:', dbError);
        // Add to mock attendance data
        const mockData = {
      ...attendance,
          id: (mockAttendance.length + 1).toString(),
          employeeName: `${employee.firstName} ${employee.lastName}`.trim()
        };
        mockAttendance.push(mockData);
        console.log('Saved attendance to mock data:', mockData);
        return mockData;
      }
    } catch (error: any) {
      console.error('Error marking attendance:', error);
      throw new Error(error.message || 'Failed to mark attendance');
    }
  },

  updateAttendance: async (id: string, attendanceData: Partial<Attendance>): Promise<Attendance> => {
    const response = await fetch(`${API_URL}/attendance/${id}`, {
      method: 'PUT',
      body: JSON.stringify(attendanceData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error('Failed to update attendance');
    return response.json();
  },

  // Leaves
  getLeaves: async (filters?: { status?: string }): Promise<Leave[]> => {
    try {
      // Try to fetch from database first
      const queryParams = filters?.status ? `?status=${filters.status}` : '';
      const response = await fetch(`${API_URL}/leaves${queryParams}`);
      let databaseLeaves: Leave[] = [];
      
      if (response.ok) {
        const data = await response.json();
        console.log('Raw database leaves:', data);
        
        // Transform database data to match frontend format
        databaseLeaves = data.map((leave: any) => ({
          id: leave._id || leave.id,
          employeeId: leave.employeeId,
          employeeName: leave.employeeName,
          type: leave.type,
          startDate: new Date(leave.startDate).toISOString().split('T')[0],
          endDate: new Date(leave.endDate).toISOString().split('T')[0],
          days: leave.days,
          reason: leave.reason,
          status: leave.status || 'pending',
          approvedBy: leave.approvedBy,
          approvedDate: leave.approvedDate ? new Date(leave.approvedDate).toISOString().split('T')[0] : undefined,
          notes: leave.notes || '',
          documentUrl: leave.documentUrl
        }));
        console.log('Transformed database leaves:', databaseLeaves);
      }

      // Get mock data
      let mockData = [...mockLeaves];
      if (filters?.status) {
        mockData = mockData.filter(l => l.status === filters.status);
      }
      console.log('Mock leaves:', mockData);

      // Combine both sets of data
      let combinedLeaves = [...databaseLeaves, ...mockData];
      console.log('Combined leaves:', combinedLeaves);
      
      // Sort by date (newest first) and then by employee name
      combinedLeaves.sort((a, b) => {
        const dateCompare = new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        if (dateCompare === 0) {
          return a.employeeName.localeCompare(b.employeeName);
        }
        return dateCompare;
      });

      return combinedLeaves;
    } catch (error) {
      console.log('Error fetching database data, falling back to mock data only:', error);
      let result = [...mockLeaves];
      if (filters?.status) {
        result = result.filter(l => l.status === filters.status);
      }
    return result;
    }
  },

  getLeave: async (id: string): Promise<Leave | undefined> => {
    try {
      const response = await fetch(`${API_URL}/leaves/${id}`);
      if (response.ok) {
        const data = await response.json();
        return {
          ...data,
          id: data._id || data.id
        };
      }
      throw new Error('Failed to fetch from database');
    } catch (error) {
      console.log('Using mock data - fetching leave');
      return mockLeaves.find(leave => leave.id === id);
    }
  },

  createLeave: async (leave: Omit<Leave, 'id'>): Promise<Leave> => {
    try {
      // Get employee data to ensure it exists and to get the name
      const allEmployees = await api.getEmployees();
      const employee = allEmployees.find(emp => emp.id === leave.employeeId);
      
      if (!employee) {
        throw new Error(`Employee not found with ID: ${leave.employeeId}`);
      }

      const leaveData = {
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`.trim(),
        type: leave.type,
        startDate: leave.startDate,
        endDate: leave.endDate,
        days: leave.days,
        reason: leave.reason,
        status: leave.status || 'pending',
        documentUrl: leave.documentUrl
      };

      try {
        console.log('Sending leave data to server:', leaveData);
        const response = await fetch(`${API_URL}/leaves`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leaveData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const savedLeave = await response.json();
        console.log('Saved leave to database:', savedLeave);
        
        return {
          ...savedLeave,
          id: savedLeave._id || savedLeave.id,
          startDate: savedLeave.startDate,
          endDate: savedLeave.endDate
        };
      } catch (dbError) {
        console.log('Failed to save to database, using mock data:', dbError);
        // Add to mock leaves data
        const mockData: Leave = {
          ...leaveData,
          id: (mockLeaves.length + 1).toString(),
          status: 'pending',
          approvedBy: undefined,
          approvedDate: undefined
        };
        mockLeaves.push(mockData);
        console.log('Saved leave to mock data:', mockData);
        return mockData;
      }
    } catch (error: any) {
      console.error('Error creating leave:', error);
      throw error;
    }
  },

  updateLeave: async (id: string, leaveData: Partial<Leave>): Promise<Leave> => {
    try {
      // Find the existing leave first
      const currentLeaves = await api.getLeaves();
      const existingLeave = currentLeaves.find(leave => leave.id === id);
      
      if (!existingLeave) {
        throw new Error('Leave not found');
      }

      // If we're updating the status to approved or rejected, add approval details
      const updatedData = {
        ...leaveData,
        approvedDate: leaveData.status === 'approved' || leaveData.status === 'rejected' 
          ? new Date().toISOString()
          : existingLeave.approvedDate
      };

      try {
        console.log('Sending leave update to server:', updatedData);
        const response = await fetch(`${API_URL}/leaves/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          throw new Error(`Server returned ${response.status}: ${errorText}`);
        }

        const savedLeave = await response.json();
        console.log('Updated leave in database:', savedLeave);
        
        return {
          ...savedLeave,
          id: savedLeave._id || savedLeave.id,
          startDate: new Date(savedLeave.startDate).toISOString().split('T')[0],
          endDate: new Date(savedLeave.endDate).toISOString().split('T')[0],
          approvedDate: savedLeave.approvedDate ? new Date(savedLeave.approvedDate).toISOString().split('T')[0] : undefined
        };
      } catch (dbError) {
        console.log('Failed to update in database, updating mock data:', dbError);
        
        // Update in mock data
        const leaveIndex = mockLeaves.findIndex(leave => leave.id === id);
        if (leaveIndex === -1) {
          throw new Error('Leave not found in mock data');
        }

        const updatedLeave: Leave = {
          ...mockLeaves[leaveIndex],
          ...updatedData,
          id: id // Ensure we keep the same ID
        };

        mockLeaves[leaveIndex] = updatedLeave;
        console.log('Updated leave in mock data:', updatedLeave);
    return updatedLeave;
      }
    } catch (error: any) {
      console.error('Error updating leave:', error);
      throw new Error(error.message || 'Failed to update leave');
    }
  },

  downloadLeaveDocument: async (documentUrl: string): Promise<void> => {
    try {
      // For mock data or relative URLs, create a download link
      if (documentUrl.startsWith('/')) {
        // For mock data, simulate a download with a dummy PDF
        const blob = new Blob(['Mock document content'], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = documentUrl.split('/').pop() || 'document.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        return;
      }

      // For actual API calls
      const response = await fetch(`${API_URL}/documents/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ documentUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Try to get the original filename from the Content-Disposition header
      const contentDisposition = response.headers.get('Content-Disposition');
      const filenameMatch = contentDisposition && contentDisposition.match(/filename="(.+)"/);
      a.download = filenameMatch ? filenameMatch[1] : documentUrl.split('/').pop() || 'document';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  },
};
