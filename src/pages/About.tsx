import { useI18n } from "@/i18n/context";
import Navbar from "@/components/Navbar";
import { Globe, Heart, Users, BookOpen } from "lucide-react";

export default function About() {
  const { t } = useI18n();

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
            {t.about.welcome}
          </h2>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="relative bg-[#1a1a1a] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1920&h=400&fit=crop"
            alt="Unity"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 py-16 md:py-20 text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-[0.25em]">
            {t.about.title}
          </h1>
        </div>
      </section>

      {/* History Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4">
          {/* History paragraphs */}
          <div className="space-y-6 text-gray-700 leading-relaxed text-base md:text-lg">
            <p>{t.about.history1}</p>
            <p>{t.about.history2}</p>
            <p>{t.about.history3}</p>
            <p>{t.about.history4}</p>
            <p>{t.about.history5}</p>
            <p>{t.about.history6}</p>
            <p>{t.about.history7}</p>
            <p className="font-medium text-gray-800">{t.about.history8}</p>
          </div>

          {/* Values */}
          <div className="mt-20">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-12">
              {t.language === "pt" ? "Nossos Valores" : "Our Values"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="text-yellow-600" size={28} />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {t.language === "pt" ? "Amor" : "Love"}
                </h4>
                <p className="text-sm text-gray-500">
                  {t.language === "pt"
                    ? "Levar o amor de Jesus a todos"
                    : "Bringing Jesus' love to everyone"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Globe className="text-yellow-600" size={28} />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {t.language === "pt" ? "Missão Global" : "Global Mission"}
                </h4>
                <p className="text-sm text-gray-500">
                  {t.language === "pt"
                    ? "Alcance internacional através da internet"
                    : "International reach through the internet"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="text-yellow-600" size={28} />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {t.language === "pt" ? "Comunidade" : "Community"}
                </h4>
                <p className="text-sm text-gray-500">
                  {t.language === "pt"
                    ? "União de servos de Deus e amigos"
                    : "Union of God's servants and friends"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="text-yellow-600" size={28} />
                </div>
                <h4 className="font-bold text-gray-800 mb-2">
                  {t.language === "pt" ? "Treinamento" : "Training"}
                </h4>
                <p className="text-sm text-gray-500">
                  {t.language === "pt"
                    ? "Capacitação em teologia e capelania"
                    : "Training in theology and chaplaincy"}
                </p>
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
