
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
        </div>
      </div>
    </header>
  );
};

export default Header;
