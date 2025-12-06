'use client'

import { useState } from 'react'
import { X, Calendar, Phone, Mail, Users as UsersIcon, FileText, CheckCircle, Circle, Edit2, Trash2, Clock } from 'lucide-react'

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

interface ActivityDetailModalProps {
  activity: Activity | null
  onClose: () => void
  onUpdate: () => void
}

const ACTIVITY_TYPES = [
  { id: 'call', name: 'Call' },
  { id: 'email', name: 'Email' },
  { id: 'meeting', name: 'Meeting' },
  { id: 'task', name: 'Task' },
  { id: 'note', name: 'Note' },
]

const ACTIVITY_TYPE_ICONS = {
  call: Phone,
  email: Mail,
  meeting: UsersIcon,
  task: CheckCircle,
  note: FileText,
}

export default function ActivityDetailModal({ activity, onClose, onUpdate }: ActivityDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    type: activity?.type || 'task',
    subject: activity?.subject || '',
    description: activity?.description || '',
    dueDate: activity?.dueDate || '',
    completed: activity?.completed || false,
  })

  if (!activity) return null

  const handleEdit = () => {
    setIsEditing(true)
    setFormData({
      type: activity.type,
      subject: activity.subject,
      description: activity.description || '',
      dueDate: activity.dueDate || '',
      completed: activity.completed,
    })
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/activities/${activity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dueDate: formData.dueDate || null,
        }),
      })

      if (response.ok) {
        onUpdate()
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Failed to update activity:', error)
    }
  }

  const handleToggleComplete = async () => {
    try {
      const response = await fetch(`/api/activities/${activity.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !activity.completed,
        }),
      })

      if (response.ok) {
        onUpdate()
      }
    } catch (error) {
      console.error('Failed to update activity:', error)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this activity?')) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/activities/${activity.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onUpdate()
        onClose()
      }
    } catch (error) {
      console.error('Failed to delete activity:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'No date set'
    return new Date(date).toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const Icon = ACTIVITY_TYPE_ICONS[activity.type as keyof typeof ACTIVITY_TYPE_ICONS] || FileText

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-lg mr-4">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{activity.subject}</h2>
                <p className="text-indigo-100 mt-1 capitalize">{activity.type}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                >
                  {ACTIVITY_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                  placeholder="Activity details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.completed}
                  onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Mark as completed
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {activity.completed ? (
                    <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  ) : (
                    <Circle className="h-6 w-6 text-gray-300 mr-3" />
                  )}
                  <span className="text-sm font-medium text-gray-900">
                    {activity.completed ? 'Completed' : 'Not completed'}
                  </span>
                </div>
                <button
                  onClick={handleToggleComplete}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  {activity.completed ? 'Mark as incomplete' : 'Mark as complete'}
                </button>
              </div>

              {activity.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                    {activity.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activity.dueDate && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-500">Due Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(activity.dueDate)}
                      </p>
                    </div>
                  </div>
                )}

                {activity.contact && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <UsersIcon className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="text-sm font-medium text-gray-900">
                        {activity.contact.firstName} {activity.contact.lastName}
                      </p>
                    </div>
                  </div>
                )}

                {activity.deal && (
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-xs text-gray-500">Related Deal</p>
                      <p className="text-sm font-medium text-gray-900">{activity.deal.title}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(activity.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleEdit}
                  className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Activity
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex-1 border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
