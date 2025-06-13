"use client";

import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

const Submit = () => {

  const router = useRouter();

  const [fileError, setFileError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handles photo file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (files.length > 5) {
      setFileError("You can upload up to 5 photos only.");
      setSelectedFiles([]);
      e.target.value = "";
      return;
    }

    setFileError("");
    setSelectedFiles(Array.from(files));
  };

  // Handles form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedFiles.length < 3 || selectedFiles.length > 5) {
      setFileError("Please upload between 3 and 5 photos.");
      return;
    }

    // Get form data
    const formData = new FormData(e.currentTarget);
    
    // Add files to form data
    selectedFiles.forEach((file, index) => {
      formData.append(`photo${index}`, file);
    });

    // Submit to API
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    });
      
    const data = await response.json();
      
    if (response.ok) {
      setSubmitSuccess(true);
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  };

  useEffect(() => {
    if (submitSuccess) {
      router.push('/submit/success');
    }
  }, [submitSuccess, router]);

  return (
    <div className="bg-[#111518] text-white min-h-screen flex flex-col">
      <Nav />

      <main className="flex-1 px-6 md:px-20 lg:px-40 py-20 w-full max-w-[1600px] mx-auto">

        <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-center font-Ovo">Submit Your Car</h1>

        <div className="mb-10 text-center">
          <p>There are limited spots available to display your vehicle. Please submit your application below to reserve your spot.</p>
          <p>If accepted, there will be an entry fee of $40 due.</p>
          
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg sm:text-xl font-semibold mb-4">Contact Information</h2>
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="name">Name</label>
            <input
              className="w-full p-2   bg-gray-800 text-white border border-gray-600"
              type="text"
              id="name"
              name="name"
              required
            />
          </div>


          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email</label>
            <input
              className="w-full p-2   bg-gray-800 text-white border border-gray-600"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1" htmlFor="phone">Phone Number</label>
            <input
              className="w-full p-2   bg-gray-800 text-white border border-gray-600"
              type="tel"
              id="phone"
              name="phone"
            />
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
              className="w-full p-2   bg-gray-800 text-white border border-gray-600"
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
              className="w-full p-2   bg-gray-800 text-white border border-gray-600"
              type="text"
              id="model"
              name="model"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="year">Year</label>
            <input
              className="w-full p-2   bg-gray-800 text-white border border-gray-600"
              type="number"
              id="year"
              name="year"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="instagram">Instagram / Website</label>
            <input
              className="w-full p-2   bg-gray-800 text-white border border-gray-600"
              type="text"
              id="instagram"
              name="instagram"
            />
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm mb-1" htmlFor="comments">Comments / Questions</label>
            <textarea
              className="w-full p-2   bg-gray-800 text-white border border-gray-600"
              id="comments"
              name="comments"
              rows={4}
            />
          </div>

          {/* Photo Upload */}
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="photos" className="block text-sm mb-2 font-medium">Upload 5 Car Photos</label>
            <label
              htmlFor="photos"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed  -lg cursor-pointer bg-gray-700 hover:bg-gray-600 border-gray-500"
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
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5 files</p>
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
              className="bg-white px-6 py-2 mt-6 text-black font-semibold"
            >
              Submit
            </button>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default Submit;
