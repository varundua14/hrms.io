import { useState, useEffect } from 'react';
import { UserCheck, Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { Employee } from '../../types';
import DataTable from '../../components/ui/DataTable';
import EmployeeModal from './EmployeeModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

const EmployeesPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEmployees();
      console.log('Fetched employees data:', data);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      setError('Failed to fetch employees. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEmployee = () => {
    setSelectedEmployee(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaveEmployee = async (employeeData: Partial<Employee>) => {
    try {
      if (modalMode === 'create') {
        // Ensure all required fields are present and properly formatted
        const newEmployee = {
          name: `${employeeData.firstName || ''} ${employeeData.lastName || ''}`.trim(),
          firstName: employeeData.firstName || '',
          lastName: employeeData.lastName || '',
          email: employeeData.email || '',
          phone: employeeData.phone || '',
          position: employeeData.position || '',
          department: employeeData.department || 'Engineering',
          joiningDate: employeeData.joiningDate || new Date().toISOString().slice(0, 10),
          status: (employeeData.status as 'active' | 'inactive' | 'onLeave') || 'active',
          role: employeeData.role || 'employee',
          address: employeeData.address || '',
          salary: employeeData.salary || 0,
        };

        // Debug log before sending
        console.log('About to send employee data:', newEmployee);

        // Validate required fields
        if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || 
            !newEmployee.phone || !newEmployee.position || !newEmployee.department || 
            !newEmployee.role) {
          throw new Error('All required fields must be filled out');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newEmployee.email)) {
          throw new Error('Invalid email format');
        }

        const response = await api.createEmployee(newEmployee);
        console.log('Server response after creating employee:', response);
      } else if (modalMode === 'edit' && selectedEmployee) {
        await api.updateEmployee(selectedEmployee.id, employeeData);
      }
      await fetchEmployees();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save employee:', error);
      setError(error instanceof Error ? error.message : 'Failed to save employee. Please check all required fields and try again.');
    }
  };

  const handleDeleteClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedEmployee) {
      try {
        await api.deleteEmployee(selectedEmployee.id);
        fetchEmployees();
      } catch (error) {
        console.error('Failed to delete employee:', error);
      }
    }
    setIsDeleteConfirmOpen(false);
    setSelectedEmployee(null);
  };

  const columns = [
    {
      key: 'name',
      title: 'Name',
      render: (employee: Employee) => {
        if (!employee || !employee.name) {
          return employee.firstName && employee.lastName 
            ? `${employee.firstName} ${employee.lastName}`
            : '-';
        }
        
        return (
          <div className="flex items-center">
            {employee.profileImageUrl ? (
              <img
                src={employee.profileImageUrl}
                alt={employee.name}
                className="profile-image"
              />
            ) : (
              <div className="profile-placeholder">
                {employee.name?.charAt(0) || '?'}
              </div>
            )}
            <span>{employee.name}</span>
          </div>
        );
      },
    },
    { 
      key: 'phone', 
      title: 'Phone',
      render: (employee: Employee & { phone?: string }) => {
        console.log('Phone value:', employee.phone);
        return employee.phone || '-';
      }
    },
    { 
      key: 'position', 
      title: 'Position',
      render: (employee: Employee) => employee.position || '-'
    },
    { 
      key: 'department', 
      title: 'Department',
      render: (employee: Employee) => employee.department || '-'
    },
    { 
      key: 'email', 
      title: 'Email',
      render: (employee: Employee) => employee.email || '-'
    },
    {
      key: 'status',
      title: 'Status',
      render: (employee: Employee) => {
        if (!employee || !employee.status) {
          return <div>-</div>;
        }

        const statusColors = {
          active: 'bg-green-100 text-green-800',
          inactive: 'bg-red-100 text-red-800',
          onLeave: 'bg-amber-100 text-amber-800',
        };
        
        const statusText = {
          active: 'Active',
          inactive: 'Inactive',
          onLeave: 'On Leave',
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[employee.status]}`}>
            {statusText[employee.status]}
          </span>
        );
      },
    },
    {
      key: 'joiningDate',
      title: 'Join Date',
      render: (employee: Employee) => {
        if (!employee || !employee.joiningDate) {
          return <div>-</div>;
        }
        return new Date(employee.joiningDate).toLocaleDateString();
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (employee: Employee) => (
        <div className="flex space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditEmployee(employee);
            }}
            className="p-1 text-gray-600 hover:text-primary-600"
            title="Edit Employee"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(employee);
            }}
            className="p-1 text-gray-600 hover:text-red-600"
            title="Delete Employee"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      field: 'department',
      options: [
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Design', label: 'Design' },
        { value: 'Marketing', label: 'Marketing' },
        { value: 'HR', label: 'HR' },
        { value: 'Finance', label: 'Finance' },
      ],
    },
    {
      field: 'status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'onLeave', label: 'On Leave' },
      ],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        
        </div>
        <button
          onClick={handleCreateEmployee}
          className="btn btn-primary flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      <div className="relative">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <p className="text-lg mb-4">No employees found</p>
            <button
              onClick={handleCreateEmployee}
              className="btn btn-primary flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </button>
          </div>
        ) : (
          <DataTable
            data={employees}
            columns={columns}
            keyField="id"
            onRowClick={handleViewEmployee}
            filterOptions={filterOptions}
            searchable
            searchFields={['firstName', 'lastName', 'email', 'position', 'department']}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[90vh] overflow-hidden">
            <EmployeeModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={handleSaveEmployee}
              employee={selectedEmployee}
              mode={modalMode}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={isDeleteConfirmOpen}
        title="Delete Employee"
        message={`Are you sure you want to delete ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteConfirmOpen(false)}
        type="danger"
      />
    </div>
  );
};

export default EmployeesPage;