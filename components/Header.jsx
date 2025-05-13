"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, User } from "lucide-react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    gsap.fromTo(
      ".header-anim",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    )
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center header-anim">
            <span className="text-2xl font-bold text-pink-600">MomCare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Services", "About"].map((item, index) => (
              <Link
                key={item}
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className={`header-anim text-gray-700 hover:text-pink-600 font-medium transition-colors ${
                  pathname === (item === "Home" ? "/" : `/${item.toLowerCase()}`) ? "text-pink-600" : ""
                }`}
              >
                {item}
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className="header-anim flex items-center space-x-2">
              <Button asChild variant="ghost" className="text-gray-700 hover:text-pink-600">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="bg-pink-600 hover:bg-pink-700">
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <Button asChild variant="ghost" size="sm" className="text-gray-700 hover:text-pink-600">
              <Link href="/login">
                <User size={20} />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 pb-6 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              {["Home", "Services", "About"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={`text-gray-700 hover:text-pink-600 font-medium transition-colors ${
                    pathname === (item === "Home" ? "/" : `/${item.toLowerCase()}`) ? "text-pink-600" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </Link>
              ))}
              <div className="pt-2 flex flex-col space-y-2">
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
                <Button asChild className="w-full justify-center bg-pink-600 hover:bg-pink-700">
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    Sign up
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
