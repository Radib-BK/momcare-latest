import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ChatIcon from "@/components/ChatIcon"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "MomCare",
  description: "Your pregnancy companion",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <ChatIcon />
      </body>
    </html>
  )
}
