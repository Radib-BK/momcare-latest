"use client"

import Link from "next/link"
import { Heart, Mail, Phone, MapPin } from "lucide-react"
import { usePathname } from "next/navigation"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  
  // Pages that have a sidebar
  const pagesWithSidebar = ['/services', '/medicine-store', '/medicine-dates', '/skin-disease-classification', '/prescription-analyzer']
  const hasSidebar = pagesWithSidebar.includes(pathname)

  return (
    <footer className={`bg-gray-50 pt-12 pb-8 border-t border-gray-200 ${hasSidebar ? 'pl-[70px]' : ''}`}>
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About MomCare</h3>
            <p className="text-gray-600 mb-4">
              Your smart companion during pregnancy. Get expert help, track medications, and analyze prescriptions with
              ease.
            </p>
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-pink-600 mr-2" />
              <span className="text-sm text-gray-600">Made with love for mothers</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-pink-600 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/medicine-store" className="text-gray-600 hover:text-pink-600 transition-colors">
                  Medicine Store
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-pink-600 mr-2 mt-0.5" />
                <span className="text-gray-600">contact@momcare.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-pink-600 mr-2 mt-0.5" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-pink-600 mr-2 mt-0.5" />
                <span className="text-gray-600">123 Pregnancy Ave, Baby City, BC 12345</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 text-center text-gray-600">
          <p className="mb-2">&copy; {currentYear} MomCare. All rights reserved.</p>
          <p className="text-sm">Developed by Radib Bin Kabir and Mehedi Ahamed for Therap JavaFest 2025</p>
        </div>
      </div>
    </footer>
  )
}
