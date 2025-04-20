import { useState } from 'react';
import { format, addMonths, subMonths, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Leave } from '../../types';

interface LeaveCalendarProps {
  leaves: Leave[];
}

const LeaveCalendar = ({ leaves }: LeaveCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const onDateClick = (day: Date) => {
    setSelectedDate(day);
  };

  const renderHeader = () => {
    return (
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={prevMonth}
            className="p-2 border rounded hover:bg-gray-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-lg font-medium">
            {format(currentMonth, 'MMMM, yyyy')}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 border rounded hover:bg-gray-50"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const currentMonthLeaves = leaves.filter((leave) => {
      const start = parseISO(leave.startDate);
      const end = parseISO(leave.endDate);
      return (
        isWithinInterval(monthStart, { start, end }) ||
        isWithinInterval(monthEnd, { start, end }) ||
        (monthStart <= start && monthEnd >= end)
      );
    });

    const getLeavesForDay = (day: Date) => {
      return currentMonthLeaves.filter((leave) => {
        const start = parseISO(leave.startDate);
        const end = parseISO(leave.endDate);
        return isWithinInterval(day, { start, end });
      });
    };

    const weeks = [];
    let days = [];
    let day = startDate;

    // Header row with day names
    const dayNames = (
      <tr>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayName) => (
          <th key={dayName} className="pb-2 text-sm font-medium w-9 text-center">
            {dayName}
          </th>
        ))}
      </tr>
    );

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const currentDay = day;
        const formattedDate = format(currentDay, 'd');
        const dayLeaves = getLeavesForDay(currentDay);
        const isCurrentMonth = isSameMonth(currentDay, monthStart);
        const isSelected = isSameDay(currentDay, selectedDate);
        
        days.push(
          <td
            key={currentDay.toString()}
            className={`text-center align-top p-0
              ${!isCurrentMonth ? 'text-gray-400' : ''}
              ${isSelected ? 'bg-[#4A1D7A] text-white rounded' : ''}
            `}
            onClick={() => onDateClick(currentDay)}
            style={{ cursor: 'pointer' }}
          >
            <div className="min-h-[32px] p-1">
              {formattedDate}
              {dayLeaves.length > 0 && (
                <div className="text-xs text-[#4A1D7A]">
                  {dayLeaves.length} leave
                </div>
              )}
            </div>
          </td>
        );
        day = addDays(day, 1);
      }
      weeks.push(
        <tr key={day.toString()} className="align-top">
          {days}
        </tr>
      );
      days = [];
    }

    return (
      <table className="w-full table-fixed">
        <thead>{dayNames}</thead>
        <tbody>{weeks}</tbody>
      </table>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg max-w-md">
      {renderHeader()}
      {renderCalendar()}
      {leaves.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-[#4A1D7A] mb-3">Approved Leaves</h3>
          <div className="space-y-2">
            {leaves.filter(leave => leave.status === 'approved').map(leave => (
              <div key={leave.id} className="text-sm">
                {leave.employeeName}
                <span className="text-gray-600">
                  {' '}{format(parseISO(leave.startDate), 'MMM d')}
                  {leave.startDate !== leave.endDate && 
                    ` - ${format(parseISO(leave.endDate), 'MMM d')}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to add days
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export default LeaveCalendar;