'use client'

import { useEffect, useState } from 'react'
import { Building2, Plus, Globe, Phone, Users, DollarSign } from 'lucide-react'
import CompanyDetailModal from '@/components/CompanyDetailModal'
import CreateCompanyModal from '@/components/CreateCompanyModal'

interface Company {
  id: string
  name: string
  industry: string | null
  website: string | null
  phone: string | null
  employees: number | null
  revenue: number | null
  createdAt: string
  contacts: Array<{ id: string }>
  deals: Array<{ id: string; value: number }>
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies')
      const data = await response.json()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Companies</h1>
          <p className="text-gray-600 mt-1">Manage your business accounts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Company
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => {
          const totalDealsValue = company.deals.reduce((sum, deal) => sum + deal.value, 0)

          return (
            <div
              key={company.id}
              onClick={() => setSelectedCompany(company)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-3 rounded-lg">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 text-lg">{company.name}</h3>
                    {company.industry && (
                      <p className="text-sm text-gray-500">{company.industry}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {company.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2 text-gray-400" />
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-indigo-600 truncate"
                    >
                      {company.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {company.phone}
                  </div>
                )}
                {company.employees && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2 text-gray-400" />
                    {company.employees.toLocaleString()} employees
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Contacts</p>
                    <p className="text-lg font-semibold text-gray-900">{company.contacts.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Deal Value</p>
                    <p className="text-lg font-semibold text-green-700">
                      {formatCurrency(totalDealsValue)}
                    </p>
                  </div>
                </div>
              </div>

              {company.revenue && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Annual Revenue</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(company.revenue)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {companies.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new company.</p>
        </div>
      )}

      <CompanyDetailModal
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onUpdate={() => {
          fetchCompanies()
          setSelectedCompany(null)
        }}
      />

      <CreateCompanyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchCompanies()
          setShowCreateModal(false)
        }}
      />
    </div>
  )
}
