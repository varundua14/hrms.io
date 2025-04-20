import { useState, useEffect } from 'react';
import { format, parseISO, isWithinInterval, addDays } from 'date-fns';
import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Calendar as CalendarIcon, Plus, Download, CheckCircle, XCircle, Check, X, FileDown, Search } from 'lucide-react';
import { api, API_URL } from '../../services/api';
import { Leave, Employee } from '../../types';
import DataTable from '../../components/ui/DataTable';
import LeaveModal from './LeaveModal';
import LeaveCalendar from './LeaveCalendar';
import Card from '../../components/ui/Card';
import LeaveForm from '../../components/leaves/LeaveForm';

const LeavesPage = () => {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All status');
  const [typeFilter, setTypeFilter] = useState('All type');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await api.getLeaves();
      setLeaves(data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await api.getEmployees();
      // Only include active employees
      setEmployees(data.filter(emp => emp.status === 'active'));
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleCreateLeave = () => {
    setSelectedLeave(null);
    setIsModalOpen(true);
  };

  const handleViewLeave = (leave: Leave) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLeave(null);
  };

  const handleSaveLeave = async (leaveData: Partial<Leave>) => {
    try {
      if (selectedLeave) {
        await api.updateLeave(selectedLeave.id, leaveData);
      } else {
        await api.createLeave(leaveData as Omit<Leave, 'id'>);
      }
      fetchLeaves();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save leave:', error);
    }
  };

  const handleUpdateLeaveStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.updateLeave(id, {
        status,
        approvedBy: 'HR Manager',
        approvedDate: format(new Date(), 'yyyy-MM-dd'),
      });
      fetchLeaves();
    } catch (error) {
      console.error('Failed to update leave status:', error);
    }
  };

  const downloadDocument = async (documentUrl?: string) => {
    if (!documentUrl) return;
    try {
      await api.downloadLeaveDocument(documentUrl);
    } catch (error) {
      console.error('Failed to download document:', error);
    }
  };

  const columns = [
    {
      key: 'employeeName',
      title: 'Employee',
      sortable: true,
    },
    {
      key: 'type',
      title: 'Type',
      render: (leave: Leave) => {
        const typeLabels: Record<string, string> = {
          casual: 'Casual',
          sick: 'Sick',
          annual: 'Annual',
          maternity: 'Maternity',
          paternity: 'Paternity',
          unpaid: 'Unpaid',
        };
        
        return typeLabels[leave.type] || leave.type;
      },
    },
    {
      key: 'dates',
      title: 'Dates',
      render: (leave: Leave) => {
        const start = format(parseISO(leave.startDate), 'MMM d, yyyy');
        const end = format(parseISO(leave.endDate), 'MMM d, yyyy');
        return start === end ? start : `${start} - ${end}`;
      },
    },
    {
      key: 'days',
      title: 'Days',
      render: (leave: Leave) => `${leave.days} ${leave.days === 1 ? 'day' : 'days'}`,
    },
    {
      key: 'status',
      title: 'Status',
      render: (leave: Leave) => {
        const statusColors = {
          pending: 'bg-amber-100 text-amber-800',
          approved: 'bg-green-100 text-green-800',
          rejected: 'bg-red-100 text-red-800',
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[leave.status]}`}>
            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (leave: Leave) => (
        <div className="flex space-x-2">
          {leave.documentUrl && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadDocument(leave.documentUrl);
              }}
              className="p-1 text-gray-600 hover:text-primary-600"
              title="Download Document"
            >
              <Download className="h-4 w-4" />
            </button>
          )}
          
          {leave.status === 'pending' && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateLeaveStatus(leave.id, 'approved');
                }}
                className="p-1 text-gray-600 hover:text-green-600"
                title="Approve Leave"
              >
                <CheckCircle className="h-4 w-4" />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpdateLeaveStatus(leave.id, 'rejected');
                }}
                className="p-1 text-gray-600 hover:text-red-600"
                title="Reject Leave"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      field: 'status',
      options: [
        { value: 'pending', label: 'Pending' },
        { value: 'approved', label: 'Approved' },
        { value: 'rejected', label: 'Rejected' },
      ],
    },
    {
      field: 'type',
      options: [
        { value: 'casual', label: 'Casual' },
        { value: 'sick', label: 'Sick' },
        { value: 'annual', label: 'Annual' },
        { value: 'maternity', label: 'Maternity' },
        { value: 'paternity', label: 'Paternity' },
        { value: 'unpaid', label: 'Unpaid' },
      ],
    },
  ];

  // Get approved leaves for calendar
  const approvedLeaves = leaves.filter((leave) => leave.status === 'approved');

  const handleSubmit = async (formData: FormData) => {
    try {
      const document = formData.get('documents') as File | null;
      
      // Convert FormData to the expected format
      const leaveData = {
        employeeId: formData.get('employeeId') as string,
        employeeName: formData.get('employeeName') as string,
        type: formData.get('type') as Leave['type'],
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        days: parseInt(formData.get('days') as string),
        reason: formData.get('reason') as string,
        status: 'pending' as const,
        documentUrl: document ? `/uploads/leaves/${document.name}` : undefined
      };

      // If there's a document, upload it first
      if (document) {
        const documentFormData = new FormData();
        documentFormData.append('file', document);
        try {
          const uploadResponse = await fetch(`${API_URL}/documents/upload`, {
            method: 'POST',
            body: documentFormData
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload document');
          }
          
          const uploadResult = await uploadResponse.json();
          leaveData.documentUrl = uploadResult.url; // Use the URL from the server
        } catch (uploadError) {
          console.error('Document upload failed:', uploadError);
          // Continue with leave creation even if document upload fails
        }
      }

      await api.createLeave(leaveData);
      await fetchLeaves();
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create leave:', error);
    }
  };

  const filteredLeaves = leaves.filter(leave => {
    const matchesStatus = statusFilter === 'All status' || leave.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesType = typeFilter === 'All type' || leave.type.toLowerCase() === typeFilter.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      leave.employeeName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leaves</h1>
          <p className="text-sm text-gray-500">Manage employee leave requests</p>
        </div>
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="btn btn-secondary flex items-center"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {viewMode === 'list' ? 'Calendar View' : 'List View'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            Apply Leave
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="w-full">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-md text-base min-h-[44px]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border rounded-md text-base min-w-[150px] min-h-[44px]"
            >
              <option value="All status">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2.5 border rounded-md text-base min-w-[150px] min-h-[44px]"
            >
              <option value="All type">All Types</option>
              <option value="casual">Casual</option>
              <option value="sick">Sick</option>
              <option value="annual">Annual</option>
            </select>
          </div>
          <div className="leaves-table-container">
            <table className="leaves-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} onClick={() => handleViewLeave(leave)}>
                    <td>{leave.employeeName}</td>
                    <td>{leave.type.charAt(0).toUpperCase() + leave.type.slice(1)}</td>
                    <td>
                      {format(parseISO(leave.startDate), 'MMM d, yyyy')}
                      {leave.startDate !== leave.endDate && 
                        ` - ${format(parseISO(leave.endDate), 'MMM d, yyyy')}`}
                    </td>
                    <td>{leave.days} {leave.days === 1 ? 'day' : 'days'}</td>
                    <td>
                      <span className={`status-badge ${
                        leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                        leave.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        {leave.documentUrl && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadDocument(leave.documentUrl);
                            }}
                            className="action-button"
                            title="Download Document"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                        {leave.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateLeaveStatus(leave.id, 'approved');
                              }}
                              className="action-button"
                              title="Approve Leave"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateLeaveStatus(leave.id, 'rejected');
                              }}
                              className="action-button"
                              title="Reject Leave"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <Card title="Leave Calendar" icon={<CalendarIcon className="h-5 w-5 text-primary-600" />}>
          <LeaveCalendar leaves={approvedLeaves} />
        </Card>
      )}

      {isModalOpen && (
        <LeaveModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveLeave}
          leave={selectedLeave}
          employees={employees}
        />
      )}

      {showForm && (
        <LeaveForm
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default LeavesPage;