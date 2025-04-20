import { useState, useEffect } from 'react';
import { X, Calendar, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { Employee } from '../../types';

interface LeaveFormProps {
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

interface LeaveFormData {
  employeeId: string;
  employeeName: string;
  type: 'casual' | 'sick' | 'annual' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending';
  documents: File | null;
  documentUrl?: string;
}

const LeaveForm = ({ onClose, onSubmit }: LeaveFormProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<LeaveFormData>({
    employeeId: '',
    employeeName: '',
    type: 'casual',
    startDate: '',
    endDate: '',
    days: 1,
    reason: '',
    status: 'pending',
    documents: null
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const employeeList = await api.getEmployees();
        setEmployees(employeeList);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };
    fetchEmployees();
  }, []);

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return 1;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create FormData for file upload
    const submitData = new FormData();
    submitData.append('employeeId', formData.employeeId);
    submitData.append('employeeName', formData.employeeName);
    submitData.append('type', formData.type);
    submitData.append('startDate', formData.startDate);
    submitData.append('endDate', formData.endDate);
    submitData.append('days', formData.days.toString());
    submitData.append('reason', formData.reason);
    submitData.append('status', formData.status);
    if (formData.documents) {
      submitData.append('documents', formData.documents);
    }
    onSubmit(submitData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'employeeId' && value) {
      const selectedEmployee = employees.find(emp => emp.id === value);
      if (selectedEmployee) {
        setFormData(prev => ({
          ...prev,
          employeeId: selectedEmployee.id,
          employeeName: `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
        }));
        return;
      }
    }

    if (name === 'startDate' || name === 'endDate') {
      const start = name === 'startDate' ? value : formData.startDate;
      const end = name === 'endDate' ? value : formData.endDate;
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        days: calculateDays(start, end)
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Create a URL for the uploaded file
      const documentUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        documents: file,
        documentUrl: documentUrl
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        documents: null,
        documentUrl: undefined
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Add New Leave</h2>
          <button className="modal-close" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Employee Name
                  <span className="form-required">*</span>
                </label>
                <select
                  name="employeeId"
                  className="form-select"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Leave Type
                  <span className="form-required">*</span>
                </label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="casual">Casual Leave</option>
                  <option value="sick">Sick Leave</option>
                  <option value="annual">Annual Leave</option>
                  <option value="maternity">Maternity Leave</option>
                  <option value="paternity">Paternity Leave</option>
                  <option value="unpaid">Unpaid Leave</option>
                </select>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">
                  Start Date
                  <span className="form-required">*</span>
                </label>
                <div className="date-input-wrapper">
                  <input
                    type="date"
                    name="startDate"
                    className="form-input"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                  <Calendar className="date-input-icon h-5 w-5" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  End Date
                  <span className="form-required">*</span>
                </label>
                <div className="date-input-wrapper">
                  <input
                    type="date"
                    name="endDate"
                    className="form-input"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate}
                    required
                  />
                  <Calendar className="date-input-icon h-5 w-5" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Number of Days
              </label>
              <input
                type="number"
                name="days"
                className="form-input"
                value={formData.days}
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Reason
                <span className="form-required">*</span>
              </label>
              <textarea
                name="reason"
                className="form-textarea"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Documents</label>
              <label className="file-upload">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Upload className="file-upload-icon h-5 w-5" />
                <span className="file-upload-text">
                  {formData.documents ? formData.documents.name : 'Click to upload or drag and drop'}
                </span>
              </label>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="button button-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="button button-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm; 