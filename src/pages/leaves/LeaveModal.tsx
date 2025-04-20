import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Calendar, Download } from 'lucide-react';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Leave, Employee } from '../../types';

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Leave>) => void;
  leave: Leave | null;
  employees: Employee[];
}

const LeaveModal = ({
  isOpen,
  onClose,
  onSave,
  leave,
  employees,
}: LeaveModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Leave>();

  const startDate = watch('startDate');
  const endDate = watch('endDate');

  useEffect(() => {
    if (leave) {
      reset(leave);
    } else {
      reset({
        type: 'casual',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(), 'yyyy-MM-dd'),
        days: 1,
        reason: '',
        status: 'pending',
      } as any);
    }
  }, [leave, reset]);

  // Calculate days when dates change
  useEffect(() => {
    if (startDate && endDate) {
      try {
        const start = parseISO(startDate);
        const end = parseISO(endDate);
        const days = differenceInDays(end, start) + 1;
        
        if (days > 0) {
          setValue('days', days);
        }
      } catch (error) {
        console.error('Error calculating days:', error);
      }
    }
  }, [startDate, endDate, setValue]);

  const onSubmit = async (data: Leave) => {
    setIsLoading(true);
    try {
      await onSave(data);
    } catch (error) {
      console.error('Error saving leave:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-lg px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="flex justify-between items-center mb-4 pb-3 border-b">
            <h3 className="text-lg font-medium text-gray-900">
              {leave ? 'Leave Details' : 'Apply for Leave'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <label htmlFor="employeeId" className="form-label">
                  Employee
                </label>
                <select
                  id="employeeId"
                  className="input-field"
                  disabled={!!leave}
                  {...register('employeeId', { required: 'Employee is required' })}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {`${employee.firstName} ${employee.lastName}`}
                    </option>
                  ))}
                </select>
                {errors.employeeId && <p className="form-error">{errors.employeeId.message}</p>}
              </div>

              <div>
                <label htmlFor="employeeName" className="form-label">
                  Employee Name (display only)
                </label>
                <input
                  type="text"
                  id="employeeName"
                  className="input-field"
                  disabled
                  placeholder="Will be auto-filled from employee selection"
                  {...register('employeeName')}
                />
              </div>

              <div>
                <label htmlFor="type" className="form-label">
                  Leave Type
                </label>
                <select
                  id="type"
                  className="input-field"
                  disabled={!!leave && leave.status !== 'pending'}
                  {...register('type', { required: 'Leave type is required' })}
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="annual">Annual Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
                {errors.type && <p className="form-error">{errors.type.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="form-label">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="input-field"
                    disabled={!!leave && leave.status !== 'pending'}
                    {...register('startDate', { required: 'Start date is required' })}
                  />
                  {errors.startDate && <p className="form-error">{errors.startDate.message}</p>}
                </div>

                <div>
                  <label htmlFor="endDate" className="form-label">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    className="input-field"
                    disabled={!!leave && leave.status !== 'pending'}
                    {...register('endDate', { required: 'End date is required' })}
                  />
                  {errors.endDate && <p className="form-error">{errors.endDate.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="days" className="form-label">
                  Days
                </label>
                <input
                  type="number"
                  id="days"
                  className="input-field"
                  disabled
                  {...register('days', {
                    required: 'Number of days is required',
                    min: { value: 1, message: 'Days must be at least 1' },
                  })}
                />
                {errors.days && <p className="form-error">{errors.days.message}</p>}
              </div>

              <div>
                <label htmlFor="reason" className="form-label">
                  Reason
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  className="input-field"
                  disabled={!!leave && leave.status !== 'pending'}
                  {...register('reason', { required: 'Reason is required' })}
                ></textarea>
                {errors.reason && <p className="form-error">{errors.reason.message}</p>}
              </div>

              <div>
                <label htmlFor="documentUrl" className="form-label">
                  Supporting Document URL (if applicable)
                </label>
                <input
                  type="text"
                  id="documentUrl"
                  className="input-field"
                  disabled={!!leave && leave.status !== 'pending'}
                  {...register('documentUrl')}
                />
              </div>

              {leave && (
                <div>
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <div className="mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        leave.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : leave.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                    </span>
                  </div>
                </div>
              )}

              {leave && leave.status !== 'pending' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Approved/Rejected By</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {leave.approvedBy || 'N/A'}
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Decision Date</label>
                    <div className="mt-1 text-sm text-gray-900">
                      {leave.approvedDate
                        ? format(parseISO(leave.approvedDate), 'MMM d, yyyy')
                        : 'N/A'}
                    </div>
                  </div>
                </div>
              )}

              {leave?.documentUrl && (
                <div className="bg-gray-50 rounded-md p-4 flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Supporting Document</h4>
                    <p className="text-sm text-gray-500">Download the supporting document</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary flex items-center"
                    onClick={() => {
                      // In a real app, this would trigger a download
                      alert(`Downloading document from ${leave.documentUrl}`);
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary"
              >
                {leave ? 'Close' : 'Cancel'}
              </button>

              {(!leave || leave.status === 'pending') && (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;