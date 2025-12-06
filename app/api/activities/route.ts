import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        contact: true,
        deal: true,
      },
      orderBy: {
        dueDate: 'asc',
      },
    })
    return NextResponse.json(activities)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const activity = await prisma.activity.create({
      data: body,
      include: {
        contact: true,
        deal: true,
      },
    })
    return NextResponse.json(activity)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}
