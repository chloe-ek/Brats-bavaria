"use client";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Submission } from "@/types/types";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    approved: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30',
    rejected: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/30',
    pending:  'bg-white/10 text-white/50 ring-1 ring-white/20',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${map[status] ?? map.pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'approved' ? 'bg-emerald-400' : status === 'rejected' ? 'bg-red-400' : 'bg-white/40'}`} />
      {status}
    </span>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-xs text-white/30 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-sm text-white/80">{value || '—'}</p>
  </div>
);

const SubmissionDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");
  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeciding, setIsDeciding] = useState(false);

  useEffect(() => {
    if (id) fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`);
      const data = await res.json();
      if (!data.submission) throw new Error("Submission not found");
      setSubmission(data.submission);
      setNotes(data.submission.review?.notes || "");
      await fetch(`/api/admin/submissions/${id}/seen`, { method: "POST" });
    } catch (err) {
      toast.error("Failed to load submission");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision: "approved" | "rejected") => {
    setIsDeciding(true);
    try {
      const payload =
        decision === "approved"
          ? { email: submission?.applicant?.email, name: submission?.applicant?.name }
          : undefined;

      const res = await fetch(`/api/admin/submissions/${id}/${decision}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(`Submission ${decision}`);
        router.push("/admin/dashboard");
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing decision");
    } finally {
      setIsDeciding(false);
    }
  };

  const handleSaveNotes = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/submissions/${id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) toast.success("Notes saved");
      else toast.error("Failed to save notes");
    } catch (err) {
      console.error(err);
      toast.error("Error saving notes");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111518] text-white flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="min-h-screen bg-[#111518] text-white flex items-center justify-center">
        <p className="text-white/40">Submission not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 w-full max-w-5xl mx-auto pb-32 sm:pb-10">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="text-white/40 hover:text-white transition-colors text-sm"
          >
            ← Back
          </button>
          <div className="h-4 w-px bg-white/10" />
          <p className="text-xs text-white/30 uppercase tracking-widest">
            {new Date(submission.submitted_at).getFullYear()} · {new Date(submission.submitted_at).toLocaleDateString()}
          </p>
          <StatusBadge status={submission.status ?? 'pending'} />
          {submission.payment?.status === 'paid' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Paid
            </span>
          )}
        </div>

        {/* Applicant + Car Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-white/5 rounded-xl p-5 ring-1 ring-white/10 space-y-4">
            <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Applicant</p>
            <InfoRow label="Name" value={submission.applicant?.name} />
            <InfoRow label="Email" value={submission.applicant?.email} />
            <InfoRow label="Phone" value={submission.applicant?.phone} />
            <InfoRow label="Instagram" value={submission.applicant?.instagram} />
          </div>
          <div className="bg-white/5 rounded-xl p-5 ring-1 ring-white/10 space-y-4">
            <p className="text-xs text-white/30 uppercase tracking-widest font-medium">Vehicle</p>
            <InfoRow label="Make" value={submission.car_make} />
            <InfoRow label="Model" value={submission.car_model} />
            <InfoRow label="Year" value={submission.car_year} />
            {submission.questions && (
              <InfoRow label="Questions" value={submission.questions} />
            )}
          </div>
        </div>

        {/* Photos */}
        {submission.photos && submission.photos.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Photos</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {submission.photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative aspect-[4/3] cursor-pointer rounded-lg overflow-hidden ring-1 ring-white/10 hover:ring-white/30 transition-all"
                  onClick={() => setModalUrl(photo.url)}
                >
                  <Image
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, 33vw"
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="mb-6 bg-white/5 rounded-xl p-5 ring-1 ring-white/10">
          <p className="text-xs text-white/30 uppercase tracking-widest mb-3">Admin Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/20 outline-none resize-none leading-relaxed"
            rows={3}
            placeholder="Add internal notes…"
          />
          <div className="h-px bg-white/10 my-3" />
          <button
            onClick={handleSaveNotes}
            disabled={isSaving}
            className="text-xs font-medium text-white/50 hover:text-white transition-colors disabled:opacity-40"
          >
            {isSaving ? 'Saving…' : 'Save Notes'}
          </button>
        </div>

        {/* Action buttons — fixed on mobile, inline on desktop */}
        <div className="fixed bottom-0 left-0 right-0 sm:relative bg-[#111518] sm:bg-transparent border-t border-white/10 sm:border-0 p-4 sm:p-0 flex gap-3 sm:justify-start z-40">
          <button
            onClick={() => handleDecision("approved")}
            disabled={isDeciding || submission.status === 'approved'}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDeciding ? '…' : 'Approve'}
          </button>
          <button
            onClick={() => handleDecision("rejected")}
            disabled={isDeciding || submission.status === 'rejected'}
            className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isDeciding ? '…' : 'Reject'}
          </button>
        </div>
      </main>

      {/* Photo modal */}
      {modalUrl && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setModalUrl(null)}
        >
          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image src={modalUrl} alt="Full image" fill sizes="100vw" className="object-contain" />
          </div>
          <button className="absolute top-4 right-4 text-white/50 hover:text-white text-2xl">✕</button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default SubmissionDetail;
