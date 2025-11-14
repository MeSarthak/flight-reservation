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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xl font-bold">
            {user?.name ? user.name.split(' ')[0][0] : 'U'}
          </div>
          <div>
            <h2 className="text-2xl">{user?.name || 'User'}</h2>
            <div className="text-sm text-gray-600">{user?.email}</div>
            <div className="text-sm text-gray-600">Role: {user?.role || 'customer'}</div>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => navigate('/my-bookings')} className="px-3 py-2 bg-blue-600 text-white rounded">My Bookings</button>
          <button type="button" onClick={handleLogout} className="px-3 py-2 bg-red-600 text-white rounded">Logout</button>
        </div>
      </div>

      <h3 className="text-lg mb-4 font-semibold">Account Details</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          // If not currently editing, toggle edit mode instead of saving
          if (!editing) {
            setEditing(true);
            return;
          }
          handleSave();
        }}
        className="space-y-4"
      >
        <div>
          <label className="block font-medium text-gray-200">Name</label>
          <input
            ref={nameRef}
            type="text"
            readOnly={!editing}
            className={`w-full border p-2 placeholder-gray-500 ${!editing ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300'}`}
            value={form.name}
            onChange={(e)=>updateField('name', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium text-gray-200">Email</label>
          <input
            type="email"
            readOnly={!editing}
            className={`w-full border p-2 placeholder-gray-500 ${!editing ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300'}`}
            value={form.email}
            onChange={(e)=>updateField('email', e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium text-gray-200">Phone</label>
          <input
            type="tel"
            readOnly={!editing}
            className={`w-full border p-2 placeholder-gray-500 ${!editing ? 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-300'}`}
            value={form.phone}
            onChange={(e)=>updateField('phone', e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          {!editing ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setMessage(null);
                setEditing(true);
                setTimeout(() => nameRef.current && nameRef.current.focus(), 0);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          ) : (
            <>
              <button type="button" onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => { setEditing(false); setForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' }); setMessage(null); }} className="px-4 py-2 border rounded">Cancel</button>
            </>
          )}
        </div>
        {message && <div className="text-sm text-blue-700">{message}</div>}
      </form>
    </div>
  );
};

export default Profile;
