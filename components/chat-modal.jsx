"use client"

import { useState, useEffect, useRef } from 'react'
import { Send, X, User, CheckCheck, Loader2 } from 'lucide-react'
import { API_BASE } from '@/lib/api'

export default function ChatModal({ isOpen, onClose, bookingId, recipientName, recipientRole = 'helper', currentUserId = 'cust_1', currentUserName = 'Customer' }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  const quickReplies = [
    "I'm at the location.",
    "How long will it take?",
    "Please call me when you arrive.",
    "Thank you!",
  ]

  const fetchMessages = async () => {
    if (!bookingId) return
    try {
      const res = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/messages/${bookingId}`)
      const data = await res.json()
      if (data.success) {
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Error fetching chat messages:', err)
    }
  }

  useEffect(() => {
    if (isOpen && bookingId) {
      setLoading(true)
      fetchMessages().finally(() => setLoading(false))

      // Poll for new messages every 3 seconds
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [isOpen, bookingId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || input
    if (!text.trim() || !bookingId) return

    setSending(true)
    try {
      const res = await fetch(`${API_BASE.replace(/\/+$/, '')}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId,
          senderId: currentUserId,
          senderName: currentUserName,
          senderRole: currentUserId === 'cust_1' ? 'customer' : 'helper',
          content: text,
        }),
      })

      const data = await res.json()
      if (data.success && data.message) {
        setMessages((prev) => [...prev, data.message])
        if (!textToSend) setInput('')
      }
    } catch (err) {
      console.error('Failed to send message:', err)
    } finally {
      setSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border shadow-2xl flex flex-col h-[580px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border bg-muted/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center">
              {recipientName ? recipientName.charAt(0) : 'H'}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                {recipientName || 'Service Provider'}
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h3>
              <p className="text-xs text-muted-foreground">Booking ID: #{bookingId || '101'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-background">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-muted-foreground text-xs my-auto py-12">
              <p>No messages yet.</p>
              <p className="text-muted-foreground/70 mt-1">Start a conversation with {recipientName || 'the provider'}.</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe = msg.senderId === currentUserId
              return (
                <div key={msg._id || i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-xs ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-muted text-foreground border border-border rounded-bl-none'
                    }`}
                  >
                    {!isMe && <p className="text-[10px] font-semibold opacity-70 mb-0.5">{msg.senderName}</p>}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1 flex items-center gap-1">
                    {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && <CheckCheck className="w-3 h-3 text-primary" />}
                  </span>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="px-3 py-2 bg-muted/20 border-t border-border flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(reply)}
              className="shrink-0 bg-secondary/80 hover:bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full text-xs transition-colors border border-border/50"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="p-3 border-t border-border bg-card flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-muted/50 border border-input text-foreground rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background transition-all"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="bg-primary hover:bg-primary/90 text-primary-foreground p-2.5 rounded-xl disabled:opacity-50 transition-colors shadow-xs"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  )
}
