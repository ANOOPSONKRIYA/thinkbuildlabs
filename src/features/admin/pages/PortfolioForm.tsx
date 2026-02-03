import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  FileText,
  Image,
  Youtube,
  Wrench,
  Users,
  Calendar,
  Link,
  Search,
  Globe,
  Lock,
  ExternalLink as ExternalLinkIcon,
  FileDigit,
} from 'lucide-react';

import type { Project, TeamMember } from '@/types';
import { mockDataService } from '@/lib/mockData';
import { PROJECT_CATEGORIES, PROJECT_STATUSES, VISIBILITY_OPTIONS } from '@/types';

// Admin components
import { SlugInput } from '@/features/admin/components/forms/SlugInput';
import { ImageUpload, GalleryImages } from '@/features/admin/components/forms/ImageUpload';
import { YouTubeInput } from '@/features/admin/components/forms/YouTubeInput';
import { CollapsibleSection } from '@/features/admin/components/forms/CollapsibleSection';
import { TechStackSelect } from '@/features/admin/components/forms/TechStackSelect';
import { TimelineEditor } from '@/features/admin/components/forms/TimelineEditor';
import { TeamMemberSelect } from '@/features/admin/components/forms/TeamMemberSelect';
import { MetaFields } from '@/features/admin/components/forms/MetaFields';
import { FormActions } from '@/features/admin/components/forms/FormActions';

export function PortfolioForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isNew = slug === 'new' || !slug;
  const isEdit = slug && slug !== 'new';

  // Loading states
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);

  // Form state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: 'vlsi',
    status: 'draft',
    visibility: 'public',
    thumbnail: '',
    coverImage: '',
    images: [],
    videos: [],
    techStack: [],
    timeline: [],
    teamMembers: [],
    teamMemberRoles: [],
    startDate: '',
    endDate: '',
    duration: '',
    githubUrl: '',
    demoUrl: '',
    documentationUrl: '',
    researchPaperUrl: '',
    externalLinks: [],
    metaTitle: '',
    metaDescription: '',
    keywords: [],
  });

  // Track original data for change detection
  const [originalData, setOriginalData] = useState<string>('');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch team members for selection
        const members = await mockDataService.getTeamMembers();
        setTeamMembers(members);

        // Fetch all projects for slug uniqueness check
        const projects = await mockDataService.getProjects();
        setExistingSlugs(projects.map((p) => p.slug));

        // If editing, fetch project data
        if (isEdit && slug) {
          const project = await mockDataService.getProjectBySlug(slug);
          if (project) {
            setFormData(project);
            setOriginalData(JSON.stringify(project));
          } else {
            toast.error('Project not found');
            navigate('/admin/projects');
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

  // Calculate if there are changes
  const hasChanges = useMemo(() => {
    if (isNew) return true;
    return JSON.stringify(formData) !== originalData;
  }, [formData, originalData, isNew]);

  // Form validation
  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      errors.title = 'Title is required';
    }
    if (!formData.slug?.trim()) {
      errors.slug = 'Slug is required';
    }
    if (!formData.shortDescription?.trim()) {
      errors.shortDescription = 'Short description is required';
    }
    if (!formData.thumbnail?.trim()) {
      errors.thumbnail = 'Thumbnail is required';
    }
    
    return errors;
  }, [formData]);

  const isValid = Object.keys(validationErrors).length === 0;

  // Handlers
  const handleChange = <K extends keyof Project>(field: K, value: Project[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (asDraft = false) => {
    if (!isValid) {
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    setIsSaving(true);

    try {
      const dataToSave = {
        ...formData,
        status: asDraft ? 'draft' : formData.status === 'draft' ? 'ongoing' : formData.status,
        publishedAt: !asDraft && formData.status === 'draft' ? new Date().toISOString() : formData.publishedAt,
      } as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

      if (isNew) {
        const newProject = await mockDataService.createProject(dataToSave);
        toast.success('Project created successfully!');
        navigate(`/admin/portfolio/${newProject.slug}`);
      } else if (formData.id) {
        await mockDataService.updateProject(formData.id, dataToSave);
        toast.success('Project updated successfully!');
        setOriginalData(JSON.stringify(formData));
      }
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;
    
    try {
      await mockDataService.deleteProject(formData.id);
      toast.success('Project deleted successfully!');
      navigate('/admin/projects');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    const previewUrl = isEdit ? `/portfolio/${formData.slug}?preview=true` : '#';
    if (previewUrl !== '#') {
      window.open(previewUrl, '_blank');
    } else {
      toast.info('Save the project first to preview');
    }
  };

  // External links handlers
  const addExternalLink = () => {
    const newLink: import('@/types').ExternalLink = {
      id: Date.now().toString(),
      title: '',
      url: '',
      type: 'reference',
    };
    handleChange('externalLinks', [...(formData.externalLinks || []), newLink]);
  };

  const updateExternalLink = (id: string, field: keyof import('@/types').ExternalLink, value: string) => {
    handleChange(
      'externalLinks',
      formData.externalLinks?.map((l) => (l.id === id ? { ...l, [field]: value } : l)) || []
    );
  };

  const removeExternalLink = (id: string) => {
    handleChange(
      'externalLinks',
      formData.externalLinks?.filter((l) => l.id !== id) || []
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-white/60">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-white">
                {isNew ? 'New Project' : 'Edit Project'}
              </h1>
              <p className="text-white/40 text-sm mt-0.5">
                {isNew ? 'Create a new portfolio project' : formData.title}
              </p>
            </div>
            
            {/* Status badge */}
            <div className="flex items-center gap-2">
              {formData.visibility === 'private' && (
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                  <Lock className="w-3 h-3 inline mr-1" />
                  Private
                </span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  formData.status === 'draft'
                    ? 'bg-gray-500/20 text-gray-400'
                    : formData.status === 'ongoing'
                    ? 'bg-blue-500/20 text-blue-400'
                    : formData.status === 'completed'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}
              >
                {PROJECT_STATUSES.find((s) => s.value === formData.status)?.label || formData.status}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Form Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Basic Information */}
          <CollapsibleSection
            title="Basic Information"
            description="Project title, description, and categorization"
            icon={<FileText className="w-5 h-5 text-blue-400" />}
            required
            defaultOpen
          >
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-white/60 text-sm mb-1.5">
                  Project Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter project title..."
                  className="w-full px-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
                {validationErrors.title && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.title}</p>
                )}
              </div>

              {/* Slug */}
              <SlugInput
                value={formData.slug || ''}
                onChange={(value) => handleChange('slug', value)}
                sourceValue={formData.title}
                existingSlugs={existingSlugs}
                currentSlug={isEdit ? formData.slug : undefined}
              />

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value as Project['category'])}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                  >
                    {PROJECT_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as Project['status'])}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Visibility</label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => handleChange('visibility', e.target.value as Project['visibility'])}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                  >
                    {VISIBILITY_OPTIONS.map((v) => (
                      <option key={v.value} value={v.value}>
                        {v.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-white/60 text-sm mb-1.5">
                  Short Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleChange('shortDescription', e.target.value)}
                  placeholder="Brief description shown in cards and previews (1-2 lines)"
                  rows={2}
                  maxLength={200}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                />
                <p className="text-white/30 text-xs mt-1 text-right">
                  {formData.shortDescription?.length || 0}/200
                </p>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-1.5">Full Description</label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => handleChange('fullDescription', e.target.value)}
                  placeholder="Detailed project description. Supports basic formatting."
                  rows={6}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                />
              </div>
            </div>
          </CollapsibleSection>

          {/* Media */}
          <CollapsibleSection
            title="Media"
            description="Images, thumbnails, and gallery"
            icon={<Image className="w-5 h-5 text-purple-400" />}
            badge={formData.images?.length}
          >
            <div className="space-y-6">
              {/* Thumbnail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload
                  value={formData.thumbnail || ''}
                  onChange={(value) => handleChange('thumbnail', value)}
                  label="Thumbnail Image *"
                  description="Used in project cards and listings"
                  aspectRatio="video"
                />
                <ImageUpload
                  value={formData.coverImage || ''}
                  onChange={(value) => handleChange('coverImage', value)}
                  label="Cover Image (Optional)"
                  description="Hero image on project detail page"
                  aspectRatio="wide"
                />
              </div>

              {/* Gallery */}
              <GalleryImages
                images={formData.images || []}
                onChange={(images) => handleChange('images', images)}
              />
            </div>
          </CollapsibleSection>

          {/* Videos */}
          <CollapsibleSection
            title="Videos"
            description="YouTube videos with automatic thumbnail extraction"
            icon={<Youtube className="w-5 h-5 text-red-500" />}
            badge={formData.videos?.length}
          >
            <YouTubeInput
              videos={formData.videos || []}
              onChange={(videos) => handleChange('videos', videos)}
            />
          </CollapsibleSection>

          {/* Tech Stack */}
          <CollapsibleSection
            title="Tech Stack"
            description="Technologies and tools used in this project"
            icon={<Wrench className="w-5 h-5 text-amber-400" />}
            badge={formData.techStack?.length}
          >
            <TechStackSelect
              selected={formData.techStack || []}
              onChange={(techStack) => handleChange('techStack', techStack)}
            />
          </CollapsibleSection>

          {/* Team */}
          <CollapsibleSection
            title="Team Assignment"
            description="Select team members involved in this project"
            icon={<Users className="w-5 h-5 text-green-400" />}
            badge={formData.teamMembers?.length}
          >
            <TeamMemberSelect
              availableMembers={teamMembers}
              selectedIds={formData.teamMembers || []}
              memberRoles={formData.teamMemberRoles}
              onChange={(ids, roles) => {
                handleChange('teamMembers', ids);
                if (roles) handleChange('teamMemberRoles', roles);
              }}
            />
          </CollapsibleSection>

          {/* Project Info */}
          <CollapsibleSection
            title="Project Timeline"
            description="Start date, end date, and milestone tracking"
            icon={<Calendar className="w-5 h-5 text-cyan-400" />}
            badge={formData.timeline?.length}
          >
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                {formData.status === 'completed' && (
                  <div>
                    <label className="block text-white/60 text-sm mb-1.5">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate || ''}
                      onChange={(e) => handleChange('endDate', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                )}
              </div>

              {formData.startDate && formData.endDate && (
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={formData.duration || ''}
                    onChange={(e) => handleChange('duration', e.target.value)}
                    placeholder="e.g., 6 months, 1 year"
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                </div>
              )}
            </div>

            <TimelineEditor
              events={formData.timeline || []}
              onChange={(timeline) => handleChange('timeline', timeline)}
            />
          </CollapsibleSection>

          {/* Links */}
          <CollapsibleSection
            title="Links & Resources"
            description="External links and resources"
            icon={<Link className="w-5 h-5 text-pink-400" />}
            badge={(formData.externalLinks?.length || 0) + (formData.githubUrl ? 1 : 0)}
          >
            <div className="space-y-4">
              {/* GitHub */}
              <div>
                <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                  <Globe className="w-4 h-4" />
                  GitHub Repository
                </label>
                <input
                  type="url"
                  value={formData.githubUrl || ''}
                  onChange={(e) => handleChange('githubUrl', e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
              </div>

              {/* Demo URL */}
              <div>
                <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                  <ExternalLinkIcon className="w-4 h-4" />
                  Live Demo
                </label>
                <input
                  type="url"
                  value={formData.demoUrl || ''}
                  onChange={(e) => handleChange('demoUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
              </div>

              {/* Documentation */}
              <div>
                <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                  <FileDigit className="w-4 h-4" />
                  Documentation URL
                </label>
                <input
                  type="url"
                  value={formData.documentationUrl || ''}
                  onChange={(e) => handleChange('documentationUrl', e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
              </div>

              {/* Research Paper */}
              <div>
                <label className="flex items-center gap-2 text-white/60 text-sm mb-1.5">
                  <FileText className="w-4 h-4" />
                  Research Paper / PDF
                </label>
                <input
                  type="url"
                  value={formData.researchPaperUrl || ''}
                  onChange={(e) => handleChange('researchPaperUrl', e.target.value)}
                  placeholder="https://... or link to PDF"
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
              </div>

              {/* External Links */}
              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white/60 text-sm">External References</label>
                  <button
                    type="button"
                    onClick={addExternalLink}
                    className="text-xs text-white/40 hover:text-white transition-colors"
                  >
                    + Add Link
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.externalLinks?.map((link) => (
                    <div key={link.id} className="flex gap-2">
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateExternalLink(link.id, 'title', e.target.value)}
                        placeholder="Link title"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                      />
                      <select
                        value={link.type}
                        onChange={(e) => updateExternalLink(link.id, 'type', e.target.value)}
                        className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                      >
                        <option value="documentation">Documentation</option>
                        <option value="reference">Reference</option>
                        <option value="article">Article</option>
                        <option value="other">Other</option>
                      </select>
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateExternalLink(link.id, 'url', e.target.value)}
                        placeholder="URL"
                        className="flex-[2] px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                      />
                      <button
                        type="button"
                        onClick={() => removeExternalLink(link.id)}
                        className="px-3 py-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          {/* Meta & SEO */}
          <CollapsibleSection
            title="SEO & Meta Information"
            description="Search engine optimization settings"
            icon={<Search className="w-5 h-5 text-orange-400" />}
          >
            <MetaFields
              metaTitle={formData.metaTitle}
              metaDescription={formData.metaDescription}
              keywords={formData.keywords}
              onChange={(values) => {
                handleChange('metaTitle', values.metaTitle || '');
                handleChange('metaDescription', values.metaDescription || '');
                handleChange('keywords', values.keywords || []);
              }}
              defaults={{
                title: formData.title,
                description: formData.shortDescription,
              }}
            />
          </CollapsibleSection>
        </motion.div>
      </main>

      {/* Form Actions Footer */}
      <FormActions
        onSave={handleSave}
        onPreview={handlePreview}
        onDelete={isEdit ? handleDelete : undefined}
        onCancel={() => navigate('/admin/projects')}
        isSaving={isSaving}
        isNew={isNew}
        hasChanges={hasChanges}
      />
    </div>
  );
}
