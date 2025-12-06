import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const deal = await prisma.deal.findUnique({
      where: { id },
      include: {
        company: true,
        contact: true,
        activities: true,
      },
    })

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 })
    }

    return NextResponse.json(deal)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Only update the fields that are provided
    const updateData: any = {}
    if (body.title !== undefined) updateData.title = body.title
    if (body.value !== undefined) updateData.value = body.value
    if (body.stage !== undefined) updateData.stage = body.stage
    if (body.probability !== undefined) updateData.probability = body.probability
    if (body.expectedCloseDate !== undefined) updateData.expectedCloseDate = body.expectedCloseDate
    if (body.description !== undefined) updateData.description = body.description || null

    const deal = await prisma.deal.update({
      where: { id },
      data: updateData,
      include: {
        company: true,
        contact: true,
      },
    })
    return NextResponse.json(deal)
  } catch (error) {
    console.error('Failed to update deal:', error)
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.deal.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Deal deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 })
  }
}
