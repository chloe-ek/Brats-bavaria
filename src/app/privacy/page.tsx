import Footer from '@/components/Footer';
import Nav from '@/components/Nav';


export default function PrivacyPolicy() {
    return (
        <div className="bg-[#111518] text-gray-400 flex flex-col">
        <Nav />
        <main className='text-sm p-10 min-h-screen'> 
        <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">
          This Privacy Policy explains how we collect, use, and protect your information when you submit an application to participate in our car event.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <p className="mb-4">
          We collect the following data from applicants:
        </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Name</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Social media </li>
            <li>Car details (make, model, year)</li>
            <li>Car photos</li>
            <li>Any additional questions or notes you submit</li>
          </ul>
       
  
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <p className="mb-4">
          We use this information to review applications and select vehicles for our event. If your application is accepted, we may contact you via email or phone.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Data Storage</h2>
        <p className="mb-4">
          Your data is securely stored in our database (Supabase) and image hosting platform (Cloudinary). We do not share your information with third parties.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Payments</h2>
        <p className="mb-4">
          Payments, if applicable, are handled securely through Stripe. We do not store or process any credit card information ourselves.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p className="mb-4">
          If you have questions or requests regarding your data, contact us at [bratsandbavaria@gmail.com]. {/* TODO: Add contact form */}
        </p>
  
        <p className="text-sm text-gray-400 mt-10">Last updated: June 18, 2025</p>
        </div>
        </main>       

      <Footer />
    </div>
    );
  }
  