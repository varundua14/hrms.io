import { NavLink } from 'react-router-dom';
import { Users, UserCheck, Calendar, Clock } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="logo-container">
        <div className="logo">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h1 className="logo-text">HRMS</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6">
        {/* Recruitment Group */}
        <div className="nav-group">
          <div className="nav-group-title">Recruitment</div>
          <div className="nav-list">
            <NavItem to="/candidates" icon={<Users />} label="Candidates" />
          </div>
        </div>

        {/* Organization Group */}
        <div className="nav-group">
          <div className="nav-group-title">Organization</div>
          <div className="nav-list">
            <NavItem to="/employees" icon={<UserCheck />} label="Employees" />
            <NavItem to="/attendance" icon={<Clock />} label="Attendance" />
            <NavItem to="/leaves" icon={<Calendar />} label="Leaves" />
          </div>
        </div>
      </nav>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `nav-item ${isActive ? 'active' : ''}`
      }
    >
      <span className="nav-icon">{icon}</span>
      {label}
    </NavLink>
  );
};

export default Sidebar;