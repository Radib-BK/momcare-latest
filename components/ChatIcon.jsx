"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Bot, Image as ImageIcon } from "lucide-react"
import { gsap } from "gsap"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"

export default function ChatIcon() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: "text",
      content: "Hello! I'm your MomCare Assistant. How can I help you with your pregnancy journey today?", 
      isUser: false 
    },
  ])
  const [newMessage, setNewMessage] = useState("")
  const fileInputRef = useRef(null)
  const chatBoxRef = useRef(null)
  const messagesEndRef = useRef(null)
  const chatButtonRef = useRef(null)

  useEffect(() => {
    // Floating animation for chat button
    gsap.to(chatButtonRef.current, {
      y: -10,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut"
    })

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
          duration: 0.4,
          ease: "back.out(1.7)",
        }
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
    const userMessage = { 
      id: Date.now(), 
      type: "text",
      content: newMessage, 
      isUser: true 
    }
    setMessages([...messages, userMessage])
    setNewMessage("")
    setIsTyping(true)

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponses = [
        "I understand your concern. That's common during pregnancy. Would you like me to provide more information about this?",
        "Have you discussed this with your doctor? I can help you prepare a list of questions for your next appointment.",
        "I recommend tracking this symptom and mentioning it at your next appointment. Would you like me to help you set up a reminder?",
        "Many pregnant women experience this. Try to rest and stay hydrated. Would you like some tips for managing this?",
        "That's a great question! Let me help you find some reliable information from medical sources.",
      ]
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]
      setIsTyping(false)
      setMessages((prev) => [...prev, { 
        id: Date.now(), 
        type: "text",
        content: randomResponse, 
        isUser: false 
      }])
    }, 2000)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create object URL for the uploaded image
    const imageUrl = URL.createObjectURL(file)

    // Add image message
    const imageMessage = {
      id: Date.now(),
      type: "image",
      content: imageUrl,
      isUser: true
    }
    setMessages([...messages, imageMessage])

    // Reset file input
    e.target.value = ""

    // Simulate bot response
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [...prev, { 
        id: Date.now(), 
        type: "text",
        content: "I've received your image. Is there anything specific you'd like me to look at?", 
        isUser: false 
      }])
    }, 2000)
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      {/* Chat Icon */}
      <Button
        ref={chatButtonRef}
        onClick={toggleChat}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 rounded-full bg-pink-600 hover:bg-pink-700 p-0 shadow-xl hover:shadow-2xl transition-shadow duration-300"
        aria-label="Open chat"
      >
        <MessageCircle size={28} className="text-white" />
      </Button>

      {/* Chat Box */}
      {isChatOpen && (
        <Card
          ref={chatBoxRef}
          className="fixed bottom-28 right-8 z-50 w-[400px] shadow-2xl flex flex-col bg-white rounded-2xl overflow-hidden"
          style={{ height: "600px" }}
        >
          {/* Chat Header */}
          <CardHeader className="p-4 border-b bg-gradient-to-r from-pink-600 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Bot size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">MomCare Assistant</h3>
                  <p className="text-sm text-pink-100">Always here to help</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:text-white hover:bg-white/10 rounded-full"
                onClick={toggleChat}
                aria-label="Close chat"
              >
                <X size={20} />
              </Button>
            </div>
          </CardHeader>

          {/* Chat Messages */}
          <CardContent className="flex-1 p-4 overflow-y-auto chat-scrollbar space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? "justify-end" : "justify-start"} items-end gap-2`}
              >
                {!message.isUser && (
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-pink-600" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] ${
                    message.type === "text" 
                      ? `p-3 rounded-2xl ${
                          message.isUser
                            ? "bg-pink-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`
                      : "rounded-lg overflow-hidden"
                  }`}
                >
                  {message.type === "text" ? (
                    message.content
                  ) : (
                    <Image
                      src={message.content}
                      alt="Uploaded image"
                      width={200}
                      height={200}
                      className="object-contain max-h-[200px] w-auto"
                    />
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                  <Bot size={18} className="text-pink-600" />
                </div>
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Chat Input */}
          <CardFooter className="p-4 border-t bg-white">
            <form onSubmit={handleSendMessage} className="flex items-center w-full gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={triggerImageUpload}
                className="rounded-full hover:bg-pink-50"
                aria-label="Upload image"
              >
                <ImageIcon size={18} className="text-pink-600" />
              </Button>
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-gray-200 focus-visible:ring-pink-500 focus-visible:ring-offset-2"
              />
              <Button 
                type="submit" 
                size="icon"
                className="rounded-full bg-pink-600 hover:bg-pink-700 transition-colors duration-200" 
                aria-label="Send message"
              >
                <Send size={18} />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}
