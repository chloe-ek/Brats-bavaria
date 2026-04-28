'use client';

import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import { Submission } from '@/types/types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    approved: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
    rejected: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
    pending:  'bg-white/10 text-white/50 ring-1 ring-white/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${map[status] ?? map.pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'approved' ? 'bg-emerald-400' : status === 'rejected' ? 'bg-red-400' : 'bg-white/40'}`} />
      {status ?? 'pending'}
    </span>
  );
};

const PaymentBadge = ({ status }: { status?: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
    status === 'paid'
      ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
      : 'bg-white/5 text-white/30 ring-1 ring-white/10'
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${status === 'paid' ? 'bg-emerald-400' : 'bg-white/20'}`} />
    {status ?? 'unpaid'}
  </span>
);

const AdminDashboard = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'approved' | string>('all');

  const availableYears = Array.from(
    new Set(allSubmissions.map((s) => new Date(s.submitted_at).getFullYear()))
  ).sort((a, b) => b - a);

  const submissions = selectedYear
    ? allSubmissions.filter((s) => new Date(s.submitted_at).getFullYear() === selectedYear)
    : allSubmissions;

  const approvedSubmissions = submissions.filter((s) => s.status === 'approved');
  const pendingSubmissions = submissions.filter((s) => !s.status || s.status === 'pending');
  const paidSubmissions = submissions.filter((s) => s.payment?.status === 'paid');
  const unseenCount = submissions.filter((s) => !s.review?.seen).length;

  const brandCounts = approvedSubmissions.reduce((acc, sub) => {
    if (sub.car_make) acc[sub.car_make] = (acc[sub.car_make] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const sortedBrands = Object.keys(brandCounts).sort();

  const filteredSubmissions = (() => {
    if (filter === 'all') return submissions;
    if (filter === 'approved') return approvedSubmissions;
    return approvedSubmissions.filter((s) => s.car_make === filter);
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
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthorized) return null;

  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 w-full max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          {unseenCount > 0 && (
            <p className="text-sm text-amber-400 mt-1">{unseenCount} new submission{unseenCount > 1 ? 's' : ''} unseen</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Total', value: submissions.length, color: 'text-white' },
            { label: 'Approved', value: approvedSubmissions.length, color: 'text-emerald-400' },
            { label: 'Pending', value: pendingSubmissions.length, color: 'text-white/50' },
            { label: 'Paid', value: paidSubmissions.length, color: 'text-emerald-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 rounded-xl p-4 ring-1 ring-white/10">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Year selector */}
        {availableYears.length > 0 && (
          <div className="mb-6 flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedYear(null)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                selectedYear === null ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/15'
              }`}
            >
              All Years
            </button>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => { setSelectedYear(year); setFilter('all'); }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedYear === year ? 'bg-white text-black' : 'bg-white/10 text-white/60 hover:bg-white/15'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {[
            { key: 'all', label: `All (${submissions.length})` },
            { key: 'approved', label: `Approved (${approvedSubmissions.length})` },
            ...sortedBrands.map((b) => ({ key: b, label: `${b} (${brandCounts[b]})` })),
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === key
                  ? 'bg-white/20 text-white ring-1 ring-white/30'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-20 text-white/30">No submissions found.</div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="flex flex-col gap-3 lg:hidden">
              {filteredSubmissions.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/admin/submission/${sub.id}`}
                  className="bg-white/5 rounded-xl p-4 ring-1 ring-white/10 hover:ring-white/20 transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="font-semibold text-sm">{sub.applicant?.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{sub.applicant?.email}</p>
                    </div>
                    {!sub.review?.seen && (
                      <span className="shrink-0 text-xs bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/30 px-2 py-0.5 rounded-full">New</span>
                    )}
                  </div>
                  <p className="text-sm text-white/70 mb-3">{sub.car_make} {sub.car_model} · {sub.car_year}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <StatusBadge status={sub.status ?? 'pending'} />
                      <PaymentBadge status={sub.payment?.status} />
                    </div>
                    <p className="text-xs text-white/30">{new Date(sub.submitted_at).toLocaleDateString()}</p>
                  </div>
                  {sub.review?.notes && (
                    <p className="mt-2 text-xs text-white/30 line-clamp-1">Note: {sub.review.notes}</p>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden lg:block rounded-xl overflow-hidden ring-1 ring-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 border-b border-white/10">
                    {['Name', 'Car', 'Status', 'Seen', 'Payment', 'Notes', 'Submitted', ''].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-sm">{sub.applicant?.name}</p>
                        <p className="text-xs text-white/40">{sub.applicant?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-white/70">
                        {sub.car_make} {sub.car_model}
                        <span className="text-white/30"> · {sub.car_year}</span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={sub.status ?? 'pending'} /></td>
                      <td className="px-4 py-3">
                        {sub.review?.seen
                          ? <span className="text-xs text-white/30">Seen</span>
                          : <span className="text-xs bg-amber-400/20 text-amber-400 ring-1 ring-amber-400/30 px-2 py-0.5 rounded-full">New</span>
                        }
                      </td>
                      <td className="px-4 py-3"><PaymentBadge status={sub.payment?.status} /></td>
                      <td className="px-4 py-3 text-xs text-white/40 max-w-[160px] truncate">{sub.review?.notes || '—'}</td>
                      <td className="px-4 py-3 text-xs text-white/30">{new Date(sub.submitted_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/submission/${sub.id}`}
                          className="text-xs font-medium text-white/60 hover:text-white transition-colors"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
