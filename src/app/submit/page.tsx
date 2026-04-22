"use client";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import imageCompression from 'browser-image-compression';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';


const Submit = () => {

  const router = useRouter();

  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (confirmEmail && e.target.value !== confirmEmail) {
      setEmailError("Emails do not match");
     } else {
        setEmailError("");
      }
  };

  const handleConfirmEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmEmail(e.target.value);
    if (email && e.target.value !== email) {
      setEmailError("Emails do not match");
    } else {
      setEmailError("");
    }
  };


  // Handles photo file selection
  const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length < 3) {
      toast.error("Please upload at least 3 photos. ");
      setSelectedFiles([]); // Clear selected files
      e.target.value = "";  // Clear input value
      return;
    }

    if (files.length > 5) {
      toast.error("You can upload up to 5 photos only.");
      setSelectedFiles([]); 
      e.target.value = "";  
      return;
    }
    // save valid files to state
    setFileError("");

    // 1. Image Optimization
    const compressedFiles = await Promise.all(
      Array.from(files).map(async (file) => {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(file, options);
          return compressedFile;
        } catch (error) {
          console.error("Image compression error:", error);
          return file;
        }
      })
    );
    setSelectedFiles(compressedFiles);
    
  };
  
  // 2. Upload to Cloudinary
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "car_photo_upload");

    const res = await fetch("https://api.cloudinary.com/v1_1/doymnetao/image/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return `${data.secure_url}?f_auto&q_auto`; // Optimized image URL
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email !== confirmEmail) {
      setEmailError("Emails do not match");
      return;
    }

    if (selectedFiles.length < 3 || selectedFiles.length > 5) {
      toast.error("Please upload between 3 and 5 photos.");
      return;
    }
    setIsSubmitting(true); 

    try {
    // Get form data
    const form = e.currentTarget
    const formData = new FormData(form);

    // Upload all photos to Cloudinary and get URLs
    const photoUrls = await Promise.all(selectedFiles.map(uploadToCloudinary));

    // Create payload to send to API (DB)
    const payload = {
      name: formData.get("name"),
      email: email,
      phone: formData.get("phone"),
      make: formData.get("make"),
      model: formData.get("model"),
      year: formData.get("year"),
      instagram: formData.get("instagram"),
      comments: formData.get("comments"),
      photos: photoUrls,
    };
      
    // send to backend API 
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
      
    if (response.ok) {
      setSubmitSuccess(true); // triggers redirects
    } else {
      const err = await response.json();
      throw new Error(err.message || 'Submission failed');
    }
  } catch (err) {
    console.error(err)
    toast.error("Submission failed. Please try again.");
  } finally {
    setIsSubmitting(false);
    }
  };

  // Redirect on successful submit
  useEffect(() => {
    if (submitSuccess) {
      router.push('/submit/success');
    }
  }, [submitSuccess, router]);

  const inputClass = "w-full bg-transparent border-b border-white/20 text-white text-sm py-3 px-0 outline-none focus:border-white/60 transition-colors duration-200 placeholder:text-white/20";
  const labelClass = "block text-white/40 uppercase tracking-[0.2em] text-xs mb-2";

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

        <form onSubmit={handleSubmit} className="space-y-16">

          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-white/30 uppercase tracking-[0.25em] text-xs">01</span>
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-white/60 uppercase tracking-[0.25em] text-xs">Contact Information</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div>
                <label className={labelClass} htmlFor="name">Name</label>
                <input className={inputClass} type="text" id="name" name="name" required placeholder="Full name" />
              </div>
              <div>
                <label className={labelClass} htmlFor="phone">Phone Number</label>
                <input className={inputClass} type="tel" id="phone" name="phone" placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass} htmlFor="email">Email</label>
                <input className={inputClass} type="email" id="email" name="email" value={email} onChange={handleEmailChange} required placeholder="your@email.com" />
              </div>
              <div>
                <label className={labelClass} htmlFor="confirmEmail">Confirm Email</label>
                <input
                  className={`${inputClass} ${emailError ? "border-red-400" : ""}`}
                  type="email" id="confirmEmail" value={confirmEmail} onChange={handleConfirmEmailChange} required placeholder="Repeat email"
                />
                {emailError && <p className="text-red-400 text-xs mt-2 tracking-wide">{emailError}</p>}
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
              <div>
                <label className={labelClass} htmlFor="make">Make (Brand)</label>
                <select id="make" name="make" className={inputClass} required>
                  <option value="" className="bg-[#111518]">Select Brand</option>
                  <option value="BMW" className="bg-[#111518]">BMW</option>
                  <option value="Mercedes-Benz" className="bg-[#111518]">Mercedes-Benz</option>
                  <option value="Audi" className="bg-[#111518]">Audi</option>
                  <option value="Porsche" className="bg-[#111518]">Porsche</option>
                  <option value="Volkswagen" className="bg-[#111518]">Volkswagen</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="model">Model</label>
                <input className={inputClass} type="text" id="model" name="model" required placeholder="e.g. M3, 911, RS6" />
              </div>
              <div>
                <label className={labelClass} htmlFor="year">Year</label>
                <input className={inputClass} type="number" id="year" name="year" required placeholder="e.g. 2021" />
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
              className="flex flex-col items-center justify-center w-full h-52 border border-dashed border-white/20 cursor-pointer hover:border-white/40 transition-colors duration-200"
            >
              <svg className="w-7 h-7 mb-4 text-white/30" fill="none" viewBox="0 0 20 16" xmlns="http://www.w3.org/2000/svg">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.2 5.02 4 4 0 0 0 5 13h2.2M10 15V6m0 0L8 8m2-2 2 2" />
              </svg>
              <p className="text-white/50 text-sm mb-1">
                <span className="text-white/80">Click to upload</span> or drag and drop
              </p>
              <p className="text-white/30 text-xs uppercase tracking-widest">JPG / PNG · 3 to 5 files</p>
              <input id="photos" name="photos" type="file" className="hidden" accept="image/*" multiple required onChange={handleFileChange} />
            </label>
            {selectedFiles.length > 0 && (
              <ul className="mt-4 space-y-1">
                {selectedFiles.map((file, idx) => (
                  <li key={idx} className="text-xs text-white/40 tracking-wide">{file.name}</li>
                ))}
              </ul>
            )}
            {fileError && <p className="text-red-400 text-xs mt-2 tracking-wide">{fileError}</p>}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <div className="h-px bg-white/10 mb-10" />
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group flex items-center gap-3 border border-white/40 text-white text-xs font-sans font-semibold tracking-widest uppercase px-8 py-4 hover:bg-white hover:text-black transition-all duration-300 ${
                isSubmitting ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
              {!isSubmitting && <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
            </button>
            {isSubmitting && (
              <p className="mt-4 text-xs text-white/40 uppercase tracking-widest">Uploading photos, please wait…</p>
            )}
          </div>

        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Submit;
