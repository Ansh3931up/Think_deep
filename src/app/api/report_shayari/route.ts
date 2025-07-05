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
  reports: { type: [String], default: [] },
  hidden: { type: Boolean, default: false },
})

const Shayari = models.Shayari || model('Shayari', ShayariSchema)

export async function POST(req: Request) {
  try {
    const { id, email } = await req.json()
    if (!id || !email) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }
    const shayari = await Shayari.findById(id)
    if (!shayari) {
      return NextResponse.json({ error: 'Shayari not found.' }, { status: 404 })
    }
    if (!shayari.reports.includes(email)) {
      shayari.reports.push(email)
    }
    if (shayari.reports.length > 5) {
      shayari.hidden = true
    }
    await shayari.save()
    return NextResponse.json(shayari)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to report shayari.' }, { status: 500 })
  }
} 