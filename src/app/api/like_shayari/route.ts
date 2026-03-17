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
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] }, // anonymous/user identifiers
})

const Shayari = models.Shayari || model('Shayari', ShayariSchema)

export async function POST(req: Request) {
  try {
    const { id, userId } = await req.json()

    if (!id || !userId) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }

    const shayari = await Shayari.findById(id)
    if (!shayari) {
      return NextResponse.json({ error: 'Shayari not found.' }, { status: 404 })
    }

    // Ensure fields exist
    if (typeof shayari.likes !== 'number' || isNaN(shayari.likes)) {
      shayari.likes = 0
    }
    if (!Array.isArray(shayari.likedBy)) {
      shayari.likedBy = []
    }

    // Only allow one like per userId
    if (!shayari.likedBy.includes(userId)) {
      shayari.likes += 1
      shayari.likedBy.push(userId)
      await shayari.save()
    }

    return NextResponse.json({ likes: shayari.likes })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to like shayari.' }, { status: 500 })
  }
}

