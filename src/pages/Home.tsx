import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { trpc } from "@/providers/trpc";
import {
  Search, User, Award, MapPin, BookOpen, Calendar, Mail, Phone,
  MapPinned, Send, Instagram, ChevronDown, X, CheckCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { siteConfig, aboutContent } from "@/config/site-config";

// Tipo do aluno baseado no schema
interface Student {
  id: number;
  fullName: string;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  course: string | null;
  completionDate: string | null;
  certificateNumber: string | null;
  status: string | null;
  notes: string | null;
}

function CredentialModal({ student, onClose, t }: { student: Student; onClose: () => void; t: any }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header dourado */}
        <div className="bg-gradient-to-r from-yellow-500 via-yellow-600 to-yellow-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            <div>
              <p className="text-white font-bold text-sm leading-tight">CAPELANIA</p>
              <p className="text-white/80 text-[10px] tracking-wider">INTERNATIONAL RESCUE</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Foto / Avatar grande */}
        <div className="flex flex-col items-center -mt-8 pt-4">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 border-4 border-white shadow-lg flex items-center justify-center">
            <User size={48} className="text-yellow-700" />
          </div>
          <h3 className="mt-3 text-xl font-bold text-gray-800 text-center px-4">
            {student.fullName}
          </h3>
          {student.certificateNumber && (
            <p className="text-xs text-yellow-700 font-mono tracking-wider mt-1">
              ID: {student.certificateNumber}
            </p>
          )}
          <span className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
            student.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-500"
          }`}>
            <CheckCircle size={12} />
            {student.status === "active" ? t.home.active : t.home.inactive}
          </span>
        </div>

        {/* Dados da carteirinha */}
        <div className="px-6 py-4 space-y-3">
          {student.course && (
            <div className="flex items-center gap-3 text-sm">
              <BookOpen size={16} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs">{t.home.course}</p>
                <p className="text-gray-800 font-medium">{student.course}</p>
              </div>
            </div>
          )}
          {student.completionDate && (
            <div className="flex items-center gap-3 text-sm">
              <Calendar size={16} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs">{t.home.completionDate}</p>
                <p className="text-gray-800 font-medium">{student.completionDate}</p>
              </div>
            </div>
          )}
          {student.city && (
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs">{t.home.city}</p>
                <p className="text-gray-800 font-medium">
                  {student.city}{student.state && `, ${student.state}`}
                  {student.country && ` - ${student.country}`}
                </p>
              </div>
            </div>
          )}
          {student.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs">{t.home.email}</p>
                <p className="text-gray-800 font-medium text-xs break-all">{student.email}</p>
              </div>
            </div>
          )}
          {student.phone && (
            <div className="flex items-center gap-3 text-sm">
              <Phone size={16} className="text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-gray-400 text-xs">{t.home.phone}</p>
                <p className="text-gray-800 font-medium">{student.phone}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t">
          <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest">
            Edify Mission International Chaplaincy
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { language, t } = useI18n();
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const searchMutation = trpc.student.search.useMutation();
  const studentsQuery = trpc.student.list.useQuery();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setHasSearched(true);
      searchMutation.mutate({ query: searchQuery.trim() });
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setHasSearched(false);
    searchMutation.reset();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 3000);
  };

  // Get about paragraphs for current language
  const aboutParagraphs = aboutContent[language];

  return (
    <div className="min-h-screen">
      {/* Fixed Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src={siteConfig.heroBackground}
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <Navbar />

      {/* ======== SECTION 1: HERO / INICIO ======== */}
      <section
        id="inicio"
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4"
      >
        {/* Logo */}
        <div className="w-56 h-auto md:w-72">
          <img
            src="/logo.png"
            alt="Chaplain International Rescue - JN 3:16"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>

        {/* Welcome Banner */}
        <div className="mt-6 bg-red-700 px-8 py-3 rounded shadow-lg">
          <h2 className="text-white text-lg md:text-2xl font-bold tracking-widest text-center">
            {t.home.welcome}
          </h2>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-white tracking-[0.3em] mt-8 text-center">
          {t.home.title}
        </h1>
        <h2 className="text-lg md:text-2xl lg:text-3xl font-light text-white/90 tracking-[0.2em] mt-2 text-center">
          {t.home.subtitle}
        </h2>
        <p className="text-red-400 text-sm md:text-lg italic mt-4 text-center max-w-xl">
          {t.home.quote}
        </p>

        {/* Scroll Down Indicator */}
        <button
          onClick={() => document.getElementById("pesquisa")?.scrollIntoView({ behavior: "smooth" })}
          className="mt-12 text-white/50 hover:text-white transition-colors animate-bounce"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* ======== SECTION 2: SEARCH ASSOCIATES ======== */}
      <section id="pesquisa" className="relative z-10 bg-white/95 backdrop-blur-sm py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            {t.home.searchTitle}
          </h3>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.home.searchPlaceholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={searchMutation.isPending}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {searchMutation.isPending ? "..." : t.home.searchButton}
            </button>
            {hasSearched && (
              <button type="button" onClick={handleClear}
                className="px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors">
                <span className="text-xs">✕</span>
              </button>
            )}
          </form>

          {/* Modal - Carteirinha */}
          {selectedStudent && (
            <CredentialModal
              student={selectedStudent}
              onClose={() => setSelectedStudent(null)}
              t={t}
            />
          )}

          {/* Search Results */}
          {hasSearched && searchMutation.data && (
            <div className="mt-10">
              {searchMutation.data.length === 0 ? (
                <p className="text-center text-gray-500 py-8">{t.home.noResults}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchMutation.data.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className="bg-white rounded-lg shadow-md p-5 border border-gray-100 hover:shadow-xl hover:border-yellow-300 transition-all text-left cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                          <User className="text-yellow-600" size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-800 truncate">{student.fullName}</h4>
                          {student.email && <p className="text-sm text-gray-500 truncate">{student.email}</p>}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                            {student.city && (
                              <span className="flex items-center gap-1"><MapPin size={12} /> {student.city}{student.state && `, ${student.state}`}</span>
                            )}
                          </div>
                          {student.certificateNumber && (
                            <p className="text-xs text-yellow-600 flex items-center gap-1 mt-1">
                              <Award size={12} /> ID: {student.certificateNumber}
                            </p>
                          )}
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${student.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
                            {student.status === "active" ? t.home.active : t.home.inactive}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Show all members if no search */}
          {!hasSearched && studentsQuery.data && studentsQuery.data.length > 0 && (
            <div className="mt-10">
              <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">{t.home.members}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentsQuery.data.slice(0, 6).map((student) => (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    className="bg-white rounded-lg shadow p-4 border border-gray-100 hover:shadow-xl hover:border-yellow-300 transition-all text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <User className="text-yellow-600" size={18} />
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-medium text-gray-800 truncate">{student.fullName}</h5>
                        {student.city && <p className="text-xs text-gray-500">{student.city}</p>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ======== SECTION 3: ABOUT / HISTORY ======== */}
      <section id="historia" className="relative z-10 bg-white/95 backdrop-blur-sm py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            {t.about.title}
          </h3>
          <div className="space-y-6 text-gray-700 leading-relaxed text-base md:text-lg">
            {aboutParagraphs.map((paragraph, idx) => (
              <p key={idx} className={idx === aboutParagraphs.length - 1 ? "font-medium text-gray-800" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ======== SECTION 4: CONTACT ======== */}
      <section id="contato" className="relative z-10 bg-white/95 backdrop-blur-sm py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-2xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            {t.contact.title}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-50 rounded-xl p-8">
              <form onSubmit={handleContactSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.name}</label>
                  <input type="text" name="name" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.email}</label>
                  <input type="email" name="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.subject}</label>
                  <input type="text" name="subject" value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t.contact.message}</label>
                  <textarea name="message" value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required rows={5}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm resize-none" />
                </div>
                <button type="submit" disabled={submitted}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                  <Send size={18} />
                  {submitted ? (language === "pt" ? "Enviado!" : language === "en" ? "Sent!" : "Enviado!") : t.contact.send}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Email</h4>
                    <p className="text-gray-500 text-sm">{siteConfig.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{t.contact.phone}</h4>
                    <p className="text-gray-500 text-sm">{siteConfig.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPinned className="text-yellow-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{t.contact.address}</h4>
                    <p className="text-gray-500 text-sm">
                      {siteConfig.address.line1}<br />
                      {siteConfig.address.line2}<br />
                      {siteConfig.address.country}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="font-bold text-gray-800 mb-4">
                  {language === "pt" ? "Redes Sociais" : language === "en" ? "Social Media" : "Redes Sociales"}
                </h4>
                <div className="flex gap-3">
                  {siteConfig.social.facebook && (
                    <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                      <Facebook size={18} />
                    </a>
                  )}
                  {siteConfig.social.instagram && (
                    <a href={siteConfig.social.instagram} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity">
                      <Instagram size={18} />
                    </a>
                  )}
                  {siteConfig.social.youtube && (
                    <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition-colors">
                      <Youtube size={18} />
                    </a>
                  )}
                </div>
              </div>

              {/* Map */}
              {siteConfig.mapUrl && (
                <a
                  href={siteConfig.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg overflow-hidden border border-gray-200 h-48 relative group cursor-pointer"
                >
                  <img
                    src="https://maps.googleapis.com/maps/api/staticmap?center=794+Boston+Post+Rd+E,Marlborough,MA&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C794+Boston+Post+Rd+E,Marlborough,MA"
                    alt="Map location"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <div className="text-center text-gray-500">
                      <MapPin size={32} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">{siteConfig.address.line1}</p>
                      <p className="text-sm">{siteConfig.address.line2}</p>
                      <p className="text-xs text-gray-400 mt-2 group-hover:text-gray-600">
                        {language === "pt" ? "Clique para ver no Google Maps" : language === "en" ? "Click to view on Google Maps" : "Haga clic para ver en Google Maps"}
                      </p>
                    </div>
                  </div>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#1a1a1a] text-gray-400 py-8 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} {siteConfig.organization}. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
