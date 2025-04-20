import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Clock, Calendar } from 'lucide-react';
import { api } from '../../services/api';
import { Attendance, Employee } from '../../types';
import DataTable from '../../components/ui/DataTable';
import Card from '../../components/ui/Card';
import AttendanceModal from './AttendanceModal';

const AttendancePage = () => {
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState<Attendance | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await api.getAttendance({ date: selectedDate });
      setAttendances(data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await api.getEmployees();
      setEmployees(data.filter(emp => emp.status === 'active'));
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleCreateAttendance = () => {
    setSelectedAttendance(null);
    setIsModalOpen(true);
  };

  const handleEditAttendance = (attendance: Attendance) => {
    setSelectedAttendance(attendance);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAttendance(null);
  };

  const handleSaveAttendance = async (data: Partial<Attendance>) => {
    try {
      if (selectedAttendance) {
        await api.updateAttendance(selectedAttendance.id, data);
      } else {
        const newAttendance = {
          ...data,
          date: selectedDate,
          employeeName: data.employeeName || '',
          status: data.status || 'present',
          checkIn: data.checkIn || '',
          checkOut: data.checkOut || ''
        };
        await api.markAttendance(newAttendance);
      }
      fetchAttendance();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save attendance:', error);
    }
  };

  const columns = [
    {
      key: 'employeeName',
      title: 'Employee',
      render: (attendance: Attendance) => (
        <div className="flex items-center">
          <div className="profile-placeholder">
            {attendance.employeeName.charAt(0)}
          </div>
          <span>{attendance.employeeName}</span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'Status',
      render: (attendance: Attendance) => {
        const statusColors: Record<string, string> = {
          present: 'bg-green-100 text-green-800',
          absent: 'bg-red-100 text-red-800',
          late: 'bg-yellow-100 text-yellow-800',
          halfDay: 'bg-orange-100 text-orange-800'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs ${statusColors[attendance.status] || ''}`}>
            {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'checkIn',
      title: 'Check In',
      render: (attendance: Attendance) => attendance.checkIn || '-',
    },
    {
      key: 'checkOut',
      title: 'Check Out',
      render: (attendance: Attendance) => attendance.checkOut || '-',
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (attendance: Attendance) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAttendance(attendance);
          }}
          className="text-gray-600 hover:text-primary-600"
        >
          <Clock className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const filterOptions = [
    {
      field: 'status',
      options: [
        { value: 'present', label: 'Present' },
        { value: 'absent', label: 'Absent' },
        { value: 'late', label: 'Late' },
        { value: 'halfDay', label: 'Half Day' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>

        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="px-3 py-2 border rounded-md"
            />
          </div>
          <button
            onClick={handleCreateAttendance}
            className="btn btn-primary flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Mark Attendance
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <DataTable
          data={attendances}
          columns={columns}
          keyField="id"
          onRowClick={handleEditAttendance}
          filterOptions={filterOptions}
          searchable
          searchFields={['employeeName']}
        />
      )}

      {isModalOpen && (
        <AttendanceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveAttendance}
          attendance={selectedAttendance}
          employees={employees}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
};

export default AttendancePage;