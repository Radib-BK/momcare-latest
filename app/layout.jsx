import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ChatIcon from "@/components/ChatIcon"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata = {
  title: "MomCare - Your Pregnancy Companion",
  description:
    "Smart companion during pregnancy. Get expert help, track medications, and analyze prescriptions with ease.",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-white">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatIcon />
      </body>
    </html>
  )
}
