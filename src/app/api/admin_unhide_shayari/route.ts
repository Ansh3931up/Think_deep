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
  reports: { type: [String], default: [] },
  hidden: { type: Boolean, default: false },
})

const Shayari = models.Shayari || model('Shayari', ShayariSchema)

export async function POST(req: Request) {
  try {
    const { id, admin } = await req.json()
    if (!id || !admin || admin !== process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Not authorized.' }, { status: 403 })
    }
    const shayari = await Shayari.findById(id)
    if (!shayari) {
      return NextResponse.json({ error: 'Shayari not found.' }, { status: 404 })
    }
    shayari.hidden = false
    await shayari.save()
    return NextResponse.json(shayari)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to unhide shayari.' }, { status: 500 })
  }
} 