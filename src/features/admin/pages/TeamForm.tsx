import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  User,
  Mail,
  Phone,
  Link,
  Download,
  GraduationCap,
  Briefcase,
  Trophy,
  FolderOpen,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  BookOpen,
  Calendar,
  Activity,
  Search,
  Save,
  Trash2,
  Eye,
  X,
} from 'lucide-react';

import type { TeamMember, Education, Experience, Achievement, SocialLink, Project, Resume } from '@/types';
import { mockDataService } from '@/lib/dataService';

// Admin components
import { SlugInput } from '@/features/admin/components/forms/SlugInput';
import { ImageUpload } from '@/features/admin/components/forms/ImageUpload';
import { CollapsibleSection } from '@/features/admin/components/forms/CollapsibleSection';
import { SkillsSelect } from '@/features/admin/components/forms/TechStackSelect';
import { ProjectSelect } from '@/features/admin/components/forms/TeamMemberSelect';
import { MetaFields } from '@/features/admin/components/forms/MetaFields';
import { logAdminAction } from '@/lib/activityLogs';
import { AdminLayout } from '@/features/admin/components/AdminLayout';

const SOCIAL_PLATFORMS = [
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'github', label: 'GitHub', icon: Github },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'portfolio', label: 'Portfolio', icon: Globe },
  { value: 'google-scholar', label: 'Google Scholar', icon: BookOpen },
  { value: 'email', label: 'Email', icon: Mail },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'inactive', label: 'Inactive', color: 'gray' },
  { value: 'alumni', label: 'Alumni', color: 'amber' },
];

export function TeamForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = slug === 'new' || !slug;
  const isEdit = slug && slug !== 'new';

  // Loading states
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    slug: '',
    role: '',
    email: '',
    phone: '',
    bio: '',
    about: '',
    avatar: '',
    coverImage: '',
    socialLinks: [],
    skills: [],
    projects: [],
    education: [],
    experience: [],
    achievements: [],
    isActive: true,
    status: 'active',
    joinedAt: new Date().toISOString().split('T')[0],
    memberSince: new Date().toISOString().split('T')[0],
    metaTitle: '',
    metaDescription: '',
  });

  // Track original data
  const [originalData, setOriginalData] = useState<string>('');

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects for selection
        const allProjects = await mockDataService.getProjects();
        setProjects(allProjects);

        // Fetch all team members for slug check
        const members = await mockDataService.getTeamMembers();
        setExistingSlugs(members.map((m) => m.slug));

        // If editing, fetch member data
        if (isEdit && slug) {
          const member = await mockDataService.getTeamMemberBySlug(slug);
          if (member) {
            setFormData(member);
            setOriginalData(JSON.stringify(member));
          } else {
            toast.error('Team member not found');
            navigate('/admin/team');
          }
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, isEdit, navigate]);

  // Change detection
  const hasChanges = useMemo(() => {
    if (isNew) return true;
    return JSON.stringify(formData) !== originalData;
  }, [formData, originalData, isNew]);

  // Validation
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.slug?.trim()) {
      errors.slug = 'Slug is required';
    }
    if (!formData.role?.trim()) {
      errors.role = 'Role is required';
    }
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }
    if (!formData.avatar?.trim()) {
      errors.avatar = 'Profile photo is required';
    }
    
    return errors;
  }, [formData]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Handlers
  const handleChange = <K extends keyof TeamMember>(field: K, value: TeamMember[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateResume = (updates: Partial<Resume>) => {
    setFormData((prev) => {
      const base = prev.resume || { url: '', filename: '', uploadedAt: new Date().toISOString() };
      const next = { ...base, ...updates };
      const hasUrl = (next.url || '').trim().length > 0;

      return {
        ...prev,
        resume: hasUrl ? { ...next, uploadedAt: next.uploadedAt || new Date().toISOString() } : undefined,
      };
    });
  };

  const handleSave = async (_asDraft = false) => {
    if (!isValid) {
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    setIsSaving(true);

    try {
      const previous = originalData ? (JSON.parse(originalData) as TeamMember) : null;
      const dataToSave = {
        ...formData,
        isActive: formData.status === 'active',
      } as Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>;

      if (isNew) {
        const newMember = await mockDataService.createTeamMember(dataToSave);
        if (!newMember) {
          toast.error('Failed to create team member');
          return;
        }
        toast.success('Team member created successfully!');
        await logAdminAction({
          action: 'create',
          entityType: 'team_member',
          entityId: newMember.id,
          entitySlug: newMember.slug,
          entityName: newMember.name,
          message: `Created team member "${newMember.name}"`,
        });
        navigate(`/admin/team/${newMember.slug}`);
      } else if (formData.id) {
        const updated = await mockDataService.updateTeamMember(formData.id, dataToSave);
        toast.success('Team member updated successfully!');
        const mediaChanged = previous
          ? previous.avatar !== dataToSave.avatar ||
            previous.coverImage !== dataToSave.coverImage ||
            previous.bannerImage !== dataToSave.bannerImage
          : false;

        await logAdminAction({
          action: 'update',
          entityType: 'team_member',
          entityId: updated?.id || formData.id,
          entitySlug: updated?.slug || formData.slug,
          entityName: updated?.name || formData.name,
          message: `Updated team member "${updated?.name || formData.name}"`,
        });

        if (mediaChanged) {
          await logAdminAction({
            action: 'media_update',
            entityType: 'team_member',
            entityId: updated?.id || formData.id,
            entitySlug: updated?.slug || formData.slug,
            entityName: updated?.name || formData.name,
            message: `Updated profile media for "${updated?.name || formData.name}"`,
          });
        }
        setOriginalData(JSON.stringify(formData));
      }
    } catch (error) {
      toast.error('Failed to save team member');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    
    if (!confirm('Are you sure you want to delete this team member?')) return;
    
    try {
      await mockDataService.deleteTeamMember(formData.id);
      toast.success('Team member deleted successfully!');
      await logAdminAction({
        action: 'delete',
        entityType: 'team_member',
        entityId: formData.id,
        entitySlug: formData.slug,
        entityName: formData.name,
        message: `Deleted team member "${formData.name}"`,
      });
      navigate('/admin/team');
    } catch (error) {
      toast.error('Failed to delete team member');
    }
  };

  const handlePreview = () => {
    const previewUrl = isEdit ? `/team/${formData.slug}?preview=true` : '#';
    if (previewUrl !== '#') {
      window.open(previewUrl, '_blank');
    } else {
      toast.info('Save the profile first to preview');
    }
  };

  // Social links handlers
  const [newSocial, setNewSocial] = useState<{ platform: string; url: string }>({
    platform: 'linkedin',
    url: '',
  });

  const addSocialLink = () => {
    if (!newSocial.url.trim()) return;

    // Remove existing link for same platform
    const filtered = formData.socialLinks?.filter((s) => s.platform !== newSocial.platform) || [];
    
    handleChange('socialLinks', [
      ...filtered,
      { platform: newSocial.platform as SocialLink['platform'], url: newSocial.url.trim() },
    ]);
    
    setNewSocial({ platform: 'linkedin', url: '' });
  };

  const removeSocialLink = (platform: string) => {
    handleChange(
      'socialLinks',
      formData.socialLinks?.filter((s) => s.platform !== platform) || []
    );
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startYear: new Date().getFullYear().toString(),
      current: false,
    };
    handleChange('education', [...(formData.education || []), newEdu]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string | boolean) => {
    handleChange(
      'education',
      formData.education?.map((e) => (e.id === id ? { ...e, [field]: value } : e)) || []
    );
  };

  const removeEducation = (id: string) => {
    handleChange('education', formData.education?.filter((e) => e.id !== id) || []);
  };

  // Experience handlers
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: new Date().toISOString().split('T')[0],
      current: false,
      description: '',
    };
    handleChange('experience', [...(formData.experience || []), newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    handleChange(
      'experience',
      formData.experience?.map((e) => (e.id === id ? { ...e, [field]: value } : e)) || []
    );
  };

  const removeExperience = (id: string) => {
    handleChange('experience', formData.experience?.filter((e) => e.id !== id) || []);
  };

  // Achievement handlers
  const addAchievement = () => {
    const newAch: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
    };
    handleChange('achievements', [...(formData.achievements || []), newAch]);
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    handleChange(
      'achievements',
      formData.achievements?.map((a) => (a.id === id ? { ...a, [field]: value } : a)) || []
    );
  };

  const removeAchievement = (id: string) => {
    handleChange('achievements', formData.achievements?.filter((a) => a.id !== id) || []);
  };

  if (isLoading) {
    return (
      <AdminLayout title={isNew ? 'New Team Member' : 'Edit Team Member'}>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-white/60">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Status badge for header
  const statusBadge = (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        formData.status === 'active'
          ? 'bg-green-500/20 text-green-400'
          : formData.status === 'alumni'
          ? 'bg-amber-500/20 text-amber-400'
          : 'bg-gray-500/20 text-gray-400'
      }`}
    >
      {STATUS_OPTIONS.find((s) => s.value === formData.status)?.label || formData.status}
    </span>
  );

  // Header actions
  const headerActions = (
    <div className="flex items-center gap-2">
      {statusBadge}
      <button
        onClick={handlePreview}
        disabled={isNew}
        className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/10 text-white/70 rounded-lg hover:bg-white/20 transition-colors text-sm disabled:opacity-30"
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
      <button
        onClick={() => handleSave()}
        disabled={isSaving || !hasChanges}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50"
      >
        <Save className="w-4 h-4" />
        {isSaving ? 'Saving...' : isNew ? 'Create' : 'Save'}
      </button>
      {isEdit && (
        <button
          onClick={handleDelete}
          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <AdminLayout
      title={isNew ? 'New Team Member' : 'Edit Team Member'}
      subtitle={isNew ? 'Add a new team member profile' : formData.name}
      showBackButton
      onBack={() => navigate('/admin/team')}
      actions={headerActions}
    >
      {/* Form Content */}
      <div className="p-4 sm:p-6 lg:p-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-6"
        >
          {/* Basic Info */}
          <CollapsibleSection
            title="Basic Information"
            description="Name, role, and contact details"
            icon={<User className="w-5 h-5 text-blue-400" />}
            required
            defaultOpen
          >
            <div className="space-y-4">
              {/* Avatar & Cover */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  value={formData.avatar || ''}
                  onChange={(value) => handleChange('avatar', value)}
                  label="Profile Photo *"
                  description="Used in team cards and profile"
                  aspectRatio="square"
                />
                <ImageUpload
                  value={formData.coverImage || ''}
                  onChange={(value) => handleChange('coverImage', value)}
                  label="Banner / Cover Image"
                  description="Hero image on profile page"
                  aspectRatio="wide"
                />
              </div>

              {/* Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Enter full name..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                  {validationErrors.name && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.name}</p>
                  )}
                </div>
                <SlugInput
                  value={formData.slug || ''}
                  onChange={(value) => handleChange('slug', value)}
                  sourceValue={formData.name}
                  existingSlugs={existingSlugs}
                  currentSlug={isEdit ? formData.slug : undefined}
                  label="Profile Slug"
                  placeholder="john-doe"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-white/60 text-sm mb-1.5">
                  Role / Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                  placeholder="e.g., VLSI Design Lead, Research Scientist"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
                {validationErrors.role && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.role}</p>
                )}
              </div>

              {/* Bios */}
              <div>
                <label className="block text-white/60 text-sm mb-1.5">Short Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="Brief introduction (1-2 sentences)"
                  rows={2}
                  maxLength={300}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                />
                <p className="text-white/30 text-xs mt-1 text-right">
                  {formData.bio?.length || 0}/300
                </p>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-1.5">Detailed About</label>
                <textarea
                  value={formData.about}
                  onChange={(e) => handleChange('about', e.target.value)}
                  placeholder="Detailed biography and background"
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Contact Info */}
          <CollapsibleSection
            title="Contact Information"
            description="Email, phone, and social links"
            icon={<Mail className="w-5 h-5 text-green-400" />}
            badge={formData.socialLinks?.length}
          >
            <div className="space-y-4">
              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                    <Mail className="w-4 h-4" />
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                  {validationErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>
                <div>
                  <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                    <Phone className="w-4 h-4" />
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-white/5">
                <label className="flex items-center gap-2 text-white/60 text-sm mb-3">
                  <Link className="w-4 h-4" />
                  Social Links
                </label>

                {/* Add new social link */}
                <div className="flex gap-2 mb-4">
                  <div className="relative">
                    <select
                      value={newSocial.platform}
                      onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value })}
                      className="appearance-none px-4 py-2.5 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 cursor-pointer min-w-[140px] hover:bg-white/[0.07] transition-colors"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                      }}
                    >
                      {SOCIAL_PLATFORMS.map((p) => (
                        <option key={p.value} value={p.value} className="bg-[#1a1a1a] text-white py-2">
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="text"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                  <button
                    type="button"
                    onClick={addSocialLink}
                    disabled={!newSocial.url.trim()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-30 rounded-lg text-white text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* List of social links */}
                <div className="space-y-2">
                  {formData.socialLinks?.map((link) => {
                    const platform = SOCIAL_PLATFORMS.find((p) => p.value === link.platform);
                    const Icon = platform?.icon || Globe;
                    return (
                      <div
                        key={link.platform}
                        className="flex items-center justify-between p-3 rounded-lg bg-white/5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-white/60" />
                          </div>
                          <div>
                            <p className="text-white text-sm">{platform?.label}</p>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white/40 text-xs hover:text-white/60 truncate max-w-[200px] block"
                            >
                              {link.url}
                            </a>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSocialLink(link.platform)}
                          className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Resume link */}
              <div className="pt-4 border-t border-white/5">
                <label className="flex items-center gap-2 text-white/60 text-sm mb-3">
                  <Download className="w-4 h-4" />
                  Resume (Google Drive link)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="url"
                    value={formData.resume?.url || ''}
                    onChange={(e) => updateResume({ url: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                  <input
                    type="text"
                    value={formData.resume?.filename || ''}
                    onChange={(e) => updateResume({ filename: e.target.value })}
                    placeholder="Button label (e.g., Resume.pdf)"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                  <p className="text-white/40 text-xs sm:text-sm">
                    Provide a shareable Google Drive link. The label is optional.
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Skills */}
          <CollapsibleSection
            title="Skills"
            description="Technical and professional skills"
            icon={<Activity className="w-5 h-5 text-amber-400" />}
            badge={formData.skills?.length}
          >
            <SkillsSelect
              selected={formData.skills || []}
              onChange={(skills) => handleChange('skills', skills)}
            />
          </CollapsibleSection>

          {/* Education */}
          <CollapsibleSection
            title="Education"
            description="Academic background and qualifications"
            icon={<GraduationCap className="w-5 h-5 text-indigo-400" />}
            badge={formData.education?.length}
          >
            <div className="space-y-4">
              <button
                type="button"
                onClick={addEducation}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white text-sm transition-colors"
              >
                + Add Education
              </button>

              <div className="space-y-3">
                {formData.education?.map((edu) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-white font-medium text-sm">Education Entry</h4>
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="text-white/40 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-white/40 text-xs mb-1">Institution</label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          placeholder="University name"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Degree</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          placeholder="Bachelor's, Master's, PhD"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Field of Study</label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          placeholder="e.g., Electrical Engineering"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Start Year</label>
                        <input
                          type="text"
                          value={edu.startYear}
                          onChange={(e) => updateEducation(edu.id, 'startYear', e.target.value)}
                          placeholder="2020"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                        />
                      </div>
                      {!edu.current && (
                        <div>
                          <label className="block text-white/40 text-xs mb-1">End Year</label>
                          <input
                            type="text"
                            value={edu.endYear || ''}
                            onChange={(e) => updateEducation(edu.id, 'endYear', e.target.value)}
                            placeholder="2024"
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        id={`edu-current-${edu.id}`}
                        checked={edu.current}
                        onChange={(e) => updateEducation(edu.id, 'current', e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5"
                      />
                      <label htmlFor={`edu-current-${edu.id}`} className="text-white/60 text-sm">
                        Currently studying here
                      </label>
                    </div>

                    <div className="mt-3">
                      <label className="block text-white/40 text-xs mb-1">Description (Optional)</label>
                      <textarea
                        value={edu.description || ''}
                        onChange={(e) => updateEducation(edu.id, 'description', e.target.value)}
                        placeholder="Additional details..."
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Experience */}
          <CollapsibleSection
            title="Experience"
            description="Work experience and professional background"
            icon={<Briefcase className="w-5 h-5 text-cyan-400" />}
            badge={formData.experience?.length}
          >
            <div className="space-y-4">
              <button
                type="button"
                onClick={addExperience}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white text-sm transition-colors"
              >
                + Add Experience
              </button>

              <div className="space-y-3">
                {formData.experience?.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-white font-medium text-sm">Experience Entry</h4>
                      <button
                        type="button"
                        onClick={() => removeExperience(exp.id)}
                        className="text-white/40 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          placeholder="Company name"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Position</label>
                        <input
                          type="text"
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          placeholder="Job title"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Start Date</label>
                        <input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                        />
                      </div>
                      {!exp.current && (
                        <div>
                          <label className="block text-white/40 text-xs mb-1">End Date</label>
                          <input
                            type="date"
                            value={exp.endDate || ''}
                            onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <input
                        type="checkbox"
                        id={`exp-current-${exp.id}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                        className="w-4 h-4 rounded border-white/20 bg-white/5"
                      />
                      <label htmlFor={`exp-current-${exp.id}`} className="text-white/60 text-sm">
                        Currently working here
                      </label>
                    </div>

                    <div className="mt-3">
                      <label className="block text-white/40 text-xs mb-1">Description</label>
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                        placeholder="Describe your role and achievements..."
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Achievements */}
          <CollapsibleSection
            title="Achievements"
            description="Awards, publications, and recognitions"
            icon={<Trophy className="w-5 h-5 text-yellow-400" />}
            badge={formData.achievements?.length}
          >
            <div className="space-y-4">
              <button
                type="button"
                onClick={addAchievement}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-white text-sm transition-colors"
              >
                + Add Achievement
              </button>

              <div className="space-y-3">
                {formData.achievements?.map((ach) => (
                  <div key={ach.id} className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-white font-medium text-sm">Achievement</h4>
                      <button
                        type="button"
                        onClick={() => removeAchievement(ach.id)}
                        className="text-white/40 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Title</label>
                        <input
                          type="text"
                          value={ach.title}
                          onChange={(e) => updateAchievement(ach.id, 'title', e.target.value)}
                          placeholder="e.g., Best Paper Award - ISSCC 2023"
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white/40 text-xs mb-1">Description</label>
                        <textarea
                          value={ach.description}
                          onChange={(e) => updateAchievement(ach.id, 'description', e.target.value)}
                          placeholder="Brief description of the achievement..."
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-white/40 text-xs mb-1">Date</label>
                          <input
                            type="date"
                            value={ach.date}
                            onChange={(e) => updateAchievement(ach.id, 'date', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                          />
                        </div>
                        <div>
                          <label className="block text-white/40 text-xs mb-1">Link (Optional)</label>
                          <input
                            type="url"
                            value={ach.link || ''}
                            onChange={(e) => updateAchievement(ach.id, 'link', e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Projects */}
          <CollapsibleSection
            title="Linked Projects"
            description="Connect projects this member has worked on"
            icon={<FolderOpen className="w-5 h-5 text-purple-400" />}
            badge={formData.projects?.length}
          >
            <ProjectSelect
              availableProjects={projects.map((p) => ({
                id: p.id,
                title: p.title,
                thumbnail: p.thumbnail,
                category: p.category,
              }))}
              selectedIds={formData.projects || []}
              onChange={(ids) => handleChange('projects', ids)}
            />
          </CollapsibleSection>

          {/* Member Status */}
          <CollapsibleSection
            title="Member Status"
            description="Membership details and status"
            icon={<Calendar className="w-5 h-5 text-pink-400" />}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Status</label>
                  <div className="relative">
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value as TeamMember['status'])}
                      className="w-full appearance-none px-3 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                      }}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value} className="bg-[#1a1a1a] text-white">
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Member Since</label>
                  <input
                    type="date"
                    value={formData.joinedAt || ''}
                    onChange={(e) => handleChange('joinedAt', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>

              {formData.status === 'alumni' && (
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Left Date</label>
                  <input
                    type="date"
                    value={formData.leftAt || ''}
                    onChange={(e) => handleChange('leftAt', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
              )}
            </div>
          </CollapsibleSection>

          {/* SEO & Meta */}
          <CollapsibleSection
            title="SEO & Meta Information"
            description="Search engine optimization settings"
            icon={<Search className="w-5 h-5 text-orange-400" />}
          >
            <MetaFields
              metaTitle={formData.metaTitle}
              metaDescription={formData.metaDescription}
              keywords={[]}
              onChange={(values) => {
                handleChange('metaTitle', values.metaTitle || '');
                handleChange('metaDescription', values.metaDescription || '');
              }}
              defaults={{
                title: formData.name,
                description: formData.bio,
              }}
            />
          </CollapsibleSection>
        </motion.div>
      </div>

      {/* Mobile Floating Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent lg:hidden z-40">
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/admin/team')}
            className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSave()}
            disabled={isSaving || !hasChanges}
            className="flex-[2] px-4 py-3 rounded-xl bg-white text-black font-medium text-sm disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : isNew ? 'Create Member' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
