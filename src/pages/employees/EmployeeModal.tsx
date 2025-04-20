import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Employee } from '../../types';

interface EmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
  employee: Employee | null;
  mode: 'create' | 'edit' | 'view';
}

const EmployeeModal = ({
  isOpen,
  onClose,
  onSave,
  employee,
  mode,
}: EmployeeModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Employee>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      joiningDate: new Date().toISOString().slice(0, 10),
      status: 'active',
      role: 'employee',
    }
  });

  useEffect(() => {
    if (employee && (mode === 'edit' || mode === 'view')) {
      reset(employee);
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: '',
        position: '',
        joiningDate: new Date().toISOString().slice(0, 10),
        status: 'active',
        role: 'employee',
      });
    }
  }, [employee, mode, reset]);

  const onSubmit = async (data: Employee) => {
    const formattedData = {
      ...data,
      name: `${data.firstName} ${data.lastName}`.trim(),
      phone: data.phone || '',
      status: data.status || 'active',
      role: data.role || 'employee',
    };
    await onSave(formattedData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Add New Employee' : mode === 'edit' ? 'Edit Employee' : 'View Employee'}
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">
                  First Name <span className="form-required">*</span>
                </label>
                <input
                  type="text"
                  {...register('firstName', { required: 'First name is required' })}
                  className="form-input"
                  placeholder="Enter first name"
                  disabled={mode === 'view'}
                />
                {errors.firstName && (
                  <p className="form-error">{errors.firstName.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Last Name <span className="form-required">*</span>
                </label>
                <input
                  type="text"
                  {...register('lastName', { required: 'Last name is required' })}
                  className="form-input"
                  placeholder="Enter last name"
                  disabled={mode === 'view'}
                />
                {errors.lastName && (
                  <p className="form-error">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">
                  Email <span className="form-required">*</span>
                </label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className="form-input"
                  placeholder="Enter email address"
                  disabled={mode === 'view'}
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Phone <span className="form-required">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone number is required' })}
                  className="form-input"
                  placeholder="Enter phone number"
                  disabled={mode === 'view'}
                />
                {errors.phone && (
                  <p className="form-error">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">
                  Department <span className="form-required">*</span>
                </label>
                <select
                  {...register('department', { required: 'Department is required' })}
                  className="form-input"
                  disabled={mode === 'view'}
                >
                  <option value="">Select Department</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
                {errors.department && (
                  <p className="form-error">{errors.department.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Position <span className="form-required">*</span>
                </label>
                <input
                  type="text"
                  {...register('position', { required: 'Position is required' })}
                  className="form-input"
                  placeholder="Enter position"
                  disabled={mode === 'view'}
                />
                {errors.position && (
                  <p className="form-error">{errors.position.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">
                  Joining Date <span className="form-required">*</span>
                </label>
                <input
                  type="date"
                  {...register('joiningDate', { required: 'Joining date is required' })}
                  className="form-input"
                  disabled={mode === 'view'}
                />
                {errors.joiningDate && (
                  <p className="form-error">{errors.joiningDate.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Status <span className="form-required">*</span>
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="form-input"
                  disabled={mode === 'view'}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="onLeave">On Leave</option>
                </select>
                {errors.status && (
                  <p className="form-error">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">
                  Role <span className="form-required">*</span>
                </label>
                <select
                  {...register('role', { required: 'Role is required' })}
                  className="form-input"
                  disabled={mode === 'view'}
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="hr">HR Staff</option>
                  <option value="admin">Admin</option>
                  <option value="director">Director</option>
                </select>
                {errors.role && (
                  <p className="form-error">{errors.role.message}</p>
                )}
              </div>

              {mode !== 'create' && (
                <div className="form-group">
                  <label className="form-label">
                    Salary
                  </label>
                  <input
                    type="number"
                    {...register('salary')}
                    className="form-input"
                    placeholder="Enter salary"
                    disabled={mode === 'view'}
                  />
                  {errors.salary && (
                    <p className="form-error">{errors.salary.message}</p>
                  )}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Address
              </label>
              <textarea
                {...register('address')}
                rows={3}
                className="form-textarea"
                placeholder="Enter address"
                disabled={mode === 'view'}
              />
              {errors.address && (
                <p className="form-error">{errors.address.message}</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="button button-secondary"
              >
                Cancel
              </button>
              {mode !== 'view' && (
                <button
                  type="submit"
                  className="button button-primary"
                >
                  {mode === 'create' ? 'Save' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeModal;