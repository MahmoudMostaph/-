import React, { useState } from 'react';

interface PasswordModalProps {
  onClose: () => void;
  onSubmit: (password: string) => void;
  error: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ onClose, onSubmit, error }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-sm m-4">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">الوصول للمشرف</h2>
        <p className="text-gray-400 mb-6 text-center">الرجاء إدخال كلمة المرور للمتابعة.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 text-center"
              placeholder="كلمة المرور"
              autoFocus
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              دخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
