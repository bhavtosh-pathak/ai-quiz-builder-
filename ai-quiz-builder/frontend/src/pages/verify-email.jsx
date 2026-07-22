import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../layouts/AuthLayout';
import { useAuth } from '../context/AuthContext';

const OTP_LENGTH = 6;

const VerifyEmail = () => {
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [submitting, setSubmitting] = useState(false);
  const inputsRef = useRef([]);

  // No email in state means someone landed here directly (refresh, bookmark,
  // back button) without going through registration — send them back.
  useEffect(() => {
    if (!email) navigate('/register', { replace: true });
  }, [email, navigate]);

  const focusInput = (index) => inputsRef.current[index]?.focus();

  const handleChange = (index, value) => {
    const digit = value.replace(/\D/g, '').slice(-1); // only last digit typed, digits only
    setDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });
    if (digit && index < OTP_LENGTH - 1) focusInput(index + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setDigits(Array.from({ length: OTP_LENGTH }, (_, i) => pasted[i] || ''));
    focusInput(Math.min(pasted.length, OTP_LENGTH - 1));
  };

  const otp = digits.join('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== OTP_LENGTH) return toast.error('Enter all 6 digits');
    setSubmitting(true);
    try {
      const user = await verifyEmail({ email, otp });
      toast.success(`Email verified — welcome, ${user.name.split(' ')[0]}`);
      navigate(user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message);
      setDigits(Array(OTP_LENGTH).fill(''));
      focusInput(0);
    } finally {
      setSubmitting(false);
    }
  };

  if (!email) return null;

  return (
    <AuthLayout title="Verify your email" subtitle={`Enter the 6-digit code sent to ${email}.`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input opacity-60" value={email} disabled />
        </div>

        <div>
          <label className="label">Enter OTP</label>
          <div className="flex gap-2" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="input !w-12 text-center text-lg font-mono"
                autoFocus={i === 0}
              />
            ))}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
          {submitting ? 'Verifying...' : 'Verify & continue'}
        </button>
      </form>

      <p className="mt-6 text-sm text-ink/50">
        Didn't get a code? Check spam, or{' '}
        <Link to="/register" className="font-semibold text-primary-500 hover:underline">
          try registering again
        </Link>
        .
      </p>
    </AuthLayout>
  );
};

export default VerifyEmail;