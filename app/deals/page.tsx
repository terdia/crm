'use client'

import { useEffect, useState } from 'react'
import { DollarSign, Plus, TrendingUp, Building2, User, Calendar } from 'lucide-react'
import DealDetailModal from '@/components/DealDetailModal'
import CreateDealModal from '@/components/CreateDealModal'

interface Deal {
  id: string
  title: string
  value: number
  stage: string
  probability: number
  expectedCloseDate: string | null
  company: {
    id: string
    name: string
  } | null
  contact: {
    id: string
    firstName: string
    lastName: string
  } | null
  createdAt: string
  description: string | null
}

const STAGES = [
  { id: 'lead', name: 'Lead', color: 'bg-gray-100 text-gray-800' },
  { id: 'qualified', name: 'Qualified', color: 'bg-blue-100 text-blue-800' },
  { id: 'proposal', name: 'Proposal', color: 'bg-purple-100 text-purple-800' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100 text-orange-800' },
  { id: 'closed_won', name: 'Won', color: 'bg-green-100 text-green-800' },
  { id: 'closed_lost', name: 'Lost', color: 'bg-red-100 text-red-800' },
]

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'pipeline' | 'list'>('pipeline')
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [dragOverStage, setDragOverStage] = useState<string | null>(null)

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals')
      const data = await response.json()
      setDeals(data)
    } catch (error) {
      console.error('Failed to fetch deals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('dealId', dealId)
  }

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverStage(stageId)
  }

  const handleDragLeave = () => {
    setDragOverStage(null)
  }

  const handleDrop = async (e: React.DragEvent, newStage: string) => {
    e.preventDefault()
    setDragOverStage(null)
    const dealId = e.dataTransfer.getData('dealId')

    if (!dealId) return

    // Find the deal
    const deal = deals.find(d => d.id === dealId)
    if (!deal || deal.stage === newStage) return

    // Optimistically update UI
    setDeals(deals.map(d =>
      d.id === dealId ? { ...d, stage: newStage } : d
    ))

    // Update on server
    try {
      const response = await fetch(`/api/deals/${dealId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      })

      if (!response.ok) {
        // Revert on error
        fetchDeals()
      }
    } catch (error) {
      console.error('Failed to update deal stage:', error)
      // Revert on error
      fetchDeals()
    }
  }

  useEffect(() => {
    fetchDeals()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const dealsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.id] = deals.filter(deal => deal.stage === stage.id)
    return acc
  }, {} as Record<string, Deal[]>)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'No date'
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600 mt-1">Manage your sales pipeline</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-lg border border-gray-200 p-1 flex">
            <button
              onClick={() => setView('pipeline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'pipeline'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                view === 'list'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Deal
          </button>
        </div>
      </div>

      {view === 'pipeline' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAGES.map((stage) => {
            const stageDeals = dealsByStage[stage.id] || []
            const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)

            return (
              <div
                key={stage.id}
                className={`bg-gray-50 rounded-xl p-4 border-2 min-h-[400px] transition-all ${
                  dragOverStage === stage.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200'
                }`}
                onDragOver={(e) => handleDragOver(e, stage.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, stage.id)}
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{stage.name}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{stageDeals.length} deals</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(stageValue)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onClick={() => setSelectedDeal(deal)}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-move"
                    >
                      <h4 className="font-medium text-gray-900 mb-2">{deal.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-semibold text-green-700">{formatCurrency(deal.value)}</span>
                      </div>
                      {deal.company && (
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <Building2 className="h-3 w-3 mr-1" />
                          {deal.company.name}
                        </div>
                      )}
                      {deal.contact && (
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <User className="h-3 w-3 mr-1" />
                          {deal.contact.firstName} {deal.contact.lastName}
                        </div>
                      )}
                      <div className="flex items-center text-xs text-gray-500 mt-2 pt-2 border-t border-gray-100">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(deal.expectedCloseDate)}
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Probability</span>
                          <span>{deal.probability}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-indigo-600 h-1.5 rounded-full transition-all"
                            style={{ width: `${deal.probability}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    No deals in this stage
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Close Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {deals.map((deal) => {
                  const stage = STAGES.find(s => s.id === deal.stage)

                  return (
                    <tr
                      key={deal.id}
                      onClick={() => setSelectedDeal(deal)}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{deal.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-green-700">
                          {formatCurrency(deal.value)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{deal.company?.name || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {deal.contact
                            ? `${deal.contact.firstName} ${deal.contact.lastName}`
                            : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${stage?.color}`}>
                          {stage?.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(deal.expectedCloseDate)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {deals.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No deals found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new deal.</p>
            </div>
          )}
        </div>
      )}

      <DealDetailModal
        deal={selectedDeal}
        onClose={() => setSelectedDeal(null)}
        onUpdate={() => {
          fetchDeals()
          setSelectedDeal(null)
        }}
      />

      <CreateDealModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchDeals()
          setShowCreateModal(false)
        }}
      />
    </div>
  )
}
