"use client";

const MapEmbed = () => {
  return (
    <iframe
      title="Event Location"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2607.9641544577858!2d-123.10603167304689!3d49.18226680000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x548675174dcb64a3%3A0xc6144e458eeb325a!2sCLASSIC%20GARAGE%20PERFORMANCE!5e0!3m2!1sen!2sca!4v1749752617373!5m2!1sen!2sca"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  );
};

export default MapEmbed;
