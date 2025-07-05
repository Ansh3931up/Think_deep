"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { useSwipeable } from "react-swipeable"
import {
  Heart,
  PenTool,
  Send,
  Share2,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Copy,
  Download,
  Star,
  Bookmark,
  Volume2,
  VolumeX,
  Loader2,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  FlagIcon,
  BookOpen,
  Eye,
  EyeOff,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  User,
  Globe,
 
  Pen
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Google Analytics Integration
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
  }
}

interface Shayari {
  _id: string
  text: string
  language: "hindi" | "english"
  author?: string
  category?: string
  likes: number
  createdAt: string
  hidden?: boolean
}
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ;

export default function ThinkDeepBook() {
  const [isBookOpen, setIsBookOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [userText, setUserText] = useState("")
  const [userName, setUserName] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [writeDialogOpen, setWriteDialogOpen] = useState(false)
  const [selectedShayari, setSelectedShayari] = useState<Shayari | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isAudioPlaying, setIsAudioPlaying] = useState(true)
  const [shayaris, setShayaris] = useState<Shayari[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [bookmarkedShayaris, setBookmarkedShayaris] = useState(new Set<string>())
  const [language, setLanguage] = useState<"hindi" | "english">("hindi")
  const [showClickHints, setShowClickHints] = useState(false)
  const [floatingShayaris, setFloatingShayaris] = useState<Array<{id: string, text: string, x: number, y: number, delay: number, fontSize: number}>>([])
  const audioRef = useRef<HTMLAudioElement>(null)
  const [adminMode, setAdminMode] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminShayaris, setAdminShayaris] = useState<Shayari[]>([])
  const [adminSearchTerm, setAdminSearchTerm] = useState("")
  const [adminFilter, setAdminFilter] = useState<"all" | "hidden" | "visible">("all")
  const [adminLoading, setAdminLoading] = useState(false)
  const [adminActionLoading, setAdminActionLoading] = useState<string | null>(null)
  const [adminMessage, setAdminMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [showSpotify, setShowSpotify] = useState(false);
  const [showSplash, setShowSplash] = useState(true)
  const splashMinDuration = 2000 // 2 seconds
  const splashStart = useRef(Date.now())
  const [analytics, setAnalytics] = useState<{ 
    activeUsers: string; 
    pageViews: string; 
    totalImpressions: string 
  } | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsError, setAnalyticsError] = useState<string | null>(null)
  const [propertyId, setPropertyId] = useState<string | null>(null)

  // Google Analytics tracking
  const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", eventName, {
        app_name: "think_deep",
        ...parameters,
      })
    }
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Mock API calls - Replace with your actual API
  const fetchShayaris = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/get-shayari')
      const data = await response.json()
      const filteredShayaris = data[language] || []
      setShayaris(filteredShayaris)
      // Track page view
      trackEvent("page_view", {
        page_title: "Shayari Collection",
        language: language,
        total_shayaris: filteredShayaris.length,
      })
    } catch (error) {
      console.error("Error fetching shayaris:", error)
    } finally {
      setLoading(false)
    }
  }

  const submitShayari = async () => {
    if (!userText.trim()) return
    setSubmitting(true)
    try {
      const response = await fetch('/api/post_shayari', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: userText,
          language: language,
          author: isAnonymous ? 'Anonymous' : userName,
        })
      })
      if (!response.ok) throw new Error('Failed to submit shayari')
      setUserText("")
      setUserName("")
      setWriteDialogOpen(false)
      // Track submission
      trackEvent("shayari_submitted", {
        language: language,
        is_anonymous: isAnonymous,
        text_length: userText.length,
      })
      await fetchShayaris()
      alert("Your shayari has been submitted successfully!")
    } catch (error) {
      console.error("Error submitting shayari:", error)
      alert("Failed to submit shayari. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    fetchShayaris()
  }, [language])

  // Initialize floating shayaris
  useEffect(() => {
    const floatingTexts = [
      // Hindi
      "खामोशी में मिली मुझे अपनी सबसे तेज़ आवाज़",
      "कुछ ज़ख्म हिकमत बन जाते हैं, कुछ शायरी",
      "दिल की धड़कन के बीच लिखता हूँ अपना सच",
      "तेरी गैर-मौजूदगी ने सिखाया मौजूदगी का वज़न",
      "आधी रात की बाहों में मेरी रूह बोलती है",
      "हर लफ्ज़ में छुपा है कोई अधूरा ख्वाब",
      "चाँदनी रात में दिल ने तुझे पुकारा",
      "सन्नाटे में भी गूंजती है तेरी याद",
      "मुस्कान में छुपा दर्द भी शायरी बन गया",
      // English
      "In silence, I found my loudest voice",
      "Some wounds heal into wisdom, others into poetry",
      "Between heartbeats, I write my truth",
      "Absence taught me the weight of presence",
      "Midnight whispers became my verses",
      "Every word hides an unfinished dream",
      "Moonlit nights echo your memory",
      "Even in quiet, your name resounds",
      "A smile hiding pain became poetry"
    ]

    // Shuffle and pick 10 unique lines
    const shuffled = floatingTexts
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, 10)

    // Assign each line a unique vertical band (no overlap)
    const bandHeight = 100 / (shuffled.length + 1)
    const newFloatingShayaris = shuffled.map((text, i) => {
      // Each band is bandHeight tall, add jitter within band
      const baseY = bandHeight * (i + 1)
      const jitter = (Math.random() - 0.5) * bandHeight * 0.4 // up to ±20% of band
      const y = Math.max(0, Math.min(100, baseY + jitter))
      const fontSize = Math.random() > 0.5 ? 2.8 + Math.random() * 1.2 : 1.2 + Math.random() * 0.6 // rem
      return {
        id: `floating-${i}`,
        text,
        x: 0, // not used for left-right
        y,
        delay: Math.random() * 5,
        fontSize,
      }
    })
    setFloatingShayaris(newFloatingShayaris)
  }, [])

  // Swipe handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (isBookOpen && currentPage < getTotalPages() - 1) {
        nextPage()
        trackEvent("swipe_navigation", { direction: "left", page: currentPage })
      }
    },
    onSwipedRight: () => {
      if (isBookOpen && currentPage > 0) {
        prevPage()
        trackEvent("swipe_navigation", { direction: "right", page: currentPage })
      }
    },
    trackMouse: true,
    trackTouch: true,
  })

  // Click navigation handlers
  const handlePageClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!isBookOpen) return

    const rect = event.currentTarget.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const pageWidth = rect.width
    const clickPosition = clickX / pageWidth

    if (clickPosition < 0.3) {
      // Left side click - go to previous page
      if (currentPage > 0) {
        prevPage()
        trackEvent("click_navigation", { direction: "previous", page: currentPage })
      }
    } else if (clickPosition > 0.7) {
      // Right side click - go to next page
      if (currentPage < getTotalPages() - 1) {
        nextPage()
        trackEvent("click_navigation", { direction: "next", page: currentPage })
      }
    }
  }

  const toggleBookmark = (shayariId: string) => {
    const newBookmarks = new Set(bookmarkedShayaris)
    if (newBookmarks.has(shayariId)) {
      newBookmarks.delete(shayariId)
      trackEvent("bookmark_removed", { shayari_id: shayariId })
    } else {
      newBookmarks.add(shayariId)
      trackEvent("bookmark_added", { shayari_id: shayariId })
    }
    setBookmarkedShayaris(newBookmarks)
  }

  const likeShayari = (shayariId: string) => {
    setShayaris((prev) => prev.map((s) => (s._id === shayariId ? { ...s, likes: s.likes + 1 } : s)))
    trackEvent("shayari_liked", { shayari_id: shayariId })
  }

  // Generate dark themed image from shayari
  const generateShayariImage = async (shayari: Shayari) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    canvas.width = 800
    canvas.height = 600

    // Dark gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradient.addColorStop(0, "#1e293b")
    gradient.addColorStop(0.5, "#0f172a")
    gradient.addColorStop(1, "#581c87")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Add subtle pattern
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)"
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      ctx.beginPath()
      ctx.arc(x, y, 1, 0, Math.PI * 2)
      ctx.fill()
    }

    // Add border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 2
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80)

    // Add brand
    ctx.fillStyle = "#a855f7"
    ctx.font = "bold 28px Inter, sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("think_deep", canvas.width / 2, 100)

    // Add decorative line
    ctx.strokeStyle = "#a855f7"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 50, 120)
    ctx.lineTo(canvas.width / 2 + 50, 120)
    ctx.stroke()

    // Add shayari text
    ctx.fillStyle = "#f1f5f9"
    ctx.font = "24px Georgia, serif"
    ctx.textAlign = "center"

    // Word wrap
    const words = shayari.text.split(" ")
    const lines = []
    let currentLine = ""

    for (const word of words) {
      const testLine = currentLine + word + " "
      const metrics = ctx.measureText(testLine)
      if (metrics.width > canvas.width - 120 && currentLine !== "") {
        lines.push(currentLine.trim())
        currentLine = word + " "
      } else {
        currentLine = testLine
      }
    }
    lines.push(currentLine.trim())

    const lineHeight = 40
    const startY = canvas.height / 2 - (lines.length * lineHeight) / 2

    lines.forEach((line, i) => {
      ctx.fillText(line, canvas.width / 2, startY + i * lineHeight)
    })

    // Add attribution
    ctx.fillStyle = "#94a3b8"
    ctx.font = "16px Inter, sans-serif"
    ctx.fillText(`— ${shayari.author}`, canvas.width / 2, canvas.height - 100)

    // Add likes
    ctx.fillStyle = "#ef4444"
    ctx.font = "14px Inter, sans-serif"
    ctx.textAlign = "right"
    ctx.fillText(`♥ ${shayari.likes}`, canvas.width - 60, canvas.height - 60)

    // Add website URL with icon at the bottom
    ctx.fillStyle = "#64748b"
    ctx.font = "12px Inter, sans-serif"
    ctx.textAlign = "center"

    // Add a small globe/link icon (using text symbol)
    ctx.fillText("🌐 think-deep.vercel.app", canvas.width / 2, canvas.height - 30)

    // Add a subtle separator line above the URL
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2 - 100, canvas.height - 50)
    ctx.lineTo(canvas.width / 2 + 100, canvas.height - 50)
    ctx.stroke()

    // Add "Share more at:" text above the URL
    ctx.fillStyle = "#94a3b8"
    ctx.font = "10px Inter, sans-serif"
    ctx.fillText("Share more poetry at:", canvas.width / 2, canvas.height - 45)

    return canvas.toDataURL("image/png")
  }

  const handleShare = async (shayari: Shayari) => {
    setSelectedShayari(shayari)
    setShareDialogOpen(true)
    trackEvent("share_dialog_opened", { shayari_id: shayari._id })
  }

  const shareAsImage = async (platform: string) => {
    if (!selectedShayari) return

    const imageData = await generateShayariImage(selectedShayari)

    if (imageData) {
      const link = document.createElement("a")
      link.download = `think_deep_shayari_${selectedShayari._id}.png`
      link.href = imageData

      if (platform === "download") {
        link.click()
        trackEvent("image_downloaded", { shayari_id: selectedShayari._id })
        return
      }

      try {
        const response = await fetch(imageData)
        const blob = await response.blob()

        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
          alert("Image copied to clipboard! You can now paste it on the social platform.")
        } else {
          link.click()
          alert("Image downloaded! You can now upload it to the social platform.")
        }

        // For text-based sharing platforms, prepare share text with URL
        const shareText = `"${selectedShayari.text}" - ${selectedShayari.author}\n\nDiscover more poetry at: 🌐 think-deep-lovat.vercel.app`

        // Update the URLs object to include share text where applicable
        const urls = {
          instagram: "https://www.instagram.com/",
          instagram_story: "instagram-stories://share",
          instagram_feed: "instagram://library?AssetPickerSourceType=Library&AssetPickerMediaType=Photos",
          facebook: `https://www.facebook.com/sharer/sharer.php?u=https://think-deep-lovat.vercel.app&quote=${encodeURIComponent(shareText)}`,
          twitter: `https://twitter.com/compose/tweet?text=${encodeURIComponent(shareText)}&url=https://think-deep-lovat.vercel.app`,
          whatsapp: `https://web.whatsapp.com/send?text=${encodeURIComponent(shareText)}`,
        }

        // Handle Instagram deep links for mobile apps
        if (platform === "instagram_story" || platform === "instagram_feed") {
          // Try to open Instagram app first
          const instagramUrl = urls[platform as keyof typeof urls]
          window.location.href = instagramUrl
          
          // Fallback to web Instagram after a short delay
          setTimeout(() => {
            window.open("https://www.instagram.com/", "_blank")
          }, 1000)
        } else {
          window.open(urls[platform as keyof typeof urls], "_blank")
        }
        trackEvent("shared_to_platform", { platform, shayari_id: selectedShayari._id })
      } catch (error) {
        console.error("Error sharing image:", error)
        link.click()
      }
    }
  }

  const copyToClipboard = () => {
    if (selectedShayari) {
      const shareText = `"${selectedShayari.text}" - ${selectedShayari.author}\n\n🌐 Discover more at: think-deep.vercel.app`
      navigator.clipboard.writeText(shareText)
      alert("Text copied to clipboard!")
      trackEvent("text_copied", { shayari_id: selectedShayari._id })
    }
  }

  // Dark themed pages with enhanced animations
  const pages = [
    // Dark Cover Page with Animations
    <div
      key="cover-page"
      className="h-full flex flex-col justify-center items-center text-center relative px-8 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Audio Control */}
      <div className="absolute top-6 right-6 animate-fade-in">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAudioPlaying(!isAudioPlaying)}
          className="text-gray-400 hover:text-white bg-gray-800/50 backdrop-blur-sm transition-all duration-300 hover:scale-110"
        >
          {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </Button>
      </div>

      <div className="space-y-8 relative z-10 max-w-lg animate-slide-up">
        <div className="flex items-center justify-center mb-8 animate-bounce-slow">
          <Star className="w-8 h-8 text-amber-400 mr-3 animate-pulse" />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
          <Star className="w-8 h-8 text-amber-400 ml-3 animate-pulse delay-500" />
        </div>

        <h1 className="text-6xl font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x font-playfair">
          think_deep
        </h1>

        <p className="text-xl text-gray-300 font-light leading-relaxed animate-fade-in-up delay-300">
          A curated collection of profound thoughts and poetry
        </p>

        <div className="flex items-center justify-center space-x-4 animate-fade-in-up delay-500">
          <div className="w-12 h-0.5 bg-purple-500 animate-expand-width"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-12 h-0.5 bg-purple-500 animate-expand-width delay-200"></div>
        </div>

        <div className="flex justify-center space-x-4 animate-fade-in-up delay-700">
          <Button
            variant={language === "hindi" ? "default" : "outline"}
            onClick={() => setLanguage("hindi")}
            className="px-6 bg-purple-600 hover:bg-purple-700 border-purple-500 text-white transition-all duration-300 hover:scale-105"
          >
            हिंदी
          </Button>
          <Button
            variant={language === "english" ? "default" : "outline"}
            onClick={() => setLanguage("english")}
            className="px-6 bg-purple-600 hover:bg-purple-700 border-purple-500 text-white transition-all duration-300 hover:scale-105"
          >
            English
          </Button>
        </div>

        <p className="text-sm text-gray-400 animate-fade-in-up delay-1000">
          {loading ? (
            <span className="flex items-center justify-center">
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Loading collection...
            </span>
          ) : (
            `${shayaris.length} pieces available`
          )}
        </p>

        <div className="mt-12 text-xs text-gray-500 animate-pulse delay-1500">
          Swipe, click sides, or tap to explore
        </div>
      </div>
    </div>,

    // Dark Shayari Pages with Enhanced Animations
    ...shayaris.filter(s => !s.hidden).map((shayari, index) => (
      <div
        key={`shayari-page-${shayari._id}`}
        className="h-full flex flex-col p-8 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black cursor-pointer"
        onClick={handlePageClick}
        onMouseEnter={() => setShowClickHints(true)}
        onMouseLeave={() => setShowClickHints(false)}
      >
        {/* Click Hint Overlays */}
        {showClickHints && (
          <>
            <div className="absolute left-0 top-0 w-1/3 h-full bg-gradient-to-r from-purple-500/10 to-transparent flex items-center justify-start pl-4 animate-fade-in">
              <ChevronLeft className="w-8 h-8 text-purple-400/50 animate-pulse" />
            </div>
            <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-purple-500/10 to-transparent flex items-center justify-end pr-4 animate-fade-in">
              <ChevronRight className="w-8 h-8 text-purple-400/50 animate-pulse" />
            </div>
          </>
        )}

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-purple-400/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${4 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700 animate-slide-down">
          <div className="flex items-center space-x-3">
            <span className="text-purple-400 text-sm font-mono animate-fade-in">#{index + 1}</span>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded animate-fade-in delay-100">
              {shayari.language}
            </span>
          </div>
          <div className="text-xs text-gray-500 font-mono animate-fade-in delay-200">think_deep</div>
        </div>

        <div className="flex-1 flex flex-col justify-center animate-slide-up delay-300">
          <Card className="border-gray-700 shadow-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm mb-8 transform hover:scale-105 transition-all duration-500 hover:shadow-purple-500/20 animate-card-appear">
            <CardContent className="p-8">
              <blockquote className={`text-2xl font-light text-gray-100 leading-relaxed text-center mb-6 animate-text-reveal ${shayari.text.includes('ख') ? 'font-noto' : 'font-playfair'}`}>
                &quot;{shayari.text}&quot;
              </blockquote>

              <div className="flex justify-between items-center pt-6 border-t border-gray-700 animate-fade-in-up delay-500">
                <span className="text-sm text-gray-400">— {shayari.author}</span>
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-red-400 h-8 w-8 p-0 transition-all duration-300 hover:scale-125 animate-bounce-in delay-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      likeShayari(shayari._id)
                    }}
                  >
                    <Heart className="w-4 h-4" />
                    <span className="ml-1 text-xs">{shayari.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 transition-all duration-300 hover:scale-125 animate-bounce-in delay-700 ${
                      bookmarkedShayaris.has(shayari._id)
                        ? "text-amber-400 hover:text-amber-300"
                        : "text-gray-400 hover:text-amber-400"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleBookmark(shayari._id)
                    }}
                  >
                    <Bookmark className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-blue-400 h-8 w-8 p-0 transition-all duration-300 hover:scale-125 animate-bounce-in delay-800"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare(shayari)
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-orange-400 h-8 w-8 p-0 transition-all duration-300 hover:scale-125 animate-bounce-in delay-900"
                    onClick={async (e) => {
                      e.stopPropagation()
                      const email = prompt('Enter your email to report this shayari:')
                      if (!email) return
                      
                      // Email validation
                      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                      if (!emailRegex.test(email)) {
                        alert('Please enter a valid email address.')
                        return
                      }
                      
                      try {
                        const res = await fetch('/api/report_shayari', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: shayari._id || shayari._id, email })
                        })
                        if (!res.ok) throw new Error('Failed to report')
                        alert('Reported successfully. If enough users report, this shayari will be hidden.')
                        await fetchShayaris()
                      } catch (err) {
                        alert('Failed to report. You may have already reported this shayari.')
                      }
                    }}
                    title="Report"
                  >
                    <FlagIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center animate-fade-in delay-1000">
            <div className="w-16 h-0.5 bg-purple-500 mx-auto animate-expand-width delay-1200"></div>
          </div>
        </div>
      </div>
    )),
  ]

  const getCurrentPages = () => {
    return pages[currentPage] || pages[0]
  }

  const getTotalPages = () => {
    return pages.length
  }

  const openBook = () => {
    setIsBookOpen(true)
    trackEvent("book_opened")
  }

  const closeBook = () => {
    setIsBookOpen(false)
    setCurrentPage(0)
    trackEvent("book_closed")
  }

  const nextPage = () => {
    if (currentPage < getTotalPages() - 1) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage + 1)
        setIsFlipping(false)
        trackEvent("page_turned", { direction: "next", page: currentPage + 1 })
      }, 300)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage(currentPage - 1)
        setIsFlipping(false)
        trackEvent("page_turned", { direction: "previous", page: currentPage - 1 })
      }, 300)
    }
  }

  const openWriteDialog = () => {
    setWriteDialogOpen(true)
    trackEvent("write_dialog_opened")
  }

  const fetchAdminShayaris = async (email: string) => {
    setAdminLoading(true)
    try {
      const res = await fetch(`/api/get-shayari?admin=${encodeURIComponent(email)}`)
      const data = await res.json()
      setAdminShayaris([...(data.hindi || []), ...(data.english || [])])
    } catch (error) {
      setAdminMessage({ type: "error", text: "Failed to load shayaris" })
    } finally {
      setAdminLoading(false)
    }
  }

  const handleAdminAction = async (action: "unhide" | "delete", shayariId: string) => {
    setAdminActionLoading(shayariId)
    try {
      const endpoint = action === "unhide" ? "/api/admin_unhide_shayari" : "/api/admin_delete_shayari"
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: shayariId, admin: adminEmail })
      })
      
      if (res.ok) {
        setAdminMessage({ type: "success", text: `Shayari ${action === "unhide" ? "unhidden" : "deleted"} successfully` })
        await fetchAdminShayaris(adminEmail)
      } else {
        setAdminMessage({ type: "error", text: `Failed to ${action} shayari` })
      }
    } catch (error) {
      setAdminMessage({ type: "error", text: `Failed to ${action} shayari` })
    } finally {
      setAdminActionLoading(null)
    }
  }

  const openAdminPanel = async () => {
    const email = prompt('Enter admin email:')
    if (!email) return
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.')
      return
    }
    
    if (email === ADMIN_EMAIL) {
      setAdminEmail(email)
      setAdminMode(true)
      await fetchAdminShayaris(email)
    } else {
      alert('Not authorized')
    }
  }

  const filteredAdminShayaris = adminShayaris.filter(shayari => {
    const matchesSearch = shayari.text.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
                         (shayari.author || "").toLowerCase().includes(adminSearchTerm.toLowerCase())
    const matchesFilter = adminFilter === "all" || 
                         (adminFilter === "hidden" && shayari.hidden) ||
                         (adminFilter === "visible" && !shayari.hidden)
    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    if (!loading) {
      const elapsed = Date.now() - splashStart.current
      const remaining = splashMinDuration - elapsed
      const timeout = setTimeout(() => setShowSplash(false), Math.max(remaining, 0))
      return () => clearTimeout(timeout)
    }
  }, [loading])

  useEffect(() => {
    if (adminMode) {
      setAnalyticsLoading(true)
      setAnalyticsError(null)
      fetch('/api/analytics')
        .then(res => res.json())
        .then(data => {
          if (data.week && data.week.length > 0) {
            const weekMetrics = data.week[0].metricValues
            const allTimeMetrics = data.allTime?.[0]?.metricValues || []
            
            setAnalytics({
              activeUsers: weekMetrics[0]?.value || '0',
              pageViews: weekMetrics[1]?.value || '0',
              totalImpressions: allTimeMetrics[0]?.value || '0',
            })
          } else {
            setAnalytics({ 
              activeUsers: '0', 
              pageViews: '0', 
              totalImpressions: '0' 
            })
          }
          // Set property ID from API response or fallback to env variable
          setPropertyId(data.propertyId || process.env.NEXT_PUBLIC_GA4_PROPERTY_ID || 'Not configured')
        })
        .catch(err => {
          setAnalyticsError('Failed to load analytics')
          setPropertyId(process.env.NEXT_PUBLIC_GA4_PROPERTY_ID || 'Not configured')
        })
        .finally(() => setAnalyticsLoading(false))
    }
  }, [adminMode])

  if (showSplash) {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-900 to-purple-900 animate-fade-in-up">
        <img src="/logo.jpg" alt="Think Deep Logo" className="w-32 h-32 rounded-full shadow-2xl mb-6 animate-glow-pulse" />
        <h1 className="text-4xl sm:text-6xl font-playfair font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 drop-shadow-lg animate-gradient-x">think_deep</h1>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen transition-colors duration-500 relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-purple-900">
        {/* Enhanced Navigation Bar - Mobile Responsive */}
        <nav className="w-full bg-transparent backdrop-blur-md border-b border-white/10 shadow-lg relative z-20 animate-slide-down">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-2 sm:py-4">
            {/* Mobile Layout */}
            <div className="sm:hidden flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src="/logo.jpg" 
                  alt="Think Deep Logo" 
                  className="w-6 h-6 rounded-full object-cover shadow-lg"
                />
                <span className="text-xl font-playfair font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 tracking-wide animate-gradient-x drop-shadow-lg">
                  think_deep
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchShayaris()}
                  className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 p-1.5 rounded-lg bg-white/10 backdrop-blur-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openWriteDialog}
                  className="border border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 bg-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full font-medium text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white bg-white/10 backdrop-blur-sm"
                  onClick={openAdminPanel}
                >
                  Admin
                </Button>
              </div>
            </div>
            
            {/* Desktop Layout */}
            <div className="hidden sm:flex sm:items-center sm:justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                <div className="flex items-center gap-3">
                  <img 
                    src="/logo.jpg" 
                    alt="Think Deep Logo" 
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-lg"
                  />
                  <span className="text-2xl sm:text-3xl font-playfair font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 tracking-wide animate-gradient-x drop-shadow-lg">
                    think_deep
                  </span>
                </div>
                <span className="text-xs sm:text-sm text-white/70 font-light italic animate-fade-in-up delay-300">
                  A poetic sanctuary for shayari & thoughts
                </span>
              </div>
              <div className="flex items-center gap-3 mt-2 sm:mt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => fetchShayaris()}
                  className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105 px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openWriteDialog}
                  className="border border-white/20 text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full font-medium text-sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Contribute
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white bg-white/10 backdrop-blur-sm"
                  onClick={openAdminPanel}
                >
                  Admin
                </Button>
              </div>
            </div>
          </div>
        </nav>

        <div className="flex justify-center items-center h-[calc(100vh-60px)] sm:h-[calc(100vh-80px)] p-2 sm:p-4 relative overflow-hidden">
          {/* Floating Shayari Background - z-0, behind the book */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {floatingShayaris.map((shayari) => (
              <div
                key={shayari.id}
                className={`absolute text-white/15 font-playfair font-semibold animate-shayari-left-right drop-shadow-2xl`}
                style={{
                  top: `${shayari.y}%`,
                  left: 0,
                  fontSize: `${shayari.fontSize}rem`,
                  fontWeight: 600,
                  letterSpacing: '0.01em',
                  textShadow: '0 4px 24px #000, 0 1px 0 #fff2',
                  animationDelay: `${shayari.delay}s`,
                  animationDuration: `${22 + Math.random() * 10}s`,
                  whiteSpace: 'nowrap',
                  opacity: 0.7,
                  fontFamily: shayari.text.match(/[\u0900-\u097F]/) ? 'Noto Sans Devanagari, serif' : 'Playfair Display, serif',
                }}
              >
                {shayari.text}
              </div>
            ))}
          </div>

          {/* Book and all book content - z-10, above the floating text */}
          <div className="relative z-10" style={{ perspective: "3000px" }}>
            {!isBookOpen ? (
              // Dark Professional Closed Book with Enhanced Animations
              <div className="relative cursor-pointer group animate-book-entrance" onClick={openBook}>
                <div
                  className={`relative ${isMobile ? "w-[320px] h-[420px]" : "w-[400px] h-[500px]"} bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-r-lg shadow-2xl transform transition-all duration-1000 group-hover:scale-105 group-hover:rotate-y-2 border border-gray-700 animate-glow-pulse`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateY(-6deg) rotateX(2deg)",
                    boxShadow: `
                      20px 20px 60px rgba(0,0,0,0.8),
                      inset -5px 0 10px rgba(0,0,0,0.5),
                      0 0 0 1px rgba(255,255,255,0.05),
                      0 0 30px rgba(147, 51, 234, 0.2)
                    `,
                  }}
                >
                  {/* Dark Book Spine */}
                  <div
                    className={`absolute left-0 top-0 ${isMobile ? "w-8 h-full" : "w-10 h-full"} bg-gradient-to-b from-purple-700 to-indigo-900 rounded-l-lg`}
                    style={{
                      transform: `rotateY(-90deg) translateZ(${isMobile ? "4px" : "5px"})`,
                      transformOrigin: "left center",
                      boxShadow: "inset -4px 0 10px rgba(0,0,0,0.6)",
                    }}
                  >
                    <div
                      className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs font-light tracking-wider"
                      style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                    >
                      think_deep
                    </div>
                  </div>

                  {/* Dark Cover Content */}
                  <div
                    className={`flex flex-col justify-center items-center h-full text-gray-100 ${isMobile ? "p-8 ml-8" : "p-12 ml-10"} relative`}
                  >
                    {/* Subtle glow effect behind the title */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 rounded-lg animate-pulse-slow"></div>
                    <div className="text-center space-y-6">
                      <div className="flex items-center justify-center mb-6 animate-float">
                        <div className="w-12 h-0.5 bg-purple-500 animate-expand-width"></div>
                        <div className="mx-3 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <div className="w-12 h-0.5 bg-purple-500 animate-expand-width delay-200"></div>
                      </div>

                      <h1
                        className={`${isMobile ? "text-3xl" : "text-4xl"} font-light tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 animate-gradient-x`}
                      >
                        think_deep
                      </h1>

                      <div
                        className={`${isMobile ? "w-20" : "w-24"} h-0.5 bg-purple-500 mx-auto animate-expand-width delay-500`}
                      ></div>

                      <p
                        className={`${isMobile ? "text-sm" : "text-base"} font-light text-gray-300 animate-fade-in-up delay-700`}
                      >
                        Poetry & Thoughts
                      </p>

                      <p
                        className={`${isMobile ? "text-xs" : "text-sm"} text-gray-400 max-w-xs leading-relaxed animate-fade-in-up delay-1000`}
                      >
                        A curated collection of profound thoughts, poetry, and reflections from hearts around the world
                      </p>
                    </div>

                    <div
                      className={`absolute ${isMobile ? "top-4 right-4" : "top-6 right-6"} text-xs text-gray-500 animate-fade-in delay-1200`}
                    >
                      {shayaris.length} pieces
                    </div>

                    <div
                      className={`absolute ${isMobile ? "bottom-4 left-4" : "bottom-6 left-6"} text-xs text-gray-500 animate-pulse delay-1500`}
                    >
                      Tap to open
                    </div>
                  </div>

                  {/* Book Pages Edge */}
                  <div
                    className={`absolute right-0 ${isMobile ? "top-4 bottom-4 w-3" : "top-6 bottom-6 w-4"} bg-gradient-to-b from-gray-700 to-gray-800 rounded-r-sm`}
                    style={{
                      boxShadow: "inset -2px 0 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    {[...Array(15)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute right-0 w-full h-0.5 bg-gray-600/30 animate-fade-in"
                        style={{
                          top: `${5 + i * 6}%`,
                          animationDelay: `${i * 50}ms`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Open Book with Enhanced Animations and Click Navigation
              <div
                {...swipeHandlers}
                className={`relative transition-all duration-600 ${isBookOpen ? "animate-book-open" : ""}`}
              >
                <div
                  className={`relative w-screen h-[95vh] max-h-[95vh] flex flex-col bg-gray-900 overflow-hidden transition-all duration-300 ${isFlipping ? "animate-page-flip" : ""}`}
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipping ? "rotateY(2deg) scale(0.98)" : "rotateY(0deg) scale(1)",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Page content */}
                  <div className="flex-1 overflow-hidden">{getCurrentPages()}</div>

                  {/* Dark Professional Navigation */}
                  <div className="flex justify-between items-center p-6 bg-black/90 backdrop-blur-sm border-t border-gray-800 animate-slide-up">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400 animate-fade-in">
                        <span className="text-sm text-gray-400 animate-fade-in hidden sm:inline">
                          Swipe, click sides to navigate • {currentPage + 1} of {getTotalPages()}
                        </span>
                        <span className="text-sm text-gray-400 animate-fade-in sm:hidden">
                          {currentPage + 1} / {getTotalPages()}
                        </span>
                      </span>
        </div>

                    <div className="flex items-center space-x-2">
                      {Array.from({ length: Math.min(getTotalPages(), 10) }, (_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 animate-bounce-in ${
                            index === currentPage
                              ? "bg-purple-500 scale-125"
                              : index < currentPage
                                ? "bg-purple-400/60"
                                : "bg-gray-600"
                          }`}
                          style={{ animationDelay: `${index * 50}ms` }}
                        />
                      ))}
                      {getTotalPages() > 10 && <span className="text-xs text-gray-500 ml-2">...</span>}
                    </div>

                    <Button
                      onClick={closeBook}
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-105 animate-fade-in bg-transparent"
                    >
                      Close Book
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Floating Write Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={openWriteDialog}
                  className={`fixed ${
                    isBookOpen ? "bottom-24 right-6 hidden" : isMobile ? "bottom-6 right-6" : "bottom-8 right-8"
                  } bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 hover:from-purple-700 hover:via-pink-700 hover:to-orange-700 text-white rounded-full ${
                    isMobile ? "w-14 h-14" : "w-16 h-16"
                  } transition-all duration-300 hover:scale-110 z-50 shadow-2xl animate-float-slow`}
                  style={{
                    boxShadow: `
                      0 20px 40px rgba(147, 51, 234, 0.4),
                      0 10px 20px rgba(0,0,0,0.5),
                      inset 0 2px 0 rgba(255,255,255,0.1)
                    `,
                  }}
                >
                  <PenTool className={`${isMobile ? "w-6 h-6" : "w-7 h-7"} animate-pulse`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="bg-gray-800 text-gray-200 border-gray-700">
                <p>Contribute your thoughts</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Dark Write Dialog */}
        <Dialog open={writeDialogOpen} onOpenChange={setWriteDialogOpen}>
          <DialogContent className="sm:max-w-lg bg-gray-900 border border-gray-700 text-gray-100 animate-dialog-appear">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Share Your Thoughts</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="language-select" className="text-sm text-gray-300">
                  Language
                </Label>
                <div className="flex space-x-2">
                  <Button
                    variant={language === "hindi" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("hindi")}
                    className="bg-purple-600 hover:bg-purple-700 border-purple-500 transition-all duration-300 hover:scale-105"
                  >
                    हिंदी
                  </Button>
                  <Button
                    variant={language === "english" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("english")}
                    className="bg-purple-600 hover:bg-purple-700 border-purple-500 transition-all duration-300 hover:scale-105"
                  >
                    English
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shayari-text" className="text-sm text-gray-300">
                  Your Thought or Poetry
                </Label>
                <Textarea
                  id="shayari-text"
                  placeholder={
                    language === "hindi" ? "अपने दिल की बात यहाँ लिखें..." : "Share your thoughts or poetry here..."
                  }
                  className="min-h-[120px] bg-gray-800 border-gray-600 focus-visible:ring-purple-500 text-gray-100 placeholder:text-gray-500"
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="anonymous-mode" checked={isAnonymous} onCheckedChange={setIsAnonymous} />
                  <Label htmlFor="anonymous-mode" className="text-sm text-gray-300">
                    Submit anonymously
                  </Label>
                </div>

                {!isAnonymous && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="author-name" className="text-sm text-gray-300">
                      Your Name
                    </Label>
                    <Input
                      id="author-name"
                      placeholder="How would you like to be credited?"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="bg-gray-800 border-gray-600 focus-visible:ring-purple-500 text-gray-100 placeholder:text-gray-500"
                    />
                  </div>
                )}
              </div>

              <Button
                onClick={submitShayari}
                disabled={!userText.trim() || submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-300 hover:scale-105"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dark Share Dialog */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-700 text-gray-100 animate-dialog-appear">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Share This Thought</DialogTitle>
            </DialogHeader>
            {selectedShayari && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <blockquote className="text-lg font-light text-gray-100 leading-relaxed">
                    &quot;{selectedShayari.text}&quot;
                  </blockquote>
                  <p className="text-sm text-gray-400 mt-2">— {selectedShayari.author}</p>
                </div>

                <div className="text-center text-sm text-gray-400 mb-2">Share as beautiful image ✨</div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => shareAsImage("instagram")}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Button>

                  <Button
                    onClick={() => shareAsImage("instagram_story")}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram Story
                  </Button>

                  <Button
                    onClick={() => shareAsImage("instagram_feed")}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram Feed
                  </Button>

                  <Button
                    onClick={() => shareAsImage("facebook")}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Facebook className="w-4 h-4" />
                    Facebook
                  </Button>

                  <Button
                    onClick={() => shareAsImage("twitter")}
                    className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </Button>

                  <Button
                    onClick={() => shareAsImage("whatsapp")}
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white transition-all duration-300 hover:scale-105"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-105 bg-transparent"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Text
                  </Button>

                  <Button
                    onClick={() => shareAsImage("download")}
                    variant="outline"
                    className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Save Image
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Admin Dashboard Modal */}
        <Dialog open={adminMode} onOpenChange={setAdminMode}>
          <DialogContent className="sm:max-w-4xl bg-gray-900 border border-pink-500/30 text-gray-100 animate-dialog-appear max-h-[90vh] overflow-hidden">
            <DialogHeader className="border-b border-gray-700 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/logo.jpg" 
                      alt="Think Deep Logo" 
                      className="w-8 h-8 rounded-full object-cover shadow-lg"
                    />
                   
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-pink-400">Admin Dashboard</DialogTitle>
                    <DialogDescription className="text-gray-400">
                      Moderate and manage reported shayaris
                    </DialogDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <User className="w-4 h-4" />
                  {adminEmail}
                </div>
              </div>
              {/* Analytics Widget */}
              <div className="mt-4">
                {analyticsLoading ? (
                  <div className="flex items-center gap-2 text-sm text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /> Loading analytics...</div>
                ) : analyticsError ? (
                  <div className="text-sm text-red-400">{analyticsError}</div>
                ) : analytics ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-green-400 text-xs">Active Users</span>
                        <span className="text-gray-300 text-sm">7 days: {analytics.activeUsers}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-blue-400 text-xs">Page Views</span>
                        <span className="text-gray-300 text-sm">7 days: {analytics.pageViews}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-amber-400 text-xs">Total Impressions</span>
                        <span className="text-gray-300 text-sm">All time: {analytics.totalImpressions}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg border border-gray-700">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-purple-400 text-xs">GA4 Property ID</span>
                        <span className="text-gray-300 font-mono text-xs">{propertyId}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Analytics not available</span>
                  </div>
                )}
              </div>
            </DialogHeader>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 py-4 border-b border-gray-700">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by text or author..."
                  value={adminSearchTerm}
                  onChange={(e) => setAdminSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 focus-visible:ring-pink-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={adminFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAdminFilter("all")}
                  className="bg-pink-600 hover:bg-pink-700"
                >
                  All ({adminShayaris.length})
                </Button>
                <Button
                  variant={adminFilter === "hidden" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAdminFilter("hidden")}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Hidden ({adminShayaris.filter(s => s.hidden).length})
                </Button>
                <Button
                  variant={adminFilter === "visible" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setAdminFilter("visible")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Visible ({adminShayaris.filter(s => !s.hidden).length})
                </Button>
              </div>
            </div>

            {/* Message Display */}
            {adminMessage && (
              <div className={`p-3 rounded-lg border ${
                adminMessage.type === "success" 
                  ? "bg-green-500/20 border-green-500/30 text-green-400" 
                  : "bg-red-500/20 border-red-500/30 text-red-400"
              }`}>
                <div className="flex items-center gap-2">
                  {adminMessage.type === "success" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <AlertTriangle className="w-4 h-4" />
                  )}
                  {adminMessage.text}
                </div>
              </div>
            )}

            {/* Shayaris List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {adminLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-pink-400 mr-3" />
                  <span className="text-gray-400">Loading shayaris...</span>
                </div>
              ) : filteredAdminShayaris.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <img 
                      src="/logo.jpg" 
                      alt="Think Deep Logo" 
                      className="w-12 h-12 rounded-full object-cover"
                    />
    </div>
                  <h3 className="text-lg font-semibold text-gray-300 mb-2">No shayaris found</h3>
                  <p className="text-gray-400">
                    {adminSearchTerm || adminFilter !== "all" 
                      ? "Try adjusting your search or filter criteria"
                      : "All shayaris are currently visible and well-behaved ✨"
                    }
                  </p>
                </div>
              ) : (
                filteredAdminShayaris.map((shayari) => (
                  <div key={shayari._id || shayari._id} className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-gray-600 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="text-lg text-white mb-3 leading-relaxed">
                          "{shayari.text}"
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {shayari.author || "Anonymous"}
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {shayari.language === "hindi" ? "Hindi" : "English"}
                          </div>
                          <div className="flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {(shayari as any).reportsCount || 0} reports
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                            shayari.hidden 
                              ? "bg-red-500/20 text-red-400 border border-red-500/30" 
                              : "bg-green-500/20 text-green-400 border border-green-500/30"
                          }`}>
                            {shayari.hidden ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            {shayari.hidden ? "Hidden" : "Visible"}
                          </div>
                        </div>
                      </div>
                      
                      {shayari.hidden && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleAdminAction("unhide", shayari._id || shayari._id)}
                            disabled={adminActionLoading === (shayari._id || shayari._id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {adminActionLoading === (shayari._id || shayari._id) ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                            Unhide
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteConfirmId(shayari._id || shayari._id)}
                            disabled={adminActionLoading === (shayari._id || shayari._id)}
                          >
                            {adminActionLoading === (shayari._id || shayari._id) ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <DialogFooter className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between w-full">
                <div className="text-sm text-gray-400">
                  {filteredAdminShayaris.length} of {adminShayaris.length} shayaris
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdminMode(false)
                    setAdminSearchTerm("")
                    setAdminFilter("all")
                    setAdminMessage(null)
                    setDeleteConfirmId(null)
                  }}
                >
                  Close
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent className="sm:max-w-md bg-gray-900 border border-red-500/30 text-gray-100">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                </div>
                <DialogTitle className="text-xl font-bold text-red-400">Confirm Deletion</DialogTitle>
              </div>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-300 mb-4">
                Are you sure you want to permanently delete this shayari? This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (deleteConfirmId) {
                    handleAdminAction("delete", deleteConfirmId)
                    setDeleteConfirmId(null)
                  }
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Floating Write Button (hide when book is open) */}
        {!isBookOpen ? (
          <button
            onClick={openWriteDialog}
            className="fixed bottom-24 right-4 sm:bottom-16 sm:right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-xl z-50 hover:scale-110 transition-all animate-glow-pulse border-2 border-purple-500/40"
            aria-label="Write Shayari"
          >
            <Plus className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={openWriteDialog}
            className="fixed bottom-24 left-4 sm:bottom-16 sm:left-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-xl z-50 hover:scale-110 transition-all animate-glow-pulse border-2 border-purple-500/40"
            aria-label="Write Shayari"
          >
            <Pen className="w-6 h-6" />
          </button>
        )}

        {/* Floating Spotify Player Toggle */}
        <button
          onClick={() => setShowSpotify((v) => !v)}
          className={`fixed ${showSpotify ? 'bottom-44 right-4 sm:bottom-32 sm:right-8' : 'bottom-24 right-4 sm:bottom-16 sm:right-8'} bg-black text-white p-5 sm:p-6 rounded-full shadow-2xl z-[999] pointer-events-auto hover:bg-purple-700 transition-all animate-glow-pulse border-2 border-purple-500/40`}
          aria-label="Toggle Spotify Player"
        >
          <span className="text-3xl sm:text-4xl">🎶</span>
        </button>
        {showSpotify && (
          <iframe
            style={{ borderRadius: 12 }}
            src="https://open.spotify.com/embed/playlist/189Sow1xr7R94oSKs4kISc?utm_source=generator"
            width="300"
            height="80"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="fixed bottom-4 right-4 rounded-lg shadow-lg z-[1000] pointer-events-auto"
          ></iframe>
        )}
      </div>

      <style jsx>{`
        @keyframes book-open {
          0% {
            transform: rotateY(-90deg) scale(0.8);
            opacity: 0;
          }
          100% {
            transform: rotateY(0deg) scale(1);
            opacity: 1;
          }
        }

        @keyframes page-flip {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(5deg) scale(0.95); }
          100% { transform: rotateY(0deg) scale(1); }
        }

        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-5px) rotate(2deg); }
        }

        @keyframes float-text {
          0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.2;
          }
          25% { 
            transform: translateY(-20px) translateX(10px) rotate(1deg);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-40px) translateX(-5px) rotate(-1deg);
            opacity: 0.4;
          }
          75% { 
            transform: translateY(-20px) translateX(-10px) rotate(1deg);
            opacity: 0.3;
          }
        }

        @keyframes float-particle {
          0%, 100% { 
            transform: translateY(0px) translateX(0px);
            opacity: 0.3;
          }
          50% { 
            transform: translateY(-30px) translateX(15px);
            opacity: 0.6;
          }
        }

        @keyframes twinkle {
          0%, 100% { 
            opacity: 0.4;
            transform: scale(1) rotate(0deg);
          }
          50% { 
            opacity: 0.8;
            transform: scale(1.2) rotate(180deg);
          }
        }

        @keyframes pulse-slow {
          0%, 100% { 
            opacity: 0.1;
          }
          50% { 
            opacity: 0.3;
          }
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }

        @keyframes expand-width {
          0% { width: 0; }
          100% { width: 100%; }
        }

        @keyframes slide-up {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slide-down {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes bounce-in {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes card-appear {
          0% { transform: translateY(50px) scale(0.9); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes text-reveal {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes book-entrance {
          0% { transform: scale(0.8) rotateY(-20deg); opacity: 0; }
          100% { transform: scale(1) rotateY(-6deg); opacity: 1; }
        }

        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 30px 8px rgba(147, 51, 234, 0.4), 0 0 0 0 rgba(236, 72, 153, 0.2); }
          50% { box-shadow: 0 0 60px 16px rgba(236, 72, 153, 0.5), 0 0 0 8px rgba(147, 51, 234, 0.2); }
        }

        @keyframes dialog-appear {
          0% { transform: scale(0.9) translateY(20px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes shayari-left-right {
          0% {
            transform: translateX(-40vw);
          }
          100% {
            transform: translateX(120vw);
          }
        }

        .animate-book-open { animation: book-open 0.6s ease-out; }
        .animate-page-flip { animation: page-flip 0.3s ease-in-out; }
        .animate-gradient-x { 
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite; 
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-text { animation: float-text 20s ease-in-out infinite; }
        .animate-float-particle { animation: float-particle 12s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 4s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        .animate-expand-width { animation: expand-width 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
        .animate-card-appear { animation: card-appear 0.8s ease-out; }
        .animate-text-reveal { animation: text-reveal 1s ease-out; }
        .animate-book-entrance { animation: book-entrance 1s ease-out; }
        .animate-glow-pulse { animation: glow-pulse 2s ease-in-out infinite; }
        .animate-dialog-appear { animation: dialog-appear 0.4s ease-out; }
        .animate-shayari-left-right { animation: shayari-left-right linear infinite; }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
        .delay-1200 { animation-delay: 1200ms; }
        .delay-1500 { animation-delay: 1500ms; }
      `}</style>
    </TooltipProvider>
  )
}
