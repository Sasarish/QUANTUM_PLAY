import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { PageTitle } from "../Components/PageTitle";
import { Phone, Mail, MapPin, Clock, Headset } from "lucide-react";

const Contact = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageTitle title={"Quantum Play | Contact Us"} />
      <Navbar />

      <main className="grow w-full max-w-7xl mx-auto px-4 py-12 md:py-16">

        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 drop-shadow-sm">
            Get in <span className="text-amber-600">Touch</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Have questions about our products, order status, or gaming hardware? Reach out to us through any of the channels below.
          </p>
        </section>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">

          {/* Phone & Email */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-amber-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-max mb-6">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Direct Contact</h3>
              <p className="text-gray-500 text-sm mb-6">Call or email us anytime during our working hours.</p>
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-6">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Phone</span>
                <a href="tel:+94116789658" className="text-gray-900 font-medium hover:text-amber-600 transition-colors text-base">
                  +94 11 678 9658
                </a>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Email</span>
                <a href="mailto:marksasarish@gmail.com" className="text-gray-900 font-medium hover:text-amber-600 transition-colors text-base break-all">
                  marksasarish@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Store Location */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-amber-200 transition-colors flex flex-col justify-between">
            <div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-max mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Store Address</h3>
              <p className="text-gray-500 text-sm mb-6">Visit our store for in-person hardware trade-ins and support.</p>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-1">Headquarters</span>
              <p className="text-gray-900 font-medium leading-relaxed">
                No. 123 Gaming Boulevard, Suite 400<br />
                Colombo 03, Sri Lanka
              </p>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-amber-200 transition-colors md:col-span-2 lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-max mb-6">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Operating Hours</h3>
              <p className="text-gray-500 text-sm mb-6">Our support team and store are open during these times.</p>
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-6 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Monday - Friday</span>
                <span className="text-gray-900 font-bold">9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Saturday</span>
                <span className="text-gray-900 font-bold">10:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Sunday</span>
                <span className="text-red-600 font-bold bg-red-50 px-2.5 py-0.5 rounded-full text-xs">Closed</span>
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
};

export default Contact;