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
    console.log('📤 handleSubmit triggered');

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

  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 px-4 sm:px-8 md:px-16 lg:px-32 py-8 sm:py-12 md:py-16 w-full max-w-[1400px] mx-auto">

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 text-center font-Montserrat">Submit Your Car</h1>

        <div className="mb-8 sm:mb-10 text-center">
          <p className="text-sm sm:text-base">There are limited spots available to display your vehicle. Please submit your application below to reserve your spot.</p>
          <p className="text-sm sm:text-base mt-2">If accepted, there will be an entry fee of $42 due.</p>
          
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Contact Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Contact Information</h2>
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="name">Name</label>
            <input
              className="w-full p-2 sm:p-3   bg-gray-800 text-white border border-gray-600"
              type="text"
              id="name"
              name="name"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="phone">Phone Number</label>
            <input
              className="w-full p-2 sm:p-3   bg-gray-800 text-white border border-gray-600"
              type="tel"
              id="phone"
              name="phone"
            />
          </div>


          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              className="w-full p-2 sm:p-3   bg-gray-800 text-white border border-gray-600"
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="confirmEmail">Confirm Email</label>
            <input className={`w-full p-2 sm:p-3 bg-gray-800 text-white border ${emailError ? 'border-red-500' : 'border-gray-600'}`}
            type="email" id="confirmEmail" value={confirmEmail} onChange={handleConfirmEmailChange} required />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          

          {/* Car Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mt-6 mb-4">Car Information</h2>
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="make">Make (Brand)</label>
            <select
              id="make"
              name="make"
              className="w-full p-2 sm:p-3   bg-gray-800 text-white border border-gray-600"
              required
            >
              <option value="">Select Brand</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
              <option value="Porsche">Porsche</option>
              <option value="Volkswagen">Volkswagen</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="model">Model</label>
            <input
              className="w-full p-2 sm:p-3   bg-gray-800 text-white border border-gray-600"
              type="text"
              id="model"
              name="model"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="year">Year</label>
            <input
              className="w-full p-2 sm:p-3   bg-gray-800 text-white border border-gray-600"
              type="number"
              id="year"
              name="year"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="instagram">Instagram / Website</label>
            <input
              className="w-full p-2 sm:p-3   bg-gray-800 text-white border border-gray-600"
              type="text"
              id="instagram"
              name="instagram"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm mb-1" htmlFor="comments">Comments / Questions</label>
            <textarea
              className="w-full p-2 sm:p-3   bg-gray-800 text-white border border-gray-600"
              id="comments"
              name="comments"
              rows={4}
            />
          </div>

          {/* Photo Upload */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="photos" className="block text-sm mb-2 font-medium">Upload 3 to 5 Car Photos</label>
            <label
              htmlFor="photos"
              className="flex flex-col items-center justify-center w-full h-48 sm:h-64 border-2 border-dashed  -lg cursor-pointer bg-gray-700 hover:bg-gray-600 border-gray-500"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5A5.5 5.5 0 0 0 5.2 5.02 4 4 0 0 0 5 13h2.2M10 15V6m0 0L8 8m2-2 2 2"
                  />

                </svg>
                <p className="mb-2 text-sm text-gray-300">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400">JPG/PNG allowed. Upload 3 to 5 files.</p>
              </div>
              <input
                id="photos"
                name="photos"
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                required
                onChange={handleFileChange}
              />
              {fileError && (
                <p className="text-red-500 text-sm mt-2">{fileError}</p>
              )}
            </label>

            {/* Display selected files name */}
            {selectedFiles.length > 0 && (
              <ul className="mt-2 text-sm text-gray-300 space-y-1">
                {selectedFiles.map((file, idx) => (
                  <li key={idx}>{file.name}</li>
                ))}
              </ul>
            )}
            {fileError && (
                <p className="text-red-500 text-sm mt-2">{fileError}</p>
              )}
          </div>

          <div className="col-span-1 md:col-span-2 text-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-white px-4 sm:px-6 py-2 sm:py-3 mt-6 text-black font-semibold transition-opacity   ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Submit
            </button>
            {isSubmitting && (
                <div className="flex items-center justify-center mt-4">
                  <svg
                    aria-hidden="true"
                    className="w-6 h-6 mr-2 text-gray-200 animate-spin fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="text-sm text-white">Submitting... Please wait</span>
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
