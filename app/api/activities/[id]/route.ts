import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: {
        contact: true,
        deal: true,
      },
    })

    if (!activity) {
      return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
    }

    return NextResponse.json(activity)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 })
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
    if (body.type !== undefined) updateData.type = body.type
    if (body.subject !== undefined) updateData.subject = body.subject
    if (body.description !== undefined) updateData.description = body.description
    if (body.dueDate !== undefined) updateData.dueDate = body.dueDate
    if (body.completed !== undefined) updateData.completed = body.completed

    const activity = await prisma.activity.update({
      where: { id },
      data: updateData,
      include: {
        contact: true,
        deal: true,
      },
    })
    return NextResponse.json(activity)
  } catch (error) {
    console.error('Failed to update activity:', error)
    return NextResponse.json({ error: 'Failed to update activity' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.activity.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Activity deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 500 })
  }
}
