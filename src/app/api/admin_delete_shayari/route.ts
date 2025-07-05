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
    await Shayari.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete shayari.' }, { status: 500 })
  }
} 