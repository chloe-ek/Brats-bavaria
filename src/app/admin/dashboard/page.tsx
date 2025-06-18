'use client';

import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { Submission } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';


const AdminDashboard = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);


  // Check if current user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/admin/login');
        return;
      }

      if (user.email !== 'kwonge08e@gmail.com') {
        toast.error('Access denied');
        router.push('/admin/login');
        return;
      }

      setIsAuthorized(true);
      setLoading(false);
    };

    checkAdmin();
  }, [router, supabase]);

  // Fetch submissions after auth
  useEffect(() => {
    if (isAuthorized) {
      fetchSubmissions();
    }
  }, [isAuthorized]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      setSubmissions(data.submissions || []);
    } catch (err) {
      toast.error('Failed to fetch submissions');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111518] text-white flex items-center justify-center">
        <p>Checking access...</p>
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 px-6 py-10 w-full mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {submissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
              <tr className="bg-gray-800">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Car</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Seen</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Admin Notes</th>
                  <th className="p-3 text-left">Submitted At</th>
                  <th className="p-3 text-left">View</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub) => (
                  <tr key={sub.id} className="border-t border-gray-700">
                    <td className="p-3">{sub.name}</td>
                    <td className="p-3">{sub.car_make} {sub.car_model} ({sub.car_year})</td>
                    <td className="p-3">
                        <span
                          className={`text-xs px-2 py-1 ${ sub.status === 'approved' ? 'bg-green-800'
                              : sub.status === 'rejected'? 'bg-red-800': 'bg-gray-800'}`} >
                          {sub.status === 'approved' ? 'approved' : sub.status === 'rejected' ? 'rejected': 'pending'}
                        </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1    ${sub.seen ? 'bg-gray-800' : 'bg-yellow-300 text-black'}`}>
                        {sub.seen ? 'Seen' : 'New'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1    ${sub.payment_status === 'paid' ? 'bg-green-800' : 'bg-red-800'}`}>
                        {sub.payment_status}
                      </span>
                    </td>
                    <td className="p-3 text-xs">{sub.notes || '-'}</td>
                    <td className="p-3 text-xs">{new Date(sub.submitted_at).toLocaleString()}</td>
                    <td className="p-3">
                      <Link href={`/admin/submission/${sub.id}`} className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-xs">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
