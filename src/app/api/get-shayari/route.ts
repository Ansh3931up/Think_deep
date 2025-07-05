import { NextResponse } from 'next/server'
import mongoose, { Schema, model, models } from 'mongoose'

// Use environment variable for MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://thebeliever39:Ehr2HjnUULLoNyuC@cluster0.pn0rjai.mongodb.net/think_deep?retryWrites=true&w=majority&appName=Cluster0"

if (!mongoose.connection.readyState) {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
  }
}

const ShayariSchema = new Schema({
  text: String,
  language: { type: String, enum: ['hindi', 'english'], required: true },
  author: { type: String, default: 'Anonymous' },
  createdAt: { type: Date, default: Date.now },
  reports: { type: [String], default: [] }, // user emails
  hidden: { type: Boolean, default: false },
})

const Shayari = models.Shayari || model('Shayari', ShayariSchema)

export async function GET(req: Request) {
  try {
    const url = new URL(req.url || '', 'http://localhost')
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || process.env.ADMIN_EMAIL
    const isAdmin = url.searchParams.get('admin') === adminEmail
    const query = isAdmin ? {} : { hidden: false }
    const allShayari = await Shayari.find(query).sort({ createdAt: -1 })
    const hindi = allShayari.filter((s: any) => s.language === 'hindi')
    const english = allShayari.filter((s: any) => s.language === 'english')
    return NextResponse.json({ hindi, english })
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
