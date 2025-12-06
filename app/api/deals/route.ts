import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        company: true,
        contact: true,
        activities: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return NextResponse.json(deals)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const deal = await prisma.deal.create({
      data: body,
      include: {
        company: true,
        contact: true,
      },
    })
    return NextResponse.json(deal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 })
  }
}
