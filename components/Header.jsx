"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Heart, 
  Settings, 
  Bell, 
  Calendar, 
  FileText, 
  HelpCircle,
  Shield
} from "lucide-react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Playfair_Display } from "next/font/google"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profileImage: null
  })
  const pathname = usePathname()
  const router = useRouter()

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch profile')

      const data = await response.json()
      setUserData({
        name: data.name || "",
        email: data.email || "",
        profileImage: data.profileImageUrl ? `${API_BASE_URL}/uploads/${data.profileImageUrl}` : null
      })
      
      // Update localStorage with latest data
      localStorage.setItem('userName', data.name)
      localStorage.setItem('userEmail', data.email)
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token')
    console.log('Checking auth status, token:', token)
    
    if (token) {
      setIsLoggedIn(true)
      fetchUserProfile() // Fetch profile when authenticated
    } else {
      setIsLoggedIn(false)
      setUserData({
        name: "",
        email: "",
        profileImage: null
      })
    }
  }

  useEffect(() => {
    // Check auth status initially
    checkAuthStatus()

    // Add event listener for storage changes
    window.addEventListener('storage', checkAuthStatus)

    // Add custom event listener for auth changes
    window.addEventListener('authStateChanged', checkAuthStatus)

    return () => {
      window.removeEventListener('storage', checkAuthStatus)
      window.removeEventListener('authStateChanged', checkAuthStatus)
    }
  }, [])

  useEffect(() => {
    // Header animation
    gsap.fromTo(
      ".header-anim",
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    )

    // Subtle heart beat animation
    gsap.to(".heart-icon", {
      scale: 1.05,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    setIsLoggedIn(false)
    setUserData({
      name: "",
      email: "",
      profileImage: null
    })
    // Dispatch auth state change event
    window.dispatchEvent(new Event('authStateChanged'))
    router.push("/auth")
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-pink-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <Link 
            href="/" 
            className="flex items-center header-anim group"
          >
            <div className="flex items-center gap-3">
              <Heart className="heart-icon h-7 w-7 text-pink-600" />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className={`text-2xl font-bold bg-gradient-to-r from-pink-600 to-pink-700 bg-clip-text text-transparent ${playfair.variable} font-playfair tracking-tight`}>
                    Mom
                  </span>
                  <span className={`text-2xl font-bold text-pink-600 ${playfair.variable} font-playfair tracking-tight`}>
                    Care
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-medium tracking-wider uppercase">
                  Pregnancy Companion
                </span>
              </div>
            </div>
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

            {/* Auth Button */}
            <div className="header-anim">
              {isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                      <Avatar className="h-10 w-10 transition-all hover:scale-105">
                        <AvatarImage 
                          src={userData.profileImage || "/profile-placeholder.png"} 
                          alt={userData.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                          {userData.name ? userData.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-64 mt-2 p-2 bg-white border border-gray-100 shadow-xl rounded-xl" 
                    align="end" 
                    forceMount
                  >
                    <div className="flex items-center gap-3 p-3 mb-1 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage 
                          src={userData.profileImage || "/profile-placeholder.png"} 
                          alt={userData.name}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                          {userData.name ? userData.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-semibold leading-none text-gray-900">{userData.name}</p>
                        <p className="text-xs leading-relaxed text-gray-500 mt-1">{userData.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuGroup className="space-y-1">
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/profile" 
                          className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>View Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/notifications" 
                          className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <Bell className="h-4 w-4" />
                          <span>Notifications</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/help" 
                          className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                        >
                          <HelpCircle className="h-4 w-4" />
                          <span>Help Center</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="my-2" />
                    <DropdownMenuItem 
                      onClick={handleLogout} 
                      className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild className="bg-pink-600 hover:bg-pink-700 text-white font-medium px-6 py-3 rounded-full">
                  <Link href="/auth">Sign in</Link>
                </Button>
              )}
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 transition-all hover:scale-105">
                      <AvatarImage 
                        src={userData.profileImage || "/profile-placeholder.png"} 
                        alt={userData.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                        {userData.name ? userData.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-64 mt-2 p-2 bg-white border border-gray-100 shadow-xl rounded-xl" 
                  align="end" 
                  forceMount
                >
                  <div className="flex items-center gap-3 p-3 mb-1 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage 
                        src={userData.profileImage || "/profile-placeholder.png"} 
                        alt={userData.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                        {userData.name ? userData.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold leading-none text-gray-900">{userData.name}</p>
                      <p className="text-xs leading-relaxed text-gray-500 mt-1">{userData.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuGroup className="space-y-1">
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/profile" 
                        className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        <span>View Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/notifications" 
                        className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                      >
                        <Bell className="h-4 w-4" />
                        <span>Notifications</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href="/help" 
                        className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-gray-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span>Help Center</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" size="sm" className="text-gray-700 hover:text-pink-600">
                <Link href="/auth">
                  <User size={20} />
                </Link>
              </Button>
            )}
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
              {!isLoggedIn && (
                <Button asChild className="w-full justify-center bg-pink-600 hover:bg-pink-700">
                  <Link href="/auth" onClick={() => setIsMenuOpen(false)}>
                    Sign in
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
