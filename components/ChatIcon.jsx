"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ChatIcon() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you with your pregnancy journey today?", isUser: false },
  ])
  const [newMessage, setNewMessage] = useState("")
  const chatBoxRef = useRef(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (isChatOpen) {
      gsap.fromTo(
        chatBoxRef.current,
        {
          opacity: 0,
          scale: 0.9,
          transformOrigin: "bottom right",
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        },
      )
    }
  }, [isChatOpen])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim() === "") return

    // Add user message
    const userMessage = { id: Date.now(), text: newMessage, isUser: true }
    setMessages([...messages, userMessage])
    setNewMessage("")

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "I understand your concern. That's common during pregnancy.",
        "Have you discussed this with your doctor?",
        "I recommend tracking this symptom and mentioning it at your next appointment.",
        "Many pregnant women experience this. Try to rest and stay hydrated.",
        "That's a great question! Let me help you find some information.",
      ]
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      setMessages((prev) => [...prev, { id: Date.now(), text: randomResponse, isUser: false }])
    }, 1000)
  }

  return (
    <>
      {/* Chat Icon */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-pink-600 hover:bg-pink-700 p-0 shadow-lg"
        aria-label="Open chat"
      >
        <MessageCircle size={24} />
      </Button>

      {/* Chat Box */}
      {isChatOpen && (
        <Card
          ref={chatBoxRef}
          className="fixed bottom-24 right-6 z-50 w-full max-w-sm shadow-xl flex flex-col"
          style={{ height: "calc(100vh - 200px)", maxHeight: "500px" }}
        >
          {/* Chat Header */}
          <CardHeader className="p-4 border-b bg-pink-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">MomCare Assistant</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-gray-200 hover:bg-pink-700"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X size={20} />
              </Button>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto chat-scrollbar">
            {messages.map((message) => (
              <div key={message.id} className={`mb-4 flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-pink-600 text-white rounded-tr-none"
                      : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Chat Input */}
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex items-center w-full">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-r-none focus-visible:ring-pink-500"
              />
              <Button type="submit" className="rounded-l-none bg-pink-600 hover:bg-pink-700" aria-label="Send message">
                <Send size={20} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
