'use client';

import { useState } from 'react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [result, setResult] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResult('Sending...');
    
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
  
      if (res.ok) {
        setResult('Thanks for your message.');
        setForm({ name: '', email: '', message: '' });
      } else {
        const err = await res.json();
        setResult(err.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      setResult('Failed to send. Please try again later.');
    }
  };
  

  return (
    <div id="contact" className="w-full px-6 md:px-20 lg:px-40 py-20 bg-no-repeat bg-center max-w-[1600px] mx-auto">
      <div className="h-20" />
      <h2 className="text-center text-5xl font-Montserrat">Contact Us</h2>

      <p className="text-center max-w-2xl mx-auto mt-5 mb-12   font-Montserrat">
       Connect with us for event inquiries, sponsorships, or general information.
      </p>

      <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 mt-10">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
            className="p-3 outline-none border-[0.5px] border-gray-400  -md bg-white text-black"
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
            className="p-3 outline-none border-[0.5px] border-gray-400  -md bg-white text-black"
          />
        </div>

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Enter your message"
          rows={6}
          required
          className="w-full p-4 outline-none border-[0.5px] border-gray-400  -md bg-white text-black mb-6"
        ></textarea>

        <button
          type="submit"
          className="py-3 px-8 w-max flex items-center justify-between gap-2 bg-black/80 text-white mx-auto hover:bg-black duration-500"
        >
          Submit
          
        </button>

        <p className="mt-4 text-center text-sm">{result}</p>
      </form>
    </div>
  );
};

export default Contact;
