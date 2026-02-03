import { useState } from 'react';
import { Plus, Trash2, Calendar, CheckCircle2, Circle, GripVertical } from 'lucide-react';
import type { TimelineEvent } from '@/types';

interface TimelineEditorProps {
  events: TimelineEvent[];
  onChange: (events: TimelineEvent[]) => void;
}

export function TimelineEditor({ events, onChange }: TimelineEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const addEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      milestone: false,
    };
    onChange([...events, newEvent]);
  };

  const updateEvent = (id: string, field: keyof TimelineEvent, value: string | boolean) => {
    onChange(
      events.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeEvent = (id: string) => {
    onChange(events.filter((e) => e.id !== id));
  };

  const toggleMilestone = (id: string) => {
    const event = events.find((e) => e.id === id);
    if (event) {
      updateEvent(id, 'milestone', !event.milestone);
    }
  };

  // Sort events by date
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newEvents = [...events];
    const draggedEvent = newEvents[draggedIndex];
    newEvents.splice(draggedIndex, 1);
    newEvents.splice(index, 0, draggedEvent);

    onChange(newEvents);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      {/* Add button */}
      <button
        type="button"
        onClick={addEvent}
        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white text-sm transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Timeline Event
      </button>

      {/* Events list */}
      {sortedEvents.length > 0 ? (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-4 bottom-4 w-px bg-white/10" />

          <div className="space-y-3">
            {sortedEvents.map((event, index) => (
              <div
                key={event.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative pl-12 ${draggedIndex === index ? 'opacity-50' : ''}`}
              >
                {/* Timeline dot */}
                <div className="absolute left-0 top-3">
                  <button
                    type="button"
                    onClick={() => toggleMilestone(event.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                      event.milestone
                        ? 'bg-amber-500 text-black'
                        : 'bg-white/10 text-white/40 hover:text-white/60'
                    }`}
                    title={event.milestone ? 'Milestone' : 'Regular event'}
                  >
                    {event.milestone ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Event card */}
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/40 text-xs mb-1">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            Date
                          </label>
                          <input
                            type="date"
                            value={event.date}
                            onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                          />
                        </div>
                        <div className="flex items-end justify-end">
                          <span className="text-white/30 text-xs">
                            {event.milestone ? 'Milestone event' : 'Regular event'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-white/40 text-xs mb-1">Event Title</label>
                        <input
                          type="text"
                          value={event.title}
                          onChange={(e) => updateEvent(event.id, 'title', e.target.value)}
                          placeholder="e.g., RTL Design Complete"
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                        />
                      </div>

                      <div>
                        <label className="block text-white/40 text-xs mb-1">Description</label>
                        <textarea
                          value={event.description}
                          onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
                          placeholder="Brief description of what was accomplished..."
                          rows={2}
                          className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-1">
                      <div className="p-1.5 rounded-lg cursor-grab active:cursor-grabbing text-white/20 hover:text-white/40">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeEvent(event.id)}
                        className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-white/30 text-sm">
          No timeline events yet. Add milestones to track project progress.
        </div>
      )}

      <p className="text-white/30 text-xs">
        Drag events to reorder. Mark important milestones with the star icon.
      </p>
    </div>
  );
}
