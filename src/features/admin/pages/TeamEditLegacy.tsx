import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Github,
  Linkedin,
  Twitter,
  Globe,
  X
} from 'lucide-react';
import type { TeamMember, Education, Experience, Achievement, SocialLink } from '@/types';
import { mockDataService } from '@/lib/dataService';

const SOCIAL_PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'portfolio', label: 'Portfolio', icon: Globe },
];

export function TeamEditLegacy() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = slug === 'new';
  
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'education' | 'experience' | 'achievements'>('basic');
  
  // Form state
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    slug: '',
    role: '',
    email: '',
    phone: '',
    bio: '',
    avatar: '',
    coverImage: '',
    skills: [],
    socialLinks: [],
    education: [],
    experience: [],
    achievements: [],
    isActive: true,
    isFeatured: false,
    projects: [],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newSocial, setNewSocial] = useState<{platform: string; url: string}>({ platform: 'linkedin', url: '' });

  useEffect(() => {
    if (!isNew && slug) {
      const fetchMember = async () => {
        const member = await mockDataService.getTeamMemberBySlug(slug);
        if (member) {
          setFormData({ ...member, isFeatured: member.isFeatured ?? false });
        }
        setLoading(false);
      };
      fetchMember();
    }
  }, [slug, isNew]);

  const handleSave = async () => {
    setSaving(true);
    
    const dataToSave = {
      ...formData,
      isFeatured: formData.isFeatured ?? false,
      slug: formData.slug || formData.name?.toLowerCase().replace(/\s+/g, '-'),
      joinedAt: formData.joinedAt || new Date().toISOString().split('T')[0],
    } as Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;

    if (isNew) {
      await mockDataService.createTeamMember(dataToSave);
    } else if (formData.id) {
      await mockDataService.updateTeamMember(formData.id, dataToSave);
    }
    
    setSaving(false);
    navigate('/admin/team');
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills?.includes(newSkill.trim())) {
      setFormData({ ...formData, skills: [...(formData.skills || []), newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills?.filter(s => s !== skill) || [] });
  };

  const addSocialLink = () => {
    if (newSocial.url.trim()) {
      const updated = formData.socialLinks?.filter(s => s.platform !== newSocial.platform) || [];
      setFormData({ 
        ...formData, 
        socialLinks: [...updated, { platform: newSocial.platform as SocialLink['platform'], url: newSocial.url.trim() }] 
      });
      setNewSocial({ platform: 'linkedin', url: '' });
    }
  };

  const removeSocialLink = (platform: string) => {
    setFormData({ ...formData, socialLinks: formData.socialLinks?.filter(s => s.platform !== platform) || [] });
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startYear: new Date().getFullYear().toString(),
      current: false,
    };
    setFormData({ ...formData, education: [...(formData.education || []), newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    setFormData({
      ...formData,
      education: formData.education?.map(e => e.id === id ? { ...e, [field]: value } : e) || []
    });
  };

  const removeEducation = (id: string) => {
    setFormData({ ...formData, education: formData.education?.filter(e => e.id !== id) || [] });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: new Date().toISOString().split('T')[0],
      current: false,
      description: '',
    };
    setFormData({ ...formData, experience: [...(formData.experience || []), newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setFormData({
      ...formData,
      experience: formData.experience?.map(e => e.id === id ? { ...e, [field]: value } : e) || []
    });
  };

  const removeExperience = (id: string) => {
    setFormData({ ...formData, experience: formData.experience?.filter(e => e.id !== id) || [] });
  };

  const addAchievement = () => {
    const newAch: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    };
    setFormData({ ...formData, achievements: [...(formData.achievements || []), newAch] });
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    setFormData({
      ...formData,
      achievements: formData.achievements?.map(a => a.id === id ? { ...a, [field]: value } : a) || []
    });
  };

  const removeAchievement = (id: string) => {
    setFormData({ ...formData, achievements: formData.achievements?.filter(a => a.id !== id) || [] });
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
            <Link to="/admin/team" className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <h1 className="text-lg font-semibold text-white">
              {isNew ? 'Add Team Member' : 'Edit Team Member'}
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
        <div className="flex gap-2">
          {(['basic', 'education', 'experience', 'achievements'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
            {/* Avatar & Cover */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Profile Images</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-sm mb-2">Avatar URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.avatar || ''}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  {formData.avatar && (
                    <img src={formData.avatar} alt="Avatar preview" className="w-20 h-20 rounded-full mt-3 object-cover" />
                  )}
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                  {formData.coverImage && (
                    <img src={formData.coverImage} alt="Cover preview" className="w-full h-20 rounded-lg mt-3 object-cover" />
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/40 text-sm mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="john-doe"
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Role *</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="VLSI Design Lead"
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="text-white/40 text-sm">Active Member</label>
                  <button
                    onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.isActive ? 'bg-green-500' : 'bg-white/20'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      formData.isActive ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-white/40 text-sm mb-2">Bio</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                />
              </div>
            </div>

            {/* Skills */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Skills</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill..."
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
                {formData.skills?.map((skill) => (
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

            {/* Social Links */}
            <div className="glass rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Social Links</h3>
              <div className="flex gap-2">
                <select
                  value={newSocial.platform}
                  onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                  className="px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                >
                  {SOCIAL_PLATFORMS.map((p) => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
                <input
                  type="url"
                  value={newSocial.url}
                  onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                  placeholder="https://..."
                  className="flex-1 px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                />
                <button
                  onClick={addSocialLink}
                  className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {formData.socialLinks?.map((link) => {
                  const platform = SOCIAL_PLATFORMS.find(p => p.value === link.platform);
                  const Icon = platform?.icon || Globe;
                  return (
                    <div key={link.platform} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-white/60" />
                        <span className="text-white text-sm">{platform?.label}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-white/40 text-sm hover:text-white truncate max-w-[200px]">
                          {link.url}
                        </a>
                        <button onClick={() => removeSocialLink(link.platform)} className="text-white/40 hover:text-red-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'education' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Education</h3>
              <button
                onClick={addEducation}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            </div>
            {formData.education?.map((edu) => (
              <div key={edu.id} className="glass rounded-2xl p-6 space-y-4">
                <div className="flex justify-between">
                  <h4 className="text-white font-medium">Education Entry</h4>
                  <button onClick={() => removeEducation(edu.id)} className="text-white/40 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      placeholder="Bachelor's, Master's, PhD"
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Field of Study</label>
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-white/40 text-sm mb-2">Start Year</label>
                      <input
                        type="text"
                        value={edu.startYear}
                        onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                      />
                    </div>
                    {!edu.current && (
                      <div className="flex-1">
                        <label className="block text-white/40 text-sm mb-2">End Year</label>
                        <input
                          type="text"
                          value={edu.endYear || ''}
                          onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`current-${edu.id}`}
                    checked={edu.current}
                    onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5"
                  />
                  <label htmlFor={`current-${edu.id}`} className="text-white/60 text-sm">Currently Studying</label>
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Description</label>
                  <textarea
                    value={edu.description || ''}
                    onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'experience' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Experience</h3>
              <button
                onClick={addExperience}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Experience
              </button>
            </div>
            {formData.experience?.map((exp) => (
              <div key={exp.id} className="glass rounded-2xl p-6 space-y-4">
                <div className="flex justify-between">
                  <h4 className="text-white font-medium">Experience Entry</h4>
                  <button onClick={() => removeExperience(exp.id)} className="text-white/40 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  {!exp.current && (
                    <div>
                      <label className="block text-white/40 text-sm mb-2">End Date</label>
                      <input
                        type="date"
                        value={exp.endDate || ''}
                        onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                      />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={`current-exp-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/5"
                  />
                  <label htmlFor={`current-exp-${exp.id}`} className="text-white/60 text-sm">Currently Working</label>
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Description</label>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Achievements</h3>
              <button
                onClick={addAchievement}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add Achievement
              </button>
            </div>
            {formData.achievements?.map((ach) => (
              <div key={ach.id} className="glass rounded-2xl p-6 space-y-4">
                <div className="flex justify-between">
                  <h4 className="text-white font-medium">Achievement Entry</h4>
                  <button onClick={() => removeAchievement(ach.id)} className="text-white/40 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Title</label>
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/40 text-sm mb-2">Description</label>
                  <textarea
                    value={ach.description}
                    onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Date</label>
                    <input
                      type="date"
                      value={ach.date}
                      onChange={(e) => updateAchievement(ach.id, 'date', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-sm mb-2">Link (Optional)</label>
                    <input
                      type="url"
                      value={ach.link || ''}
                      onChange={(e) => updateAchievement(ach.id, 'link', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-lg glass text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
