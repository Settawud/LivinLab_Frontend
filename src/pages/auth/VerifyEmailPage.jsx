import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { post } from '../../lib/api';
import { ValueContext } from '../../context/ValueContext';
import Navbar from '../../components/organisms/Navbar';
import Footer from '../../components/organisms/Footer';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(ValueContext) || {};

  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('Verifying your email address...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      setMessage('Verification token is missing. Please check the link or request a new one.');
      return;
    }

    const verify = async () => {
      try {
        const data = await post('/auth/verify-email/confirm', { token });
        if (login && data?.user && data?.token) {
          login({ ...data.user, token: data.token });
          setStatus('success');
          setMessage('Email verified successfully! You are now logged in and will be redirected to the homepage.');
          toast.success('Email verified successfully!');
          setTimeout(() => {
            navigate('/');
          }, 3000);
        } else {
          throw new Error('Login failed after verification.');
        }
      } catch (err) {
        const msg = err?.response?.data?.message || 'An error occurred during verification.';
        setStatus('error');
        setMessage(msg + ' Please try again or request a new verification link.');
        toast.error(msg);
      }
    };

    verify();
  }, [searchParams, navigate, login]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8">
          {status === 'verifying' && (
            <div className="text-2xl font-semibold">{message}</div>
          )}
          {status === 'success' && (
            <div className="p-6 bg-green-100 border border-green-300 rounded-lg">
              <h2 className="text-2xl font-bold text-green-800">Verification Successful!</h2>
              <p className="mt-2 text-green-700">{message}</p>
            </div>
          )}
          {status === 'error' && (
            <div className="p-6 bg-red-100 border border-red-300 rounded-lg">
              <h2 className="text-2xl font-bold text-red-800">Verification Failed</h2>
              <p className="mt-2 text-red-700">{message}</p>
              <Link to="/" className="mt-4 inline-block text-blue-600 hover:underline">Go to Homepage</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
