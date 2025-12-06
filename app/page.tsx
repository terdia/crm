'use client'

import { useEffect, useState } from 'react'
import { Users, Building2, DollarSign, TrendingUp, Calendar, CheckCircle } from 'lucide-react'
import StatCard from '@/components/StatCard'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface Stats {
  totalContacts: number
  totalCompanies: number
  totalDeals: number
  activeDeals: number
  wonDeals: number
  lostDeals: number
  totalRevenue: number
  pipelineValue: number
  dealsByStage: Array<{
    stage: string
    _count: number
    _sum: { value: number | null }
  }>
}

interface Activity {
  id: string
  type: string
  subject: string
  dueDate: string | null
  completed: boolean
  contact: {
    firstName: string
    lastName: string
  } | null
}

const STAGE_COLORS: { [key: string]: string } = {
  lead: '#94a3b8',
  qualified: '#3b82f6',
  proposal: '#8b5cf6',
  negotiation: '#f59e0b',
  closed_won: '#10b981',
  closed_lost: '#ef4444',
}

const STAGE_LABELS: { [key: string]: string } = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  closed_won: 'Won',
  closed_lost: 'Lost',
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, activitiesRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/activities'),
        ])

        const statsData = await statsRes.json()
        const activitiesData = await activitiesRes.json()

        setStats(statsData)
        setActivities(activitiesData.slice(0, 6))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const pipelineData = stats.dealsByStage
    .filter(d => !['closed_won', 'closed_lost'].includes(d.stage))
    .map(d => ({
      name: STAGE_LABELS[d.stage] || d.stage,
      value: d._sum.value || 0,
      count: d._count,
    }))

  const dealStatusData = stats.dealsByStage.map(d => ({
    name: STAGE_LABELS[d.stage] || d.stage,
    value: d._count,
  }))

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your business overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Contacts"
          value={stats.totalContacts}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Companies"
          value={stats.totalCompanies}
          icon={Building2}
          color="purple"
        />
        <StatCard
          title="Active Deals"
          value={stats.activeDeals}
          icon={TrendingUp}
          color="orange"
        />
        <StatCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Value by Stage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pipelineData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Deals by Stage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dealStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {dealStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STAGE_COLORS[stats.dealsByStage[index].stage] || '#6b7280'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            Upcoming Activities
          </h2>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p className="text-gray-500 text-sm">No upcoming activities</p>
            ) : (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`mt-1 ${activity.completed ? 'text-green-500' : 'text-gray-400'}`}>
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.subject}</p>
                    <p className="text-xs text-gray-500">
                      {activity.contact
                        ? `${activity.contact.firstName} ${activity.contact.lastName}`
                        : 'No contact'}
                      {activity.dueDate && ` • ${new Date(activity.dueDate).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                    {activity.type}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-green-800 font-medium">Deals Won</p>
                <p className="text-2xl font-bold text-green-900">{stats.wonDeals}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm text-orange-800 font-medium">Pipeline Value</p>
                <p className="text-2xl font-bold text-orange-900">
                  ${(stats.pipelineValue / 1000).toFixed(0)}K
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-blue-800 font-medium">Win Rate</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.totalDeals > 0
                    ? ((stats.wonDeals / stats.totalDeals) * 100).toFixed(1)
                    : 0}%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
