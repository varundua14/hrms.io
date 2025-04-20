import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Download, UserCheck, Upload } from 'lucide-react';
import { Candidate } from '../../types';
import { toast } from 'react-hot-toast';
import { api, API_URL } from '../../services/api';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: FormData | Partial<Candidate>) => void;
  onMoveToEmployee: (candidateId: string) => void;
  candidate: Candidate | null;
  mode: 'create' | 'edit' | 'view';
}

const CandidateModal = ({
  isOpen,
  onClose,
  onSave,
  onMoveToEmployee,
  candidate,
  mode,
}: CandidateModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Candidate>();

  useEffect(() => {
    if (candidate && (mode === 'edit' || mode === 'view')) {
      reset(candidate);
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        status: 'new',
        position: '',
        applyDate: new Date().toISOString().slice(0, 10),
        skills: [],
        experience: 0,
        notes: '',
      } as any);
    }
  }, [candidate, mode, reset]);

  const onSubmit = async (data: Candidate) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'skills' && Array.isArray(value)) {
          formData.append(key, value.join(','));
        } else if (key !== 'resume' && value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      // Add resume file if exists
      if (resumeFile) {
        formData.append('resume', resumeFile);
      }
      
      console.log('Submitting form data:', Object.fromEntries(formData.entries()));
      await onSave(formData);
      setResumeFile(null);
      toast.success(mode === 'create' ? 'Candidate created successfully' : 'Candidate updated successfully');
    } catch (error) {
      console.error('Error saving candidate:', error);
      toast.error('Failed to save candidate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setResumeFile(file);
      } else {
        alert('Please upload a PDF or DOC file');
        e.target.value = '';
      }
    }
  };

  const handleMoveToEmployee = () => {
    if (candidate) {
      onMoveToEmployee(candidate.id);
      onClose();
    }
  };

  const handleDownloadResume = async () => {
    if (!candidate?.id) {
      toast.error('No candidate selected');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/candidates/resume/${candidate.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to download resume');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume-${candidate.firstName}-${candidate.lastName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Add New Candidate' : mode === 'edit' ? 'Edit Candidate' : 'View Candidate'}
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

              <div className="form-group">
                <label className="form-label">
                  Status <span className="form-required">*</span>
                </label>
                <select
                  {...register('status', { required: 'Status is required' })}
                  className="form-input"
                  disabled={mode === 'view'}
                >
                  <option value="new">New</option>
                  <option value="screening">Screening</option>
                  <option value="interview">Interview</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                </select>
                {errors.status && (
                  <p className="form-error">{errors.status.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="form-group">
                <label className="form-label">
                  Apply Date <span className="form-required">*</span>
                </label>
                <input
                  type="date"
                  {...register('applyDate', { required: 'Apply date is required' })}
                  className="form-input"
                  disabled={mode === 'view'}
                />
                {errors.applyDate && (
                  <p className="form-error">{errors.applyDate.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Experience (years) <span className="form-required">*</span>
                </label>
                <input
                  type="number"
                  {...register('experience', {
                    required: 'Experience is required',
                    min: { value: 0, message: 'Experience cannot be negative' },
                  })}
                  className="form-input"
                  placeholder="Enter years of experience"
                  disabled={mode === 'view'}
                />
                {errors.experience && (
                  <p className="form-error">{errors.experience.message}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                Skills (comma separated)
              </label>
              <input
                type="text"
                className="form-input"
                disabled={mode === 'view'}
                {...register('skills')}
                defaultValue={candidate?.skills?.join(', ') || ''}
                onChange={(e) => {
                  const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                  setValue('skills', skillsArray);
                }}
                placeholder="Enter skills (e.g. React, TypeScript, Node.js)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Resume (PDF or DOC)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer">
                  <Upload className="h-5 w-5 mr-2" />
                  {resumeFile ? resumeFile.name : 'Choose file'}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    disabled={mode === 'view'}
                  />
                </label>
                {(mode === 'view' && candidate?.resume) && (
                  <button
                    type="button"
                    onClick={handleDownloadResume}
                    className="flex items-center px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                  >
                    <Download className="h-5 w-5 mr-1" />
                    Download Resume
                  </button>
                )}
              </div>
              {resumeFile && (
                <p className="text-sm text-gray-500 mt-1">
                  Selected file: {resumeFile.name}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                Notes
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="form-textarea"
                placeholder="Enter additional notes"
                disabled={mode === 'view'}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="button button-secondary"
              >
                Cancel
              </button>
              {mode === 'view' && candidate && (
                <button
                  type="button"
                  onClick={handleMoveToEmployee}
                  className="button button-primary"
                >
                  <UserCheck className="h-5 w-5 mr-2" />
                  Move to Employee
                </button>
              )}
              {mode !== 'view' && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="button button-primary"
                >
                  {isLoading ? 'Saving...' : mode === 'create' ? 'Save' : 'Save Changes'}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
