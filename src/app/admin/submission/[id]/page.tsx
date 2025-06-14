"use client";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Submission } from "@/types/types";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";




const SubmissionDetail = () => {
  const { id } = useParams();
  const router = useRouter();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (id) {
      fetchSubmission();
    }
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`);
      const data = await res.json();
      setSubmission(data.submission);
      setNotes(data.submission.notes || "");

      // Mark as seen
      await fetch(`/api/admin/submissions/${id}/seen`, { method: "POST" });
    } catch (err) {
      toast.error("Failed to load submission");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}/${decision}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
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
    }
  };

  if (loading) {
    return <div className="text-white p-10">Loading...</div>;
  }

  if (!submission) {
    return <div className="text-white p-10">No data found</div>;
  }

  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-6 py-10 w-full max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold mb-4">Submission Detail</h1>

        <div className="mb-6">
          <p><strong>Name:</strong> {submission.name}</p>
          <p><strong>Email:</strong> {submission.email}</p>
          <p><strong>Phone:</strong> {submission.phone}</p>
          <p><strong>Instagram:</strong> {submission.instagram}</p>
          <p><strong>Car:</strong> {submission.car_make} {submission.car_model} ({submission.car_year})</p>
          <p><strong>Questions:</strong> {submission.questions}</p>
          <p><strong>Status:</strong> {submission.status}</p>
          <p><strong>Payment:</strong> {submission.payment_status}</p>
          <p><strong>Submitted At:</strong> {new Date(submission.submitted_at).toLocaleString()}</p>
        </div>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {submission.photo_urls.map((url, index) => (
                <div key={index} className="relative w-full h-64">
                <Image
                    src={url}
                    alt={`Photo ${index + 1}`}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                </div>
            ))}
        </div>


        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Admin Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 bg-gray-800 text-white border border-gray-600 rounded"
            rows={4}
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => handleDecision("approved")}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => handleDecision("rejected")}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubmissionDetail;
