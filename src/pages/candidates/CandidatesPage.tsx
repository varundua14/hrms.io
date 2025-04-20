import { useState, useEffect } from 'react';
import { Users, Plus, Download, UserCheck, Search } from 'lucide-react';
import { api } from '../../services/api';
import { Candidate } from '../../types';
import DataTable from '../../components/ui/DataTable';
import CandidateModal from './CandidateModal';

const CandidatesPage = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      console.log('Fetching candidates from all sources...');
      const data = await api.getCandidates();
      console.log('Received candidates data:', data);
      
      if (Array.isArray(data)) {
        setCandidates(data);
        console.log('Updated candidates state with combined data:', data.length);
      } else {
        console.error('Received non-array data:', data);
        setCandidates([]);
        showMessage('error', 'Invalid data format received');
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
      showMessage('error', 'Failed to fetch candidates');
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCandidate = () => {
    setSelectedCandidate(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCandidate(null);
  };

  const handleSaveCandidate = async (data: FormData | Partial<Candidate>) => {
    try {
      if (data instanceof FormData) {
        if (modalMode === 'create') {
          await api.createCandidate(data);
        } else if (modalMode === 'edit' && selectedCandidate) {
          await api.updateCandidate(selectedCandidate.id, data);
        }
      }
      fetchCandidates();
      handleCloseModal();
      showMessage('success', modalMode === 'create' ? 'Candidate created successfully' : 'Candidate updated successfully');
    } catch (error) {
      console.error('Failed to save candidate:', error);
      showMessage('error', 'Failed to save candidate');
    }
  };

  const handleMoveToEmployee = async (candidateId: string) => {
    try {
      const candidate = candidates.find(c => c.id === candidateId);
      if (!candidate) return;
      
      await api.moveToEmployee(candidateId, {
        department: candidate.department || '',
        salary: candidate.expectedSalary || 0
      });
      showMessage('success', 'Candidate successfully moved to employees');
      fetchCandidates();
    } catch (error) {
      console.error('Failed to move candidate to employee:', error);
      showMessage('error', 'Failed to move candidate to employee');
    }
  };

  const downloadResume = async (candidateId: string) => {
    try {
      await api.downloadResume(candidateId);
    } catch (error) {
      console.error('Failed to download resume:', error);
      showMessage('error', 'Failed to download resume');
    }
  };

  const handleStatusChange = async (candidate: Candidate, newStatus: string) => {
    try {
      const formData = new FormData();
      formData.append('status', newStatus);
      await api.updateCandidate(candidate.id, formData);
      fetchCandidates();
      showMessage('success', 'Status updated successfully');
    } catch (error) {
      console.error('Failed to update candidate status:', error);
      showMessage('error', 'Failed to update status');
    }
  };

  const columns = [
    {
      key: 'srNo',
      title: 'Sr no.',
      render: (_: any, index: number) => (
        <div className="text-gray-900">{String(index + 1).padStart(2, '0')}</div>
      ),
    },
    {
      key: 'name',
      title: 'Candidates Name',
      sortable: true,
      render: (candidate: Candidate) => (
        <div className="text-gray-900">{`${candidate.firstName} ${candidate.lastName}`}</div>
      ),
    },
    {
      key: 'email',
      title: 'Email Address',
      render: (candidate: Candidate) => (
        <div className="text-gray-900">{candidate.email}</div>
      ),
    },
    {
      key: 'phone',
      title: 'Phone Number',
      render: (candidate: Candidate) => (
        <div className="text-gray-900">{candidate.phone}</div>
      ),
    },
    {
      key: 'position',
      title: 'Position',
      sortable: true,
      render: (candidate: Candidate) => (
        <div className="text-gray-900">{candidate.position}</div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (candidate: Candidate) => (
        <select
          value={candidate.status}
          onChange={(e) => {
            e.stopPropagation();
            handleStatusChange(candidate, e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          className="px-4 py-1 rounded-full text-sm bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="new">New</option>
          <option value="screening">Screening</option>
          <option value="interview">Interview</option>
          <option value="selected">Selected</option>
          <option value="rejected">Rejected</option>
        </select>
      ),
    },
    {
      key: 'experience',
      title: 'Experience',
      sortable: true,
      render: (candidate: Candidate) => (
        <div className="text-gray-900">{candidate.experience}</div>
      ),
    },
    {
      key: 'actions',
      title: 'Action',
      render: (candidate: Candidate) => (
        <div className="flex items-center space-x-3">
          {candidate.resume && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                downloadResume(candidate.id);
              }}
              className="text-gray-600 hover:text-purple-600 transition-colors"
              title="Download Resume"
            >
              <Download className="h-5 w-5" />
            </button>
          )}
          {candidate.status === 'selected' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMoveToEmployee(candidate.id);
              }}
              className="text-gray-600 hover:text-purple-600 transition-colors"
              title="Move to Employee"
            >
              <UserCheck className="h-5 w-5" />
            </button>
          )}
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      field: 'status',
      options: [
        { value: 'new', label: 'New' },
        { value: 'screening', label: 'Screening' },
        { value: 'interview', label: 'Interview' },
        { value: 'selected', label: 'Selected' },
        { value: 'rejected', label: 'Rejected' },
      ],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {message && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all duration-500 ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-200'
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
        </div>
        <button
          onClick={handleCreateCandidate}
          style={{ backgroundColor: 'var(--primary-dark)' }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Candidate
        </button>
      </div>

      <DataTable
        data={candidates}
        columns={columns}
        keyField="id"
        filterOptions={filterOptions}
        searchable
        searchFields={['firstName', 'lastName', 'email', 'position']}
        onRowClick={handleViewCandidate}
      />

      {isModalOpen && (
        <CandidateModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveCandidate}
          candidate={selectedCandidate}
          mode={modalMode}
          onMoveToEmployee={handleMoveToEmployee}
        />
      )}
    </div>
  );
};

export default CandidatesPage;
