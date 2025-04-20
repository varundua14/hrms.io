import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Attendance, Employee } from '../../types';

// Constants
const STATUS_OPTIONS = [
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'halfDay', label: 'Half Day' },
  { value: 'workFromHome', label: 'Work From Home' }
] as const;

const DEFAULT_FORM_VALUES = {
  status: 'present' as const,
  employeeId: '',
  employeeName: '',
  checkIn: '',
  checkOut: '',
  notes: ''
};

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Attendance>) => void;
  attendance: Attendance | null;
  employees: Employee[];
  selectedDate: string;
}

// Utility functions
const calculateWorkHours = (checkIn: string, checkOut: string): number | undefined => {
  const [checkInHours, checkInMinutes] = checkIn.split(':').map(Number);
  const [checkOutHours, checkOutMinutes] = checkOut.split(':').map(Number);
  
  const checkInTime = checkInHours * 60 + checkInMinutes;
  const checkOutTime = checkOutHours * 60 + checkOutMinutes;
  
  return checkOutTime > checkInTime ? (checkOutTime - checkInTime) / 60 : undefined;
};

const getEmployeeFullName = (employee: Employee): string => {
  return `${employee.firstName} ${employee.lastName}`.trim();
};

const AttendanceModal = ({
  isOpen,
  onClose,
  onSave,
  attendance,
  employees,
  selectedDate,
}: AttendanceModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Attendance>({
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      date: selectedDate
    }
  });

  const status = watch('status');
  const employeeId = watch('employeeId');
  const isPresent = status === 'present' || status === 'halfDay' || status === 'workFromHome';

  // Effects
  useEffect(() => {
    if (employeeId) {
      const selectedEmployee = employees.find(emp => emp.id === employeeId);
      if (selectedEmployee) {
        setValue('employeeName', getEmployeeFullName(selectedEmployee));
        setValue('date', selectedDate);
      }
    }
  }, [employeeId, employees, setValue, selectedDate]);

  useEffect(() => {
    reset(attendance || { ...DEFAULT_FORM_VALUES, date: selectedDate });
  }, [attendance, selectedDate, reset]);

  // Form submission handler
  const onSubmit = async (data: Attendance) => {
    if (!data.employeeId) return;

    const selectedEmployee = employees.find(emp => emp.id === data.employeeId);
    if (!selectedEmployee) return;

    const workHours = data.checkIn && data.checkOut 
      ? calculateWorkHours(data.checkIn, data.checkOut)
      : undefined;

    await onSave({
      ...data,
      employeeName: getEmployeeFullName(selectedEmployee),
      workHours,
      date: selectedDate
    });
  };

  if (!isOpen) return null;

  // Render helper functions
  const renderEmployeeFields = () => (
    <>
      <div className="form-group">
        <label className="form-label">
          Employee <span className="form-required">*</span>
        </label>
        <select
          className="form-select"
          {...register('employeeId', { required: 'Please select an employee' })}
        >
          <option value="">Select Employee</option>
          {employees
            ?.filter(emp => emp.status === 'active')
            .map((employee) => (
              <option key={employee.id} value={employee.id}>
                {getEmployeeFullName(employee)}
              </option>
            ))}
        </select>
        {errors.employeeId && (
          <p className="text-sm text-red-600 mt-1">{errors.employeeId.message}</p>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          Employee Name
        </label>
        <input
          type="text"
          className="form-input"
          disabled
          {...register('employeeName')}
        />
      </div>
    </>
  );

  const renderStatusField = () => (
    <div className="form-group">
      <label className="form-label">
        Status <span className="form-required">*</span>
      </label>
      <select
        className="form-select"
        {...register('status', { required: 'Status is required' })}
      >
        {STATUS_OPTIONS.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors.status && (
        <p className="text-sm text-red-600 mt-1">{errors.status.message}</p>
      )}
    </div>
  );

  const renderTimeFields = () => (
    isPresent && (
      <>
        <div className="form-group">
          <label className="form-label">
            Check In Time
          </label>
          <input
            type="time"
            className="form-input"
            {...register('checkIn')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Check Out Time
          </label>
          <input
            type="time"
            className="form-input"
            {...register('checkOut')}
          />
        </div>
      </>
    )
  );

  const renderNotesField = () => (
    <div className="form-group col-span-2">
      <label className="form-label">
        Notes
      </label>
      <textarea
        rows={3}
        className="form-textarea"
        {...register('notes')}
        placeholder="Add any additional notes here..."
      />
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {attendance ? 'Edit Attendance' : 'Mark Attendance'}
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body">
          <div className="form-grid">
            {renderEmployeeFields()}
            {renderStatusField()}
            {renderTimeFields()}
            {renderNotesField()}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="button button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="button button-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AttendanceModal;