import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Target,
  Bell,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EventModal from './EventModal';

const CalendarManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [viewMode, setViewMode] = useState('month'); // month, week, day
  const [filterType, setFilterType] = useState('all');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadCalendarData();
  }, []);

  const loadCalendarData = () => {
    // Load events from localStorage
    const savedEvents = localStorage.getItem('sentrabase_events');
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Convert date strings back to Date objects
        const eventsWithDates = parsedEvents.map(event => ({
          ...event,
          date: new Date(event.date),
          createdAt: event.createdAt || Date.now()
        }));
        setEvents(eventsWithDates);
      } catch (error) {
        console.error('Error parsing saved events:', error);
        // If parsing fails, initialize with default events
        const defaultEvents = generateDefaultEvents();
        setEvents(defaultEvents);
        localStorage.setItem('sentrabase_events', JSON.stringify(defaultEvents));
      }
    } else {
      // Initialize with default events
      const defaultEvents = generateDefaultEvents();
      setEvents(defaultEvents);
      localStorage.setItem('sentrabase_events', JSON.stringify(defaultEvents));
    }

    // Load tasks with deadlines
    const savedTasks = localStorage.getItem('sentrabase_tasks');
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        setTasks(parsedTasks);
      } catch (error) {
        console.error('Error parsing saved tasks:', error);
        setTasks([]);
      }
    }

    // Load team members
    const savedTeam = localStorage.getItem('sentrabase_team');
    if (savedTeam) {
      try {
        const parsedTeam = JSON.parse(savedTeam);
        setTeamMembers(parsedTeam);
      } catch (error) {
        console.error('Error parsing saved team:', error);
        setTeamMembers([]);
      }
    }
  };

  const generateDefaultEvents = () => {
    const now = new Date();
    const events = [
      {
        id: 'event_1',
        title: 'Team Weekly Standup',
        description: 'Weekly team sync and progress review',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
        time: '09:00',
        duration: 60, // minutes
        type: 'meeting',
        priority: 'medium',
        attendees: ['admin_1', 'sales_1', 'support_1'],
        location: 'Conference Room / Zoom',
        recurring: 'weekly',
        reminders: [15, 60], // minutes before
        status: 'scheduled',
        createdBy: 'admin_1',
        createdAt: Date.now()
      },
      {
        id: 'event_2',
        title: 'Customer Demo - RS Besar Jakarta',
        description: 'Product demonstration for enterprise customer',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
        time: '14:00',
        duration: 90,
        type: 'demo',
        priority: 'high',
        attendees: ['sales_1', 'support_1'],
        location: 'Customer Site',
        recurring: 'none',
        reminders: [30, 120],
        status: 'scheduled',
        createdBy: 'sales_1',
        createdAt: Date.now() - 86400000
      },
      {
        id: 'event_3',
        title: 'Monthly Business Review',
        description: 'Review monthly performance and plan next month',
        date: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        time: '10:00',
        duration: 120,
        type: 'review',
        priority: 'high',
        attendees: ['admin_1', 'sales_1'],
        location: 'Main Office',
        recurring: 'monthly',
        reminders: [60, 1440], // 1 hour and 1 day before
        status: 'scheduled',
        createdBy: 'admin_1',
        createdAt: Date.now() - 172800000
      },
      {
        id: 'event_4',
        title: 'Product Training Session',
        description: 'Training for new team members on SentraBASE features',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
        time: '13:00',
        duration: 180,
        type: 'training',
        priority: 'medium',
        attendees: ['admin_1', 'sales_2', 'support_1'],
        location: 'Training Room',
        recurring: 'none',
        reminders: [30],
        status: 'scheduled',
        createdBy: 'admin_1',
        createdAt: Date.now() - 259200000
      },
      {
        id: 'event_5',
        title: 'Customer Follow-up Deadline',
        description: 'Deadline for following up with potential customers',
        date: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3),
        time: '17:00',
        duration: 0,
        type: 'deadline',
        priority: 'high',
        attendees: ['sales_1', 'sales_2'],
        location: 'N/A',
        recurring: 'none',
        reminders: [60, 240],
        status: 'scheduled',
        createdBy: 'sales_1',
        createdAt: Date.now() - 345600000
      }
    ];
    
    return events;
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toDateString();
    
    // Filter events for the selected date
    const dayEvents = events.filter(event => {
      try {
        // Ensure event.date is a Date object
        const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
        return eventDate.toDateString() === dateStr;
      } catch (error) {
        console.warn('Invalid event date:', event);
        return false;
      }
    });
    
    // Add tasks with deadlines
    const dayTasks = tasks.filter(task => {
      if (task.dueDate) {
        try {
          const taskDate = new Date(task.dueDate);
          return taskDate.toDateString() === dateStr;
        } catch (error) {
          console.warn('Invalid task due date:', task);
          return false;
        }
      }
      return false;
    });
    
    // Convert tasks to event format
    const taskEvents = dayTasks.map(task => ({
      id: `task_${task.id}`,
      title: task.title,
      description: task.description,
      date: new Date(task.dueDate),
      time: '23:59',
      type: 'task',
      priority: task.priority,
      status: task.status,
      isTask: true
    }));
    
    return [...dayEvents, ...taskEvents];
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'demo': return 'bg-green-500';
      case 'review': return 'bg-purple-500';
      case 'training': return 'bg-yellow-500';
      case 'deadline': return 'bg-red-500';
      case 'task': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-red-500 text-red-400';
      case 'medium': return 'border-yellow-500 text-yellow-400';
      case 'low': return 'border-green-500 text-green-400';
      default: return 'border-gray-500 text-gray-400';
    }
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const formatTime = (time) => {
    return time || '00:00';
  };

  const getMemberName = (memberId) => {
    const member = teamMembers.find(m => m.id === memberId);
    return member ? member.name : memberId;
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 bg-slate-800/50 border border-slate-700"></div>
      );
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const hasEvents = dayEvents.length > 0;
      const hasHighPriority = dayEvents.some(e => e.priority === 'high');
      
      days.push(
        <div
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-24 p-2 border border-slate-700 cursor-pointer transition-colors hover:bg-slate-700/50 ${
            isToday(date) ? 'bg-blue-500/20 border-blue-500' : 'bg-slate-800'
          } ${isSelected(date) ? 'ring-2 ring-cyan-500' : ''}`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium ${
              isToday(date) ? 'text-blue-400' : 'text-white'
            }`}>
              {day}
            </span>
            {hasHighPriority && (
              <AlertTriangle className="w-3 h-3 text-red-400" />
            )}
          </div>
          
          {hasEvents && (
            <div className="space-y-1">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div
                  key={index}
                  className={`text-xs px-1 py-0.5 rounded truncate ${getEventTypeColor(event.type)} text-white`}
                >
                  {event.title}
                </div>
              ))}
              {dayEvents.length > 2 && (
                <div className="text-xs text-gray-400">
                  +{dayEvents.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }
    
    return days;
  };

  const renderSelectedDateEvents = () => {
    try {
      const dayEvents = getEventsForDate(selectedDate);
      
      if (dayEvents.length === 0) {
        return (
          <div className="text-center py-8">
            <CalendarIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400">No events scheduled for this date</p>
            <Button
              onClick={() => {
                setSelectedEvent(null);
                setShowEventModal(true);
              }}
              className="mt-4 bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        );
      }
      
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">
              Events for {selectedDate.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <Button
              onClick={() => {
                setSelectedEvent(null);
                setShowEventModal(true);
              }}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
          
          {dayEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getEventTypeColor(event.type)}`} />
                  <div>
                    <h4 className="font-medium text-white">{event.title}</h4>
                    <p className="text-sm text-gray-400">{event.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(event.priority)}`}>
                    {event.priority}
                  </span>
                  {!event.isTask && (
                    <>
                      <Button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowEventModal(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="border-blue-400 text-blue-400"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        onClick={() => setSelectedEvent(event)}
                        size="sm"
                        variant="outline"
                        className="border-cyan-400 text-cyan-400"
                      >
                        <Eye className="w-3 h-3" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(event.time)}</span>
                  {event.duration > 0 && (
                    <span>({event.duration} min)</span>
                  )}
                </div>
                
                {event.attendees && event.attendees.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{event.attendees.length} attendees</span>
                  </div>
                )}
                
                {event.location && (
                  <div className="col-span-2 flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
              
              {event.attendees && event.attendees.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-600">
                  <p className="text-xs text-gray-400 mb-2">Attendees:</p>
                  <div className="flex flex-wrap gap-2">
                    {event.attendees.map((attendeeId) => (
                      <span
                        key={attendeeId}
                        className="px-2 py-1 bg-slate-600 text-xs text-gray-300 rounded"
                      >
                        {getMemberName(attendeeId)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      );
    } catch (error) {
      console.error('Error rendering selected date events:', error);
      return (
        <div className="text-center py-8">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-400">Error loading events for this date</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-500 hover:bg-red-600"
          >
            Reload Page
          </Button>
        </div>
      );
    }
  };

  const getUpcomingEvents = () => {
    const now = new Date();
    
    try {
      const upcoming = events
        .filter(event => {
          try {
            const eventDate = event.date instanceof Date ? event.date : new Date(event.date);
            return eventDate >= now;
          } catch (error) {
            console.warn('Invalid event date in upcoming:', event);
            return false;
          }
        })
        .sort((a, b) => {
          try {
            const dateA = a.date instanceof Date ? a.date : new Date(a.date);
            const dateB = b.date instanceof Date ? b.date : new Date(b.date);
            return dateA - dateB;
          } catch (error) {
            console.warn('Error sorting events:', error);
            return 0;
          }
        })
        .slice(0, 5);
      
      return upcoming;
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      return [];
    }
  };

  const getEventStats = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    try {
      return {
        today: events.filter(e => {
          try {
            const eventDate = e.date instanceof Date ? e.date : new Date(e.date);
            return eventDate.toDateString() === today.toDateString();
          } catch (error) {
            return false;
          }
        }).length,
        
        thisWeek: events.filter(e => {
          try {
            const eventDate = e.date instanceof Date ? e.date : new Date(e.date);
            return eventDate >= today && eventDate <= thisWeek;
          } catch (error) {
            return false;
          }
        }).length,
        
        thisMonth: events.filter(e => {
          try {
            const eventDate = e.date instanceof Date ? e.date : new Date(e.date);
            return eventDate.getMonth() === now.getMonth() && 
                   eventDate.getFullYear() === now.getFullYear();
          } catch (error) {
            return false;
          }
        }).length,
        
        total: events.length
      };
    } catch (error) {
      console.error('Error calculating event stats:', error);
      return { today: 0, thisWeek: 0, thisMonth: 0, total: 0 };
    }
  };

  const saveEvent = (eventData) => {
    try {
      // Ensure date is a Date object
      const processedEventData = {
        ...eventData,
        date: eventData.date instanceof Date ? eventData.date : new Date(eventData.date),
        createdAt: eventData.createdAt || Date.now(),
        updatedAt: Date.now()
      };
      
      let updatedEvents;
      
      if (selectedEvent && selectedEvent.id === eventData.id) {
        // Update existing event
        updatedEvents = events.map(event => 
          event.id === eventData.id ? processedEventData : event
        );
      } else {
        // Add new event
        updatedEvents = [...events, processedEventData];
      }
      
      setEvents(updatedEvents);
      localStorage.setItem('sentrabase_events', JSON.stringify(updatedEvents));
      setSelectedEvent(null);
      
      console.log('✅ Event saved successfully:', processedEventData.title);
    } catch (error) {
      console.error('❌ Error saving event:', error);
      alert('Error saving event. Please try again.');
    }
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('sentrabase_events', JSON.stringify(updatedEvents));
  };

  const stats = getEventStats();
  const upcomingEvents = getUpcomingEvents();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Calendar Management</h2>
          <p className="text-gray-400">Manage deadlines, meetings, and important dates</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => console.log('Export calendar')}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            onClick={() => {
              setSelectedEvent(null);
              setShowEventModal(true);
            }}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Event
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Today</p>
              <p className="text-2xl font-bold text-white">{stats.today}</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">This Week</p>
              <p className="text-2xl font-bold text-green-400">{stats.thisWeek}</p>
            </div>
            <Clock className="w-8 h-8 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-purple-400">{stats.thisMonth}</p>
            </div>
            <Target className="w-8 h-8 text-purple-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800 rounded-lg p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Total Events</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <Bell className="w-8 h-8 text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Main Calendar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-lg overflow-hidden"
          >
            {/* Calendar Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">
                  {currentDate.toLocaleDateString('id-ID', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h3>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => navigateMonth(-1)}
                    size="sm"
                    variant="outline"
                    className="border-slate-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => setCurrentDate(new Date())}
                    size="sm"
                    variant="outline"
                    className="border-slate-600"
                  >
                    Today
                  </Button>
                  <Button
                    onClick={() => navigateMonth(1)}
                    size="sm"
                    variant="outline"
                    className="border-slate-600"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="h-8 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-400">{day}</span>
                  </div>
                ))}
              </div>
              
              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarGrid()}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            {renderSelectedDateEvents()}
          </motion.div>

          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-slate-800 rounded-lg p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Upcoming Events</h3>
            
            {upcomingEvents.length === 0 ? (
              <p className="text-gray-400 text-sm">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{event.title}</p>
                      <p className="text-xs text-gray-400">
                        {event.date.toLocaleDateString('id-ID')} at {formatTime(event.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSave={saveEvent}
        onDelete={deleteEvent}
        teamMembers={teamMembers}
      />
    </div>
  );
};

export default CalendarManagement;
