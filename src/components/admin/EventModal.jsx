import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Bell, 
  Repeat,
  AlertTriangle,
  Save,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const EventModal = ({ isOpen, onClose, event, onSave, onDelete, teamMembers }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    duration: 60,
    type: 'meeting',
    priority: 'medium',
    location: '',
    attendees: [],
    recurring: 'none',
    reminders: [15]
  });

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date ? event.date.toISOString().split('T')[0] : '',
        time: event.time || '',
        duration: event.duration || 60,
        type: event.type || 'meeting',
        priority: event.priority || 'medium',
        location: event.location || '',
        attendees: event.attendees || [],
        recurring: event.recurring || 'none',
        reminders: event.reminders || [15]
      });
    } else {
      // Reset form for new event
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: '09:00',
        duration: 60,
        type: 'meeting',
        priority: 'medium',
        location: '',
        attendees: [],
        recurring: 'none',
        reminders: [15]
      });
    }
  }, [event, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      id: event?.id || `event_${Date.now()}`,
      date: new Date(formData.date),
      createdAt: event?.createdAt || Date.now(),
      updatedAt: Date.now(),
      status: 'scheduled'
    };
    
    onSave(eventData);
    onClose();
  };

  const handleAttendeeToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.includes(memberId)
        ? prev.attendees.filter(id => id !== memberId)
        : [...prev.attendees, memberId]
    }));
  };

  const handleReminderChange = (index, value) => {
    const newReminders = [...formData.reminders];
    newReminders[index] = parseInt(value);
    setFormData(prev => ({ ...prev, reminders: newReminders }));
  };

  const addReminder = () => {
    setFormData(prev => ({
      ...prev,
      reminders: [...prev.reminders, 15]
    }));
  };

  const removeReminder = (index) => {
    setFormData(prev => ({
      ...prev,
      reminders: prev.reminders.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-slate-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Title *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter event title"
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter event description"
                rows={3}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 resize-none"
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date *
              </label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Time
              </label>
              <Input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                min="0"
                step="15"
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Event Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="meeting">Meeting</option>
                <option value="demo">Demo</option>
                <option value="review">Review</option>
                <option value="training">Training</option>
                <option value="deadline">Deadline</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Location
            </label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Enter location or meeting link"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          {/* Attendees */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Users className="w-4 h-4 inline mr-1" />
              Attendees
            </label>
            <div className="grid grid-cols-2 gap-2">
              {teamMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center space-x-2 p-2 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600"
                >
                  <input
                    type="checkbox"
                    checked={formData.attendees.includes(member.id)}
                    onChange={() => handleAttendeeToggle(member.id)}
                    className="rounded border-slate-500"
                  />
                  <span className="text-sm text-white">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Recurring */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Repeat className="w-4 h-4 inline mr-1" />
              Recurring
            </label>
            <select
              value={formData.recurring}
              onChange={(e) => setFormData(prev => ({ ...prev, recurring: e.target.value }))}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2"
            >
              <option value="none">No Repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {/* Reminders */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Bell className="w-4 h-4 inline mr-1" />
              Reminders (minutes before)
            </label>
            <div className="space-y-2">
              {formData.reminders.map((reminder, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={reminder}
                    onChange={(e) => handleReminderChange(index, e.target.value)}
                    min="0"
                    className="bg-slate-700 border-slate-600 text-white flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => removeReminder(index)}
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-400"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                onClick={addReminder}
                size="sm"
                variant="outline"
                className="border-blue-500 text-blue-400"
              >
                Add Reminder
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700">
            <div>
              {event && onDelete && (
                <Button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this event?')) {
                      onDelete(event.id);
                      onClose();
                    }
                  }}
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Event
                </Button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-gray-500 text-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
              >
                <Save className="w-4 h-4 mr-2" />
                {event ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventModal;
