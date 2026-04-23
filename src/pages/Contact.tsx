import { useState } from "react";
import { useI18n } from "@/i18n/context";
import Navbar from "@/components/Navbar";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Youtube } from "lucide-react";
import { toast } from "sonner";

export default function Contact() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success(t.contact.success);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Logo Section */}
      <section className="bg-white py-8 flex flex-col items-center">
        <div className="w-48 h-48 md:w-56 md:h-56 relative">
          <img
            src="/logo.png"
            alt="Edify Mission"
            className="w-full h-full object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.parentElement!.innerHTML = `
                <div class="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center border-4 border-yellow-700 shadow-2xl">
                  <div class="text-center">
                    <div class="text-white font-black text-xs tracking-wider leading-tight">EDIFY</div>
                    <div class="text-red-700 font-bold text-[8px]">Mission</div>
                    <div class="text-white font-bold text-[6px] mt-0.5 tracking-widest">INTERNATIONAL</div>
                    <div class="text-white font-bold text-[6px] tracking-widest">CHAPELAINCY</div>
                  </div>
                </div>
              `;
            }}
          />
        </div>
        <div className="mt-4 bg-red-700 px-8 py-2">
          <h2 className="text-white text-lg md:text-xl font-bold tracking-widest text-center">
            {t.contact.welcome}
          </h2>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=400&fit=crop"
            alt="Contact"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 py-16 md:py-20 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-[0.25em]">
            {t.contact.title}
          </h1>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                {t.language === "pt" ? "Envie sua mensagem" : "Send your message"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.contact.name}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.contact.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.contact.subject}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t.contact.message}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitted}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  <Send size={18} />
                  {t.contact.send}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  {t.language === "pt" ? "Informações de Contato" : "Contact Information"}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">Email</h4>
                      <p className="text-gray-500 text-sm">info@edifymission.org</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{t.contact.phone}</h4>
                      <p className="text-gray-500 text-sm">+1 (508) 263-0265</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{t.contact.address}</h4>
                      <p className="text-gray-500 text-sm">
                        794 Boston Post Road East<br />
                        Marlborough, MA 01752<br />
                        USA
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4">
                  {t.language === "pt" ? "Redes Sociais" : "Social Media"}
                </h4>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com/capelaniaedificar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                  >
                    <Facebook size={18} />
                  </a>
                  <a
                    href="https://instagram.com/sitepad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                  >
                    <Instagram size={18} />
                  </a>
                  <a
                    href="https://youtube.com/sitepad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                  >
                    <Youtube size={18} />
                  </a>
                </div>
              </div>

              {/* Map placeholder */}
              <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MapPin size={32} className="mx-auto mb-2" />
                  <p className="text-sm">
                    {t.language === "pt" ? "Marlborough, MA - EUA" : "Marlborough, MA - USA"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a1a] text-gray-400 py-8 text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Edify Mission International Chaplaincy. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
