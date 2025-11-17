import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from '../../api/axiosInstance';
import { saveUser, removeToken, clearUser } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const updateField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  // Keep local form in sync if user changes (e.g., after login)
  useEffect(() => {
    setForm({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
  }, [user]);

  const nameRef = useRef(null);

  // Focus name input when entering edit mode
  useEffect(() => {
    if (editing) {
      setMessage(null);
      setTimeout(() => nameRef.current && nameRef.current.focus(), 0);
    }
  }, [editing]);

  const handleSave = async () => {
    try {
      // call backend to persist changes
      const res = await axiosInstance.patch('/auth/profile', form);
      if (res.data && res.data.status) {
        const updatedUser = res.data.user;
        setUser && setUser(updatedUser);
        saveUser(updatedUser);
        setMessage('Profile updated');
        setEditing(false);
        return;
      }
      setMessage('Failed to update profile');
    } catch (err) {
      console.error('Error updating profile', err);
      setMessage(err?.response?.data?.message || 'Error updating profile');
    }
  };

  const handleLogout = () => {
    removeToken();
    clearUser();
    setUser && setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border border-white/50 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                {user?.name ? user.name.split(' ')[0][0] : 'U'}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-1">{user?.name || 'User'}</h2>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <i className="fas fa-envelope text-sm"></i>
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    user?.role === 'admin' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    <i className="fas fa-user-tag mr-1"></i>
                    {user?.role || 'customer'}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate('/my-bookings')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <i className="fas fa-calendar-check"></i>
                My Bookings
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Account Details Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-user-cog text-white text-xl"></i>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">Account Details</h3>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editing) {
                setEditing(true);
                return;
              }
              handleSave();
            }}
            className="space-y-6"
          >
            <div>
              <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <i className="fas fa-user text-primary-600"></i>
                Full Name
              </label>
              <input
                ref={nameRef}
                type="text"
                readOnly={!editing}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  !editing
                    ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                }`}
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <i className="fas fa-envelope text-primary-600"></i>
                Email Address
              </label>
              <input
                type="email"
                readOnly={!editing}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  !editing
                    ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                }`}
                value={form.email}
                onChange={(e) => updateField('email', e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <i className="fas fa-phone text-primary-600"></i>
                Phone Number
              </label>
              <input
                type="tel"
                readOnly={!editing}
                className={`w-full px-4 py-3 rounded-xl border-2 transition-all ${
                  !editing
                    ? 'bg-gray-100 text-gray-700 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-900 border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                }`}
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 pt-4">
              {!editing ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setMessage(null);
                    setEditing(true);
                    setTimeout(() => nameRef.current && nameRef.current.focus(), 0);
                  }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                >
                  <i className="fas fa-edit"></i>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
                  >
                    <i className="fas fa-save"></i>
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
                      setMessage(null);
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            {message && (
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                message.includes('updated') 
                  ? 'bg-green-50 border-l-4 border-green-500 text-green-800' 
                  : 'bg-red-50 border-l-4 border-red-500 text-red-800'
              }`}>
                <i className={`fas ${message.includes('updated') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                <span className="font-medium">{message}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
