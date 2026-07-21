import { useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user.name, institution: user.institution || '', password: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { name: form.name, institution: form.institution };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      toast.success('Profile updated');
      setForm((f) => ({ ...f, password: '' }));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <p className="section-eyebrow">Account</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Profile</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        <div className="surface p-6 flex flex-col items-center text-center">
          <div className="flex flex-1 flex-col items-center justify-center">
            <span
              className="grid h-20 w-20 place-items-center rounded-full text-2xl font-semibold text-white shadow-md ring-4 ring-white"
              style={{ backgroundColor: user.avatarColor }}
            >
              {user.name.charAt(0).toUpperCase()}
            </span>
            <p className="mt-4 font-display text-lg font-semibold">{user.name}</p>
            <p className="text-sm text-ink/45">{user.email}</p>
            <span className="badge bg-primary-50 text-primary-600 mt-3 capitalize">{user.role}</span>
          </div>

          <div className="mt-6 w-full border-t border-ink/8 pt-4">
            <p className="text-xs text-ink/40">
              {user.role === 'teacher' ? '📚 Educator account' : '🎓 Student account'}
            </p>
            {user.institution && (
              <p className="mt-1 text-xs font-medium text-ink/55">{user.institution}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="surface p-6 space-y-4 lg:col-span-2 h-fit">
          <p className="section-eyebrow">Edit details</p>
          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input opacity-60" value={user.email} disabled />
            <p className="mt-1 text-xs text-ink/35">Email cannot be changed.</p>
          </div>
          <div>
            <label className="label">School / institution</label>
            <input
              className="input"
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
            />
          </div>
          <div>
            <label className="label">New password</label>
            <input
              type="password"
              className="input"
              placeholder="Leave blank to keep current password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;