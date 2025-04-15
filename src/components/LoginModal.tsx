
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [selectedRole, setSelectedRole] = useState<'admin' | 'passenger'>('admin');
  const { login } = useAuth();

  if (!isOpen) return null;

  const handleLogin = () => {
    login(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-2">Select your role:</p>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={selectedRole === 'admin'}
                onChange={() => setSelectedRole('admin')}
                className="h-4 w-4 text-blue-600"
              />
              <span>Admin</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                checked={selectedRole === 'passenger'}
                onChange={() => setSelectedRole('passenger')}
                className="h-4 w-4 text-blue-600"
              />
              <span>Passenger</span>
            </label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={handleLogin}>
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
