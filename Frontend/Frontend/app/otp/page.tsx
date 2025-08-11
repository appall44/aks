'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const OTPVerification = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoVerifying, setAutoVerifying] = useState(false);


  // Read OTP and Email from query params and trigger auto verify
  useEffect(() => {
    const queryOtp = searchParams.get('otp');
    const queryEmail = searchParams.get('email');

    if (queryEmail && queryOtp) {
      setEmail(queryEmail);
      setOtp(queryOtp);
      autoVerify(queryEmail, queryOtp);
    } else {
      const storedEmail = localStorage.getItem('email');
      if (storedEmail) setEmail(storedEmail);
    }
  }, []);

  const autoVerify = async (email: string, otp: string) => {
    setAutoVerifying(true);
    setMessage('Verifying automatically...');

    try {
      const res = await fetch(`http://localhost:5000/tenant/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Auto verification failed.');
      }

      const data = await res.json();
      setMessage(data.message);
      router.push(`http://localhost:3000/login`);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Unexpected error during auto verification.');
      }
    } finally {
      setAutoVerifying(false);
    }
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleManualVerify = async () => {
    if (!otp || !email) {
      setMessage('OTP and email are required.');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setMessage('OTP must be 6 digits.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`http://localhost:5000/tenant/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Manual verification failed.');
      }

      const data = await res.json();
      setMessage(data.message);
      router.push(`http://localhost:3000/login`);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setMessage('Email is missing. Cannot resend OTP.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`http://localhost:5000/tenant/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Resend failed.');
      }

      const data = await res.json();
      setMessage(data.message);
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          OTP Verification
        </h1>

        {!autoVerifying && (
          <>
            <p className="text-center text-gray-600 mb-6">
              Enter the OTP sent to your email.
            </p>

            <input
              type="text"
              value={otp}
              onChange={handleOTPChange}
              maxLength={6}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-center"
            />

            <button
              onClick={handleManualVerify}
              disabled={loading}
              className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>

            <p className="text-sm text-center text-gray-500 mt-4">
              Didn't receive an OTP?{' '}
              <button
                onClick={handleResendOtp}
                disabled={loading}
                className="text-blue-500 hover:underline"
              >
                Resend OTP
              </button>
            </p>
          </>
        )}

        {message && (
          <p className="mt-4 text-center text-red-500 text-sm">{message}</p>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;
