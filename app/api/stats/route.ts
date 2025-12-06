import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalContacts,
      totalCompanies,
      totalDeals,
      activeDeals,
      wonDeals,
      lostDeals,
      totalRevenue,
      pipelineValue,
    ] = await Promise.all([
      prisma.contact.count(),
      prisma.company.count(),
      prisma.deal.count(),
      prisma.deal.count({
        where: {
          stage: {
            notIn: ['closed_won', 'closed_lost'],
          },
        },
      }),
      prisma.deal.count({
        where: { stage: 'closed_won' },
      }),
      prisma.deal.count({
        where: { stage: 'closed_lost' },
      }),
      prisma.deal.aggregate({
        where: { stage: 'closed_won' },
        _sum: { value: true },
      }),
      prisma.deal.aggregate({
        where: {
          stage: {
            notIn: ['closed_won', 'closed_lost'],
          },
        },
        _sum: { value: true },
      }),
    ])

    const dealsByStage = await prisma.deal.groupBy({
      by: ['stage'],
      _count: true,
      _sum: {
        value: true,
      },
    })

    return NextResponse.json({
      totalContacts,
      totalCompanies,
      totalDeals,
      activeDeals,
      wonDeals,
      lostDeals,
      totalRevenue: totalRevenue._sum.value || 0,
      pipelineValue: pipelineValue._sum.value || 0,
      dealsByStage,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
