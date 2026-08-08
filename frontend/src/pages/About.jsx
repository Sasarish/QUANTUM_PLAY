import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { PageTitle } from "../Components/PageTitle";
import { ShieldCheck, Zap, Award, Users, MonitorPlay, Gamepad2 } from "lucide-react";

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageTitle title={"Quantum Play | About Us"} />
      <Navbar />

      <main className="grow w-full max-w-7xl mx-auto px-4 py-12 md:py-16">

        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 drop-shadow-sm">
            Powering Your <span className="text-amber-600">Gaming</span> Journey
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to Quantum Play, your ultimate destination for next-generation gaming. We believe in providing top-tier consoles, cutting-edge hardware, and the latest releases to help you dominate every digital realm.
          </p>
        </section>

        {/* Story / Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
          <div className="aspect-video md:aspect-square lg:aspect-video overflow-hidden rounded-xl bg-slate-100 relative group flex items-center justify-center">
            {/* If you have a real image, replace the next block with an <img> tag */}
            <div className="absolute inset-0 bg-slate-200 flex items-center justify-center text-slate-400 group-hover:scale-105 transition-transform duration-700">
              <Gamepad2 size={80} className="opacity-40" />
            </div>

            <img
              src="public/exclusivos-ps.jpg"
              alt="Gaming Setup"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 relative z-10"
            />

          </div>

          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm font-bold mb-6 w-max border border-amber-200">
              <MonitorPlay size={16} />
              <span>Our Mission</span>
            </div>
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Built by Gamers, For Gamers</h2>
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              Founded with a simple idea: gaming hardware shouldn't be a hassle to find, evaluate, or purchase. We've bridged the gap between raw technological performance and everyday accessibility.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you're looking for the latest PlayStation exclusives, upgrading your battle station, or trading in your old hardware, our curated selection ensures you only get the best.
            </p>
          </div>
        </section>

        {/* Core Values / Features */}
        <section className="mb-16">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Quantum Play?</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "Premium Quality",
                desc: "100% genuine products sourced directly from verified manufacturers."
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Express delivery options to get you back in the game faster."
              },
              {
                icon: ShieldCheck,
                title: "Secure Shopping",
                desc: "Bank-level encryption and buyer protection on every single order."
              },
              {
                icon: Users,
                title: "Community First",
                desc: "Dedicated support team ready to help with any technical issues."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center group"
              >
                <div className="w-16 h-16 bg-slate-50 group-hover:bg-amber-50 rounded-full flex items-center justify-center mb-6 transition-colors duration-300">
                  <feature.icon className="text-slate-700 group-hover:text-amber-600 transition-colors duration-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default About;