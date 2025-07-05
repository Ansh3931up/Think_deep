import { NextResponse } from 'next/server'

import mongoose, { Schema, model, models } from 'mongoose'
console.log("mongo", process.env.MONGODB_URI);
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url || '', 'http://localhost')
    const adminEmail = process.env.ADMIN_EMAIL
    const isAdmin = url.searchParams.get('admin') === adminEmail
    const query = isAdmin ? {} : { hidden: false }
    const allShayari = await Shayari.find(query).sort({ createdAt: -1 })
    const hindi = allShayari.filter((s: any) => s.language === 'hindi')
    const english = allShayari.filter((s: any) => s.language === 'english')
    return NextResponse.json({ hindi, english })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shayari.' }, { status: 500 })
  }
}
