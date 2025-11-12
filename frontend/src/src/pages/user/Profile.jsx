import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { saveUser } from "../../utils/storage";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [message, setMessage] = useState(null);

  const updateField = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    // No server-side profile update endpoint found in backend; update client state/localStorage
    const updated = { ...user, ...form };
    setUser && setUser(updated);
    saveUser(updated);
    setMessage("Profile updated locally. If you have a server API, call it here to persist changes.");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4">My Profile</h2>
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
