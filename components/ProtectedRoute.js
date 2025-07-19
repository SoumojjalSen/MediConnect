// components/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = Cookies.get('token');
      if (!token) {
        return router.push('/login');
      }
      try {
        const res = await fetch('/api/verify-token', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.valid) {
          Cookies.remove('token');
          Cookies.remove('user_uid');
          Cookies.remove('userType');

          router.push('/login');
        } else {
          setIsVerifying(false);
        }
      } catch {
        Cookies.remove('token');
        Cookies.remove('user_uid');
        Cookies.remove('userType');

        router.push('/login');
      }
    };
    verifyToken();
  }, [router]);

  if (isVerifying) return null;
  return children;
}
