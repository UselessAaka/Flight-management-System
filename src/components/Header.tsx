
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from './LoginModal';

const Header = () => {
  const { isAuthenticated, userRole, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold">Flight Database System</div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/" className="hover:text-blue-200">Dashboard</Link></li>
              <li><Link to="/flights" className="hover:text-blue-200">Flights</Link></li>
              <li><Link to="/airlines" className="hover:text-blue-200">Airlines</Link></li>
              <li><Link to="/airports" className="hover:text-blue-200">Airports</Link></li>
              <li><Link to="/bookings" className="hover:text-blue-200">Bookings</Link></li>
            </ul>
          </nav>
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <span className="flex items-center mr-2">
                  <User size={16} className="mr-1" />
                  {userRole}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={logout}
                >
                  <LogOut size={16} className="mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <LogIn size={16} className="mr-1" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </header>
  );
};

export default Header;
