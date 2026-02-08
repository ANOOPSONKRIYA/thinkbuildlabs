import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Circle,
  X,
  Play
} from 'lucide-react';
import type { Project, TimelineEvent, Video } from '@/types';
import { mockDataService } from '@/lib/dataService';

const CATEGORIES = [
  { value: 'vlsi', label: 'VLSI Design' },
  { value: 'ai-robotics', label: 'AI & Robotics' },
  { value: 'research', label: 'Research' },
];

const STATUSES = [
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
];

export function PortfolioEditLegacy() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = slug === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'media' | 'timeline' | 'team'>('basic');
  
  // Form state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: 'vlsi',
    thumbnail: '',
    images: [],
    videos: [],
    techStack: [],
    timeline: [],
    teamMembers: [],
    isFeatured: false,
    status: 'ongoing',
    startDate: '',
    endDate: '',
    githubUrl: '',
    demoUrl: '',
    documentationUrl: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newVideo, setNewVideo] = useState<Partial<Video>>({ title: '', url: '', description: '', type: 'youtube' });

  useEffect(() => {
    if (!isNew && slug) {
      const fetchProject = async () => {
        const project = await mockDataService.getProjectBySlug(slug);
        if (project) {
          setFormData({ ...project, isFeatured: project.isFeatured ?? false });
        }
        setLoading(false);
      };
      fetchProject();
    }
  }, [slug, isNew]);

  const handleSave = async () => {
    setSaving(true);
    
    const dataToSave = {
      ...formData,
      isFeatured: formData.isFeatured ?? false,
      slug: formData.slug || formData.title?.toLowerCase().replace(/\s+/g, '-'),
    } as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

    if (isNew) {
      await mockDataService.createProject(dataToSave);
    } else if (formData.id) {
      await mockDataService.updateProject(formData.id, dataToSave);
    }
    
    setSaving(false);
    navigate('/admin/projects');
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.techStack?.includes(newSkill.trim())) {
      setFormData({ ...formData, techStack: [...(formData.techStack || []), newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, techStack: formData.techStack?.filter(s => s !== skill) || [] });
  };

  const addImage = () => {
    if (newImage.trim() && !formData.images?.includes(newImage.trim())) {
      setFormData({ ...formData, images: [...(formData.images || []), newImage.trim()] });
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    setFormData({ ...formData, images: formData.images?.filter(i => i !== image) || [] });
  };

  const addVideo = () => {
    if (newVideo.title?.trim() && newVideo.url?.trim()) {
      const video: Video = {
        id: Date.now().toString(),
        title: newVideo.title.trim(),
        url: newVideo.url.trim(),
        description: newVideo.description?.trim(),
        type: newVideo.type as Video['type'] || 'youtube',
      };
      setFormData({ ...formData, videos: [...(formData.videos || []), video] });
      setNewVideo({ title: '', url: '', description: '', type: 'youtube' });
    }
  };

  const removeVideo = (id: string) => {
    setFormData({ ...formData, videos: formData.videos?.filter(v => v.id !== id) || [] });
  };

  const addTimelineEvent = () => {
    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      milestone: false,
    };
    setFormData({ ...formData, timeline: [...(formData.timeline || []), newEvent] });
  };

  const updateTimelineEvent = (id: string, field: keyof TimelineEvent, value: string | boolean) => {
    setFormData({
      ...formData,
      timeline: formData.timeline?.map(t => t.id === id ? { ...t, [field]: value } : t) || []
    });
  };

  const removeTimelineEvent = (id: string) => {
    setFormData({ ...formData, timeline: formData.timeline?.filter(t => t.id !== id) || [] });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <header className="sticky top-0 z-30 glass-strong border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/projects" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-lg font-semibold text-white">
              {isNew ? 'Add Project' : 'Edit Project'}
            </h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-white/10">
        <div className="flex gap-2 overflow-x-auto">
          {(['basic', 'media', 'timeline', 'team'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-white/10 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:px-6 lg:px-8 py-6 max-w-4xl">
        {activeTab === 'basic' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Basic Info */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-white/40 text-sm mb-2">Project Title *</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="neurochip-accelerator"
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Project['category'] })}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as Project['status'] })}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    >
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-white/40 text-sm mb-2">Short Description *</label>
                <textarea
                  value={formData.shortDescription || ''}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  rows={2}
                  placeholder="Brief description for cards and previews"
                  className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                />
              </div>
              <div>
                <label className="block text-white/40 text-sm mb-2">Full Description *</label>
                <textarea
                  value={formData.fullDescription || ''}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  rows={6}
                  placeholder="Detailed project description"
                  className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Project Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-sm mb-2">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                {formData.status === 'completed' && (
                  <div>
                    <label className="block text-white/40 text-sm mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Tech Stack</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add technology (e.g., React, Python)..."
                  className="flex-1 px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.techStack?.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 text-white text-sm"
                  >
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">External Links</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-white/40 text-sm mb-2">GitHub Repository</label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Live Demo</label>
                  <input
                    type="url"
                    value={formData.demoUrl || ''}
                    onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Documentation</label>
                  <input
                    type="url"
                    value={formData.documentationUrl || ''}
                    onChange={(e) => setFormData({ ...formData, documentationUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'media' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Thumbnail */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Thumbnail</h3>
              <div>
                <label className="block text-white/40 text-sm mb-2">Thumbnail URL *</label>
                <input
                  type="text"
                  value={formData.thumbnail || ''}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                />
                {formData.thumbnail && (
                  <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full max-w-xs h-40 object-cover rounded-lg mt-3" />
                )}
              </div>
            </div>

            {/* Images Gallery */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Project Images</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                  placeholder="Image URL..."
                  className="flex-1 px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                />
                <button
                  onClick={addImage}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formData.images?.map((image, index) => (
                  <div key={index} className="relative group">
                    <img src={image} alt={`Project image ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(image)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Videos */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-sm mb-2">Video Title</label>
                  <input
                    type="text"
                    value={newVideo.title || ''}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Video Type</label>
                  <select
                    value={newVideo.type}
                    onChange={(e) => setNewVideo({ ...newVideo, type: e.target.value as Video['type'] })}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  >
                    <option value="youtube">YouTube</option>
                    <option value="vimeo">Vimeo</option>
                    <option value="direct">Direct URL</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/40 text-sm mb-2">Embed URL</label>
                  <input
                    type="url"
                    value={newVideo.url || ''}
                    onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                    placeholder="https://www.youtube.com/embed/..."
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-white/40 text-sm mb-2">Description (Optional)</label>
                  <input
                    type="text"
                    value={newVideo.description || ''}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>
              <button
                onClick={addVideo}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Video
              </button>
              <div className="space-y-2">
                {formData.videos?.map((video) => (
                  <div key={video.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <Play className="w-4 h-4 text-white/60" />
                      <div>
                        <p className="text-white text-sm">{video.title}</p>
                        <p className="text-white/40 text-xs">{video.type}</p>
                      </div>
                    </div>
                    <button onClick={() => removeVideo(video.id)} className="text-white/40 hover:text-red-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'timeline' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Project Timeline</h3>
              <button
                onClick={addTimelineEvent}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>
            {formData.timeline?.map((event) => (
              <div key={event.id} className="glass rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateTimelineEvent(event.id, 'milestone', !event.milestone)}
                      className={`p-2 rounded-lg transition-colors ${
                        event.milestone ? 'bg-white text-black' : 'bg-white/10 text-white/60'
                      }`}
                    >
                      {event.milestone ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </button>
                    <span className="text-white/60 text-sm">{event.milestone ? 'Milestone' : 'Regular Event'}</span>
                  </div>
                  <button onClick={() => removeTimelineEvent(event.id)} className="text-white/40 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Date</label>
                    <input
                      type="date"
                      value={event.date}
                      onChange={(e) => updateTimelineEvent(event.id, 'date', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/40 text-sm mb-2">Event Title</label>
                    <input
                      type="text"
                      value={event.title}
                      onChange={(e) => updateTimelineEvent(event.id, 'title', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/40 text-sm mb-2">Description</label>
                    <textarea
                      value={event.description}
                      onChange={(e) => updateTimelineEvent(event.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'team' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Team Members</h3>
            <p className="text-white/40 text-sm">Select team members who worked on this project.</p>
            {/* This would be a multi-select with all team members */}
            <div className="glass rounded-2xl p-6">
              <p className="text-white/40 text-sm text-center py-8">
                Team member selection will be implemented with a searchable multi-select component.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
