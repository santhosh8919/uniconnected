const Contact = () => (
  <section id="contact" className="py-16 px-8 bg-blue-50">
    <h3 className="text-2xl font-semibold text-blue-800 mb-6 text-center">Contact Us</h3>
    <form className="max-w-xl mx-auto space-y-4">
      <input type="text" placeholder="Name" className="w-full p-2 border rounded" />
      <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
      <textarea placeholder="Message" rows="4" className="w-full p-2 border rounded"></textarea>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Send Message
      </button>
    </form>
  </section>
);

export default Contact;