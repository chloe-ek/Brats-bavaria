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
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | string>('all');

  // Derive available years from submissions
  const availableYears = Array.from(
    new Set(allSubmissions.map((s) => new Date(s.submitted_at).getFullYear()))
  ).sort((a, b) => b - a);

  const submissions = selectedYear
    ? allSubmissions.filter((s) => new Date(s.submitted_at).getFullYear() === selectedYear)
    : allSubmissions;

  const approvedSubmissions = submissions.filter((s) => s.status?.toLowerCase() === 'approved');

  const brandCounts = approvedSubmissions.reduce((acc, sub) => {
    const brand = sub.car_make;
    if (brand) acc[brand] = (acc[brand] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedBrands = Object.keys(brandCounts).sort();

  const filteredSubmissions = (() => {
    if (filter === 'all') return submissions;
    if (filter === 'approved') return approvedSubmissions;
    return approvedSubmissions.filter((sub) => sub.car_make === filter);
  })();

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.push('/admin/login'); return; }
      if (user.email !== 'admin@bratsandbavaria.com') {
        toast.error('Access denied');
        router.push('/admin/login');
        return;
      }
      setIsAuthorized(true);
      setLoading(false);
    };
    checkAdmin();
  }, [router, supabase]);

  useEffect(() => {
    if (isAuthorized) fetchSubmissions();
  }, [isAuthorized]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      const list: Submission[] = data.submissions || [];
      setAllSubmissions(list);
      // Default to most recent year
      if (list.length > 0) {
        const latestYear = Math.max(...list.map((s) => new Date(s.submitted_at).getFullYear()));
        setSelectedYear(latestYear);
      }
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

        {/* Year selector */}
        {availableYears.length > 0 && (
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => setSelectedYear(null)}
              className={`px-4 py-2 text-sm border ${
                selectedYear === null ? 'bg-white text-black border-white' : 'bg-gray-800 text-gray-300 border-gray-600'
              }`}
            >
              All Years
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => { setSelectedYear(year); setFilter('all'); }}
                className={`px-4 py-2 text-sm border ${
                  selectedYear === year ? 'bg-white text-black border-white' : 'bg-gray-800 text-gray-300 border-gray-600'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {filteredSubmissions.length === 0 ? (
          <p>No submissions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="mb-4 flex gap-4 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 border ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                All ({submissions.length})
              </button>
              <button
                onClick={() => setFilter('approved')}
                className={`px-4 py-2 border ${filter === 'approved' ? 'bg-green-700 text-white' : 'bg-gray-800 text-gray-300'}`}
              >
                Approved ({approvedSubmissions.length})
              </button>
              {sortedBrands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setFilter(brand)}
                  className={`px-4 py-2 border ${filter === brand ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300'}`}
                >
                  {brand} ({brandCounts[brand]})
                </button>
              ))}
            </div>

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
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-t border-gray-700">
                    <td className="p-3">{sub.applicant?.name}</td>
                    <td className="p-3">{sub.car_make} {sub.car_model} ({sub.car_year})</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 ${
                        sub.status === 'approved' ? 'bg-green-800'
                        : sub.status === 'rejected' ? 'bg-red-800'
                        : 'bg-gray-800'
                      }`}>
                        {sub.status ?? 'pending'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 ${sub.review?.seen ? 'bg-gray-800' : 'bg-yellow-300 text-black'}`}>
                        {sub.review?.seen ? 'Seen' : 'New'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 ${sub.payment?.status === 'paid' ? 'bg-green-800' : 'bg-red-800'}`}>
                        {sub.payment?.status ?? 'unpaid'}
                      </span>
                    </td>
                    <td className="p-3 text-xs">{sub.review?.notes || '-'}</td>
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
