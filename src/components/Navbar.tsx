import { Link, useLocation } from "react-router";
import { useI18n } from "@/i18n/context";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { language, setLanguage, t } = useI18n();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Smooth scroll to section
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  const navLinks = [
    { id: "inicio", label: t.nav.home },
    { id: "historia", label: t.nav.about },
    { id: "contato", label: t.nav.contact },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1a1a1a]/90 backdrop-blur-sm border-b border-yellow-600/30 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => scrollToSection("inicio")}
            className="flex items-center gap-2"
          >
            <span className="text-yellow-500 font-bold text-lg tracking-wider">
              EDIFY MISSION
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Language Switcher - 3 languages */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setLanguage("pt")}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                language === "pt" ? "bg-green-600 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="Portugues"
            >
              <span className="text-base">BR</span>
            </button>
            <button
              onClick={() => setLanguage("en")}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                language === "en" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="English"
            >
              <span className="text-base">EN</span>
            </button>
            <button
              onClick={() => setLanguage("es")}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                language === "es" ? "bg-yellow-600 text-white" : "text-gray-400 hover:text-white"
              }`}
              title="Espanol"
            >
              <span className="text-base">ES</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="px-4 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 text-left"
                >
                  {link.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-4 pt-3 border-t border-white/10 mt-2">
              {(["pt", "en", "es"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-all ${
                    language === lang
                      ? lang === "pt" ? "bg-green-600 text-white" : lang === "en" ? "bg-blue-600 text-white" : "bg-yellow-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span>{lang === "pt" ? "BR" : lang === "en" ? "EN" : "ES"}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
