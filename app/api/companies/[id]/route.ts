import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        deals: true,
      },
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
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
    if (body.name !== undefined) updateData.name = body.name
    if (body.industry !== undefined) updateData.industry = body.industry || null
    if (body.website !== undefined) updateData.website = body.website || null
    if (body.phone !== undefined) updateData.phone = body.phone || null
    if (body.employees !== undefined) updateData.employees = body.employees
    if (body.revenue !== undefined) updateData.revenue = body.revenue

    const company = await prisma.company.update({
      where: { id },
      data: updateData,
      include: {
        contacts: true,
        deals: true,
      },
    })
    return NextResponse.json(company)
  } catch (error) {
    console.error('Failed to update company:', error)
    return NextResponse.json({ error: 'Failed to update company' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.company.delete({
      where: { id },
    })
    return NextResponse.json({ message: 'Company deleted' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete company' }, { status: 500 })
  }
}
