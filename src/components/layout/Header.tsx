import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, BellIcon, LogOut, User as UserIcon, Settings, Search } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
  user: User | null;
}

const Header = ({ onMenuClick, user }: HeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <button
          type="button"
          className="menu-button"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-input"
          />
        </div>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="notification-container" ref={notificationRef}>
          <button
            className="notification-button"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <div className="notification-icon">
              <BellIcon className="h-6 w-6" />
              <span className="notification-badge" />
            </div>
          </button>

          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <h3>Notifications</h3>
              </div>
              <div className="notification-list">
                <div className="notification-item">
                  <p className="notification-title">Leave request approved</p>
                  <p className="notification-time">10 minutes ago</p>
                </div>
                <div className="notification-item">
                  <p className="notification-title">New candidate application</p>
                  <p className="notification-time">1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="user-menu-container" ref={userMenuRef}>
          <button
            className="user-profile"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="user-avatar">
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.firstName || user?.username || 'User'}</div>
              <div className="user-role">Administrator</div>
            </div>
          </button>

          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-dropdown-items">
                <button className="user-dropdown-item" onClick={() => {}}>
                  <UserIcon className="dropdown-icon" />
                  Profile
                </button>
                <button className="user-dropdown-item" onClick={() => {}}>
                  <Settings className="dropdown-icon" />
                  Settings
                </button>
                <button className="user-dropdown-item" onClick={handleLogout}>
                  <LogOut className="dropdown-icon" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;