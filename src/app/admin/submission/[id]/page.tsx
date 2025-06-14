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
  const [modalUrl, setModalUrl] = useState<string | null>(null); // For image modal

  // Fetch the submission data by ID
  useEffect(() => {
    if (id) {
      fetchSubmission();
    }
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}`);
      const data = await res.json();
      if (!data.submission) throw new Error("Submission not found");

      setSubmission(data.submission);
      setNotes(data.submission.notes || "");

      // Mark the submission as seen
      await fetch(`/api/admin/submissions/${id}/seen`, { method: "POST" });
    } catch (err) {
      toast.error("Failed to load submission");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle approval or rejection
  const handleDecision = async (decision: "approved" | "rejected") => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}/${decision}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });

      if (res.ok) {
        toast.success(`Submission ${decision}`);

        // Send email if approved
        if (decision === "approved" && submission) {
          await fetch("/api/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: submission.email, name: submission.name }),
          });
        }
        router.push("/admin/dashboard");
      } else {
        toast.error("Failed to update status");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error processing decision");
    }
  };

  // Handle saving admin notes only
  const handleSaveNotes = async () => {
    try {
      const res = await fetch(`/api/admin/submissions/${id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        toast.success("Notes saved");
      } else {
        toast.error("Failed to save notes");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error saving notes");
    }
  };

  if (loading) return <div className="text-white p-10">Loading...</div>;
  if (!submission) return <div className="text-white p-10">No data found</div>;

  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 px-6 py-10 w-full max-w-[1400px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">Submission Detail</h1>

        <div className="mb-6 text-lg space-y-2">
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

        {/* Image grid with click-to-zoom modal */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {submission.photo_urls.map((url, index) => (
            <div key={index} className="relative w-full h-64 cursor-pointer" onClick={() => setModalUrl(url)}>
              <Image src={url} alt={`Photo ${index + 1}`} fill className="object-cover   " />
            </div>
          ))}
        </div>

        {/* Modal to display full-size image */}
        {modalUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
            onClick={() => setModalUrl(null)}
          >
            <div className="relative w-full max-w-4xl h-[80vh]">
              <Image src={modalUrl} alt="Full image" fill className="object-contain" />
            </div>
          </div>
        )}

        {/* Admin Notes input */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600    text-base"
            rows={4}
          />
          <button
            onClick={handleSaveNotes}
            className="mt-3 bg-blue-600 px-4 py-2 mb-10 hover:bg-blue-700 items-center w-full"
          >
            Save
          </button>
        </div>

        {/* Approve/Reject buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleDecision("approved")}
            className="bg-green-600 px-4 py-2    hover:bg-green-700"
          >
            Approve
          </button>
          <button
            onClick={() => handleDecision("rejected")}
            className="bg-red-600 px-4 py-2    hover:bg-red-700"
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
