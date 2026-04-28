"use client";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import imageCompression from 'browser-image-compression';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-hot-toast';

const Submit = () => {
  const router = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const previewsRef = useRef<string[]>([]);

  // Clean up preview object URLs on unmount or file change
  useEffect(() => {
    return () => {
      previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (submitSuccess) router.push('/submit/success');
  }, [submitSuccess, router]);

  const clearError = (field: string) => {
    setFormErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    clearError('email');
    if (confirmEmail && e.target.value !== confirmEmail) {
      setFormErrors((prev) => ({ ...prev, confirmEmail: 'Emails do not match' }));
    } else {
      clearError('confirmEmail');
    }
  };

  const handleConfirmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmEmail(e.target.value);
    if (email && e.target.value !== email) {
      setFormErrors((prev) => ({ ...prev, confirmEmail: 'Emails do not match' }));
    } else {
      clearError('confirmEmail');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length < 3) {
      toast.error("Please upload at least 3 photos.");
      e.target.value = "";
      return;
    }
    if (files.length > 5) {
      toast.error("You can upload up to 5 photos only.");
      e.target.value = "";
      return;
    }

    clearError('photos');
    setIsCompressing(true);

    const compressedFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        try {
          return await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
        } catch {
          return file;
        }
      })
    );

    // Generate preview URLs
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    const newPreviews = compressedFiles.map((f) => URL.createObjectURL(f));
    previewsRef.current = newPreviews;

    setSelectedFiles(compressedFiles);
    setPreviews(newPreviews);
    setIsCompressing(false);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "car_photo_upload");

    const res = await fetch("https://api.cloudinary.com/v1_1/doymnetao/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return `${data.secure_url}?f_auto&q_auto`;
  };

  const validate = (formData: FormData): Record<string, string> => {
    const errors: Record<string, string> = {};
    if (!formData.get('name')) errors.name = 'Name is required';
    if (!email) errors.email = 'Email is required';
    if (email !== confirmEmail) errors.confirmEmail = 'Emails do not match';
    if (!formData.get('make')) errors.make = 'Please select a brand';
    if (!formData.get('model')) errors.model = 'Model is required';
    if (!formData.get('year')) errors.year = 'Year is required';
    if (selectedFiles.length < 3) errors.photos = 'Please upload at least 3 photos';
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const errors = validate(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      const firstErrorField = document.querySelector('[data-error]');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);
    setUploadProgress({ current: 0, total: selectedFiles.length });

    try {
      // Upload photos one by one with progress
      const photoUrls: string[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadProgress({ current: i + 1, total: selectedFiles.length });
        const url = await uploadToCloudinary(selectedFiles[i]);
        photoUrls.push(url);
      }

      const payload = {
        name: formData.get("name"),
        email,
        phone: formData.get("phone"),
        make: formData.get("make"),
        model: formData.get("model"),
        year: formData.get("year"),
        instagram: formData.get("instagram"),
        questions: formData.get("comments"),
        photos: photoUrls,
      };

      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmitSuccess(true);
      } else {
        const err = await response.json();
        throw new Error(err.message || 'Submission failed');
      }
    } catch (err) {
      console.error(err);
      toast.error("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(null);
    }
  };

  const inputClass = "w-full bg-transparent border-b border-white/20 text-white text-sm py-3 px-0 outline-none focus:border-white/60 transition-colors duration-200 placeholder:text-white/20";
  const labelClass = "block text-white/40 uppercase tracking-[0.2em] text-xs mb-2";
  const errorClass = "text-red-400 text-xs mt-2 tracking-wide";

  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 px-6 sm:px-12 md:px-20 lg:px-32 py-16 sm:py-20 w-full max-w-[1200px] mx-auto">

        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-5">
            <div className="h-px w-8 bg-white/40" />
            <span className="text-white/50 font-sans uppercase tracking-[0.3em]" style={{ fontSize: "0.7rem" }}>
              BRATS AND BAVARIA 2026
            </span>
          </div>
          <h1
            className="metallic-text"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.01em",
              marginBottom: "1.5rem",
            }}
          >
            Submit Your Car
          </h1>
          <div className="h-px bg-white/20 w-full mb-6" />
          <p className="text-white/50 text-sm leading-relaxed max-w-xl" style={{ letterSpacing: "0.02em" }}>
            Limited spots available. Submit your application below to reserve your place.
            If accepted, an entry fee of <span className="text-white/80">$42</span> will be due.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-16">

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-white/30 uppercase tracking-[0.25em] text-xs">01</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/60 uppercase tracking-[0.25em] text-xs">Contact Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div data-error={formErrors.name ? true : undefined}>
                <label className={labelClass} htmlFor="name">Name <span className="text-white/30">*</span></label>
                <input
                  className={`${inputClass} ${formErrors.name ? 'border-red-400' : ''}`}
                  type="text" id="name" name="name"
                  placeholder="Full name"
                  onChange={() => clearError('name')}
                />
                {formErrors.name && <p className={errorClass}>{formErrors.name}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">Phone Number</label>
                <input className={inputClass} type="tel" id="phone" name="phone" placeholder="Optional" />
              </div>
              <div data-error={formErrors.email ? true : undefined}>
                <label className={labelClass} htmlFor="email">Email <span className="text-white/30">*</span></label>
                <input
                  className={`${inputClass} ${formErrors.email ? 'border-red-400' : ''}`}
                  type="email" id="email" name="email"
                  value={email} onChange={handleEmailChange}
                  placeholder="your@email.com"
                />
                {formErrors.email && <p className={errorClass}>{formErrors.email}</p>}
              </div>
              <div data-error={formErrors.confirmEmail ? true : undefined}>
                <label className={labelClass} htmlFor="confirmEmail">Confirm Email <span className="text-white/30">*</span></label>
                <input
                  className={`${inputClass} ${formErrors.confirmEmail ? 'border-red-400' : ''}`}
                  type="email" id="confirmEmail"
                  value={confirmEmail} onChange={handleConfirmEmailChange}
                  placeholder="Repeat email"
                />
                {formErrors.confirmEmail && <p className={errorClass}>{formErrors.confirmEmail}</p>}
              </div>
            </div>
          </div>

          {/* Car Info */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-white/30 uppercase tracking-[0.25em] text-xs">02</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/60 uppercase tracking-[0.25em] text-xs">Car Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div data-error={formErrors.make ? true : undefined}>
                <label className={labelClass} htmlFor="make">Make (Brand) <span className="text-white/30">*</span></label>
                <select
                  id="make" name="make"
                  className={`${inputClass} ${formErrors.make ? 'border-red-400' : ''}`}
                  onChange={() => clearError('make')}
                >
                  <option value="" className="bg-[#111518]">Select Brand</option>
                  <option value="BMW" className="bg-[#111518]">BMW</option>
                  <option value="Mercedes-Benz" className="bg-[#111518]">Mercedes-Benz</option>
                  <option value="Audi" className="bg-[#111518]">Audi</option>
                  <option value="Porsche" className="bg-[#111518]">Porsche</option>
                  <option value="Volkswagen" className="bg-[#111518]">Volkswagen</option>
                </select>
                {formErrors.make && <p className={errorClass}>{formErrors.make}</p>}
              </div>
              <div data-error={formErrors.model ? true : undefined}>
                <label className={labelClass} htmlFor="model">Model <span className="text-white/30">*</span></label>
                <input
                  className={`${inputClass} ${formErrors.model ? 'border-red-400' : ''}`}
                  type="text" id="model" name="model"
                  placeholder="e.g. M3, 911, RS6"
                  onChange={() => clearError('model')}
                />
                {formErrors.model && <p className={errorClass}>{formErrors.model}</p>}
              </div>
              <div data-error={formErrors.year ? true : undefined}>
                <label className={labelClass} htmlFor="year">Year <span className="text-white/30">*</span></label>
                <input
                  className={`${inputClass} ${formErrors.year ? 'border-red-400' : ''}`}
                  type="number" id="year" name="year"
                  placeholder="e.g. 2021"
                  onChange={() => clearError('year')}
                />
                {formErrors.year && <p className={errorClass}>{formErrors.year}</p>}
              </div>
              <div>
                <label className={labelClass} htmlFor="instagram">Instagram / Website</label>
                <input className={inputClass} type="text" id="instagram" name="instagram" placeholder="Optional" />
              </div>
              <div className="md:col-span-2">
                <label className={labelClass} htmlFor="comments">Comments / Questions</label>
                <textarea className={`${inputClass} resize-none`} id="comments" name="comments" rows={3} placeholder="Anything you'd like us to know" />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-white/30 uppercase tracking-[0.25em] text-xs">03</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/60 uppercase tracking-[0.25em] text-xs">Car Photos</span>
            </div>

            <label
              htmlFor="photos"
              data-error={formErrors.photos ? true : undefined}
              className={`flex flex-col items-center justify-center w-full h-52 border border-dashed cursor-pointer transition-colors duration-200 ${
                formErrors.photos ? 'border-red-400' : 'border-white/20 hover:border-white/40'
              } ${isCompressing ? 'pointer-events-none' : ''}`}
            >
              {isCompressing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mb-4" />
                  <p className="text-white/50 text-sm">Optimizing photos…</p>
                </>
              ) : (
                <>
                  <svg className="w-7 h-7 mb-4 text-white/30" fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.2 5.02 4 4 0 0 0 5 13h2.2M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="text-white/50 text-sm mb-1">
                    {selectedFiles.length > 0
                      ? <span className="text-white/80">{selectedFiles.length} photo{selectedFiles.length > 1 ? 's' : ''} selected — click to change</span>
                      : <><span className="text-white/80">Click to upload</span> or drag and drop</>
                    }
                  </p>
                  <p className="text-white/30 text-xs uppercase tracking-widest">JPG / PNG · 3 to 5 files</p>
                </>
              )}
              <input id="photos" name="photos" type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </label>

            {formErrors.photos && <p className={errorClass}>{formErrors.photos}</p>}

            {/* Photo previews */}
            {previews.length > 0 && !isCompressing && (
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-2">
                {previews.map((src, idx) => (
                  <div key={idx} className="relative aspect-square">
                    <Image src={src} alt={`Preview ${idx + 1}`} fill sizes="(max-width: 640px) 33vw, 20vw" className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <div className="h-px bg-white/10 mb-10" />
            <button
              type="submit"
              disabled={isSubmitting || isCompressing}
              className={`group flex items-center gap-3 border border-white/40 text-white text-xs font-sans font-semibold tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 ${
                isSubmitting || isCompressing ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isSubmitting ? "Submitting…" : "Submit Application"}
              {!isSubmitting && <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
            </button>

            {isSubmitting && uploadProgress && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  Uploading photo {uploadProgress.current} of {uploadProgress.total}…
                </p>
                <div className="w-48 h-px bg-white/10">
                  <div
                    className="h-px bg-white/50 transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Submit;
