'use client'

import { useEffect, useState } from 'react'
import { Calendar, Plus, CheckCircle, Circle, Phone, Mail, Users as UsersIcon, FileText, Clock } from 'lucide-react'
import ActivityDetailModal from '@/components/ActivityDetailModal'
import CreateActivityModal from '@/components/CreateActivityModal'

interface Activity {
  id: string
  type: string
  subject: string
  description: string | null
  dueDate: string | null
  completed: boolean
  contact: {
    id: string
    firstName: string
    lastName: string
  } | null
  deal: {
    id: string
    title: string
  } | null
  createdAt: string
}

const ACTIVITY_TYPES = {
  call: { icon: Phone, color: 'bg-blue-100 text-blue-800', iconColor: 'text-blue-600' },
  email: { icon: Mail, color: 'bg-purple-100 text-purple-800', iconColor: 'text-purple-600' },
  meeting: { icon: UsersIcon, color: 'bg-green-100 text-green-800', iconColor: 'text-green-600' },
  task: { icon: CheckCircle, color: 'bg-orange-100 text-orange-800', iconColor: 'text-orange-600' },
  note: { icon: FileText, color: 'bg-gray-100 text-gray-800', iconColor: 'text-gray-600' },
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all')
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/activities')
      const data = await response.json()
      setActivities(data)
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const filteredActivities = activities.filter(activity => {
    if (filter === 'completed') return activity.completed
    if (filter === 'upcoming') return !activity.completed && activity.dueDate
    return true
  })

  const formatDate = (date: string | null) => {
    if (!date) return 'No date'
    const activityDate = new Date(date)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (activityDate.toDateString() === today.toDateString()) {
      return `Today at ${activityDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    } else if (activityDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${activityDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
    }
    return activityDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const isOverdue = (date: string | null, completed: boolean) => {
    if (!date || completed) return false
    return new Date(date) < new Date()
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activities</h1>
          <p className="text-gray-600 mt-1">Track your tasks and interactions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Activity
        </button>
      </div>

      <div className="mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-1 inline-flex">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Activities
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="divide-y divide-gray-100">
          {filteredActivities.map((activity) => {
            const activityType = ACTIVITY_TYPES[activity.type as keyof typeof ACTIVITY_TYPES] || ACTIVITY_TYPES.note
            const Icon = activityType.icon
            const overdue = isOverdue(activity.dueDate, activity.completed)

            return (
              <div
                key={activity.id}
                onClick={() => setSelectedActivity(activity)}
                className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${activityType.color.split(' ')[0]}`}>
                    <Icon className={`h-5 w-5 ${activityType.iconColor}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{activity.subject}</h3>
                        {activity.description && (
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        )}
                      </div>
                      {activity.completed ? (
                        <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="h-6 w-6 text-gray-300 flex-shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${activityType.color}`}>
                        {activity.type}
                      </span>

                      {activity.contact && (
                        <span className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-1" />
                          {activity.contact.firstName} {activity.contact.lastName}
                        </span>
                      )}

                      {activity.deal && (
                        <span className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" />
                          {activity.deal.title}
                        </span>
                      )}

                      {activity.dueDate && (
                        <span className={`flex items-center ${overdue ? 'text-red-600 font-medium' : ''}`}>
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(activity.dueDate)}
                          {overdue && ' (Overdue)'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'completed'
                ? 'No completed activities yet.'
                : filter === 'upcoming'
                ? 'No upcoming activities scheduled.'
                : 'Get started by creating a new activity.'}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredActivities.length} of {activities.length} activities
      </div>

      <ActivityDetailModal
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
        onUpdate={() => {
          fetchActivities()
          setSelectedActivity(null)
        }}
      />

      <CreateActivityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchActivities()
          setShowCreateModal(false)
        }}
      />
    </div>
  )
}
