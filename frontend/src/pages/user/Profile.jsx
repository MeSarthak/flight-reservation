import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { saveUser, removeToken, clearUser } from "../../utils/storage";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const updateField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    // No server-side profile update endpoint found in backend; update client state/localStorage
    const updated = { ...user, ...form };
    setUser && setUser(updated);
    saveUser(updated);
    setMessage("Profile updated locally. If you have a server API, call it here to persist changes.");
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

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-medium">Name</label>
          <input className="w-full border p-2" value={form.name} onChange={(e)=>updateField('name', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Email</label>
          <input className="w-full border p-2" value={form.email} onChange={(e)=>updateField('email', e.target.value)} />
        </div>
        <div>
          <label className="block font-medium">Phone</label>
          <input className="w-full border p-2" value={form.phone} onChange={(e)=>updateField('phone', e.target.value)} />
        </div>
        <div>
          <button className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </div>
        {message && <div className="text-sm text-blue-700">{message}</div>}
      </form>
    </div>
  );
};

export default Profile;
