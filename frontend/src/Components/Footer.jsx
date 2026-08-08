import { Mail, Phone } from "lucide-react";

const Footer = () => {
    return (
        <footer className='bg-gray-900 text-gray-200 mt-8'>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-6  text-center md:text-left py-5">
                <div className="flex-1 min-w-62.5">
                    <h3 className="text-xl font-semibold mb-4 text-white">Contact us</h3>
                    <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-2">
                        <Phone size={16} />
                        Phone : +94 116789658
                    </p>
                    <p className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-2">
                        <Mail size={16} />
                        Email : marksasarish@gmail.com
                    </p>
                </div>
                <div className="flex-1 min-w-62.5 items-center gap-4">
                    <h3 className="text-xl font-semibold mb-4 text-white">Follow us</h3>
                    <div className="flex gap-4 items-center justify-center md:justify-start">
                        <a href="#" target="_blank"><i className="bi bi-linkedin w-7 h-7 text-gray-400 transition-transform duration-300 hover:scale-110 hover:text-blue-500 "></i></a>
                        <a href="#" target="_blank"><i className="bi bi-github w-7 h-7 text-gray-400 transition-transform duration-300 hover:scale-110 hover:text-blue-500"></i></a>
                        <a href="#" target="_blank"><i className="bi bi-instagram w-7 h-7 text-gray-400 transition-transform duration-300 hover:scale-110 hover:text-pink-500"></i></a>
                        <a href="#" target="_blank"><i className="bi bi-youtube w-7 h-7 text-gray-400 transition-transform duration-300 hover:scale-110 hover:text-red-500"></i></a>
                    </div>
                </div>
                <div className="flex-1 min-w-62.5">
                    <h3 className="text-xl font-semibold mb-4 text-white">About</h3>
                    <p className="text-gray-400 leading-relaxed">Providing professional e-commerce solutions to help you grow online business.</p>
                </div>
            </div>
            <div className='border-t border-gray-700 py-4 text-center text-gray-400 text-sm'>
                @2025 LOU IT Services. All rights reserved.
            </div>
        </footer>
    )
}

export default Footer