import { NextResponse } from 'next/server'

import mongoose, { Schema, model, models } from 'mongoose'

// const uri = process.env.MONGODB_URI || ''
if (!mongoose.connection.readyState) {
  mongoose.connect("mongodb+srv://thebeliever39:Ehr2HjnUULLoNyuC@cluster0.pn0rjai.mongodb.net/think_deep?retryWrites=true&w=majority&appName=Cluster0")
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

export async function POST(req: Request) {
  try {
    const { text, language, author } = await req.json()
    if (!text || !language || !['hindi', 'english'].includes(language)) {
      return NextResponse.json({ error: 'Invalid input.' }, { status: 400 })
    }
    const newShayari = await Shayari.create({ text, language, author: author || 'Anonymous' })
    return NextResponse.json(newShayari)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to post shayari.' }, { status: 500 })
  }
}
