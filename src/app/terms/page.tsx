import Footer from '@/components/Footer';
import Nav from '@/components/Nav';


export default function TermsOfService() {
    return (
        <div className="bg-[#111518] text-gray-400 flex flex-col">
        <Nav />
        <main className='text-sm p-10 min-h-screen'> 
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
  
        <p className="mb-4">
          By submitting an application to participate in our car event, you agree to the following terms:
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Eligibility</h2>
        <p className="mb-4">
          All submissions are subject to review and approval. Submission does not guarantee participation in the event.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Photo Usage</h2>
        <p className="mb-4">
          By uploading car photos, you grant us permission to use these images for event promotion, including on our website and social media channels.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Payments</h2>
        <p className="mb-4">
          If accepted, a registration fee may be required to secure your spot. All payments are final and non-refundable unless the event is canceled.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Code of Conduct</h2>
        <p className="mb-4">
          Participants are expected to act respectfully and follow all event rules. We reserve the right to remove any participant for inappropriate behavior.
        </p>
  
        <h2 className="text-xl font-semibold mt-6 mb-2">Changes</h2>
        <p className="mb-4">
          We reserve the right to update these terms at any time. Continued use of the site or event participation implies acceptance of the latest terms.
        </p>
  
        <p className="text-sm text-gray-400 mt-10">Last updated: June 18, 2025</p>
      </div>
      </main>       

      <Footer />
    </div>
    );
  }
  