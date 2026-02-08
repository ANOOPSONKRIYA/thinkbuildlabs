import { useEffect, useMemo, useState } from 'react';
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
  ExternalLink as ExternalLinkIcon,
  FileDigit,
  Star,
  Save,
  X,
} from 'lucide-react';

import type { Project, TeamMember, TeamMemberRole } from '@/types';
import { mockDataService } from '@/lib/dataService';
import { PROJECT_CATEGORIES, PROJECT_STATUSES, VISIBILITY_OPTIONS } from '@/types';
import { useMemberSession } from '@/features/member/context/MemberContext';

import { MemberLayout } from '@/features/member/components/MemberLayout';
import { SlugInput } from '@/features/admin/components/forms/SlugInput';
import { ImageUpload, GalleryImages } from '@/features/admin/components/forms/ImageUpload';
import { YouTubeInput } from '@/features/admin/components/forms/YouTubeInput';
import { CollapsibleSection } from '@/features/admin/components/forms/CollapsibleSection';
import { TechStackSelect } from '@/features/admin/components/forms/TechStackSelect';
import { TimelineEditor } from '@/features/admin/components/forms/TimelineEditor';
import { TeamMemberSelect } from '@/features/admin/components/forms/TeamMemberSelect';
import { MetaFields } from '@/features/admin/components/forms/MetaFields';
import { logMemberAction } from '@/lib/activityLogs';
import { deleteProjectMedia } from '@/lib/supabase';

export function MemberProjectForm() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user, member } = useMemberSession();
  const isNew = !slug;
  const isEdit = !!slug;

  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [existingSlugs, setExistingSlugs] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<Project>>({
    ownerId: user.id,
    title: '',
    slug: '',
    shortDescription: '',
    fullDescription: '',
    category: 'vlsi',
    status: 'draft',
    visibility: 'public',
    isFeatured: false,
    thumbnail: '',
    coverImage: '',
    images: [],
    videos: [],
    techStack: [],
    timeline: [],
    teamMembers: member?.id ? [member.id] : [],
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

  const [originalData, setOriginalData] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const members = await mockDataService.getTeamMembers();
        setTeamMembers(members);

        const projects = await mockDataService.getProjects();
        setExistingSlugs(projects.map((p) => p.slug));

        if (isEdit && slug) {
          const project = await mockDataService.getProjectBySlug(slug);
          if (!project) {
            toast.error('Project not found');
            navigate('/member');
            return;
          }

          if (!member?.id || !project.teamMembers?.includes(member.id)) {
            toast.error('You can only edit projects assigned to you.');
            navigate('/member');
            return;
          }

          const ensuredTeamMembers = ensureSelfInTeam(project.teamMembers || [], project.teamMemberRoles || []);
          setFormData({
            ...project,
            isFeatured: project.isFeatured ?? false,
            teamMembers: ensuredTeamMembers.ids,
            teamMemberRoles: ensuredTeamMembers.roles,
          });
          setOriginalData(JSON.stringify({ ...project, isFeatured: project.isFeatured ?? false }));
        }
      } catch (error) {
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [slug, isEdit, navigate, user.id, member?.id]);

  const hasChanges = useMemo(() => {
    if (isNew) return true;
    return JSON.stringify(formData) !== originalData;
  }, [formData, originalData, isNew]);

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
    if (!formData.teamMembers || formData.teamMembers.length === 0) {
      errors.teamMembers = 'Assign at least one team member';
    }
    if (!formData.startDate?.trim()) {
      errors.startDate = 'Start date is required';
    }

    return errors;
  }, [formData]);

  const isValid = Object.keys(validationErrors).length === 0;

  const handleChange = <K extends keyof Project>(field: K, value: Project[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const ensureSelfInTeam = (ids: string[], roles: TeamMemberRole[] = []) => {
    if (!member?.id) return { ids, roles };
    const nextIds = ids.includes(member.id) ? ids : [...ids, member.id];
    return { ids: nextIds, roles };
  };

  const handleSave = async (asDraft = false) => {
    if (!isValid) {
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }

    setIsSaving(true);

    try {
      const previous = originalData ? (JSON.parse(originalData) as Project) : null;
      const ensuredTeam = ensureSelfInTeam(formData.teamMembers || [], formData.teamMemberRoles || []);
      const normalizedEndDate = formData.endDate?.trim() ? formData.endDate : undefined;
      const dataToSave = {
        ...formData,
        isFeatured: formData.isFeatured ?? false,
        ownerId: isNew ? user.id : formData.ownerId,
        teamMembers: ensuredTeam.ids,
        teamMemberRoles: ensuredTeam.roles,
        endDate: normalizedEndDate,
        status: asDraft ? 'draft' : formData.status === 'draft' ? 'ongoing' : formData.status,
        publishedAt: !asDraft && formData.status === 'draft' ? new Date().toISOString() : formData.publishedAt,
      } as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

      if (isNew) {
        const newProject = await mockDataService.createProject(dataToSave);
        if (!newProject) {
          toast.error('Failed to create project');
          return;
        }
        toast.success('Project created successfully!');
        await logMemberAction(
          {
            action: 'create',
            entityType: 'project',
            entityId: newProject.id,
            entitySlug: newProject.slug,
            entityName: newProject.title,
            message: `Created project "${newProject.title}"`,
            details: {
              status: newProject.status,
              visibility: newProject.visibility,
            },
          },
          user,
          member
        );
        navigate(`/member/project/${newProject.slug}`);
      } else if (formData.id) {
        const updated = await mockDataService.updateProject(formData.id, dataToSave);
        toast.success('Project updated successfully!');
        const mediaChanged = previous
          ? previous.thumbnail !== dataToSave.thumbnail ||
            previous.coverImage !== dataToSave.coverImage ||
            JSON.stringify(previous.images || []) !== JSON.stringify(dataToSave.images || [])
          : false;

        await logMemberAction(
          {
            action: 'update',
            entityType: 'project',
            entityId: updated?.id || formData.id,
            entitySlug: updated?.slug || formData.slug,
            entityName: updated?.title || formData.title,
            message: `Updated project "${updated?.title || formData.title}"`,
            details: {
              status: updated?.status || formData.status,
              visibility: updated?.visibility || formData.visibility,
            },
          },
          user,
          member
        );

        if (mediaChanged) {
          await logMemberAction(
            {
              action: 'media_update',
              entityType: 'project',
              entityId: updated?.id || formData.id,
              entitySlug: updated?.slug || formData.slug,
              entityName: updated?.title || formData.title,
              message: `Updated project media for "${updated?.title || formData.title}"`,
            },
            user,
            member
          );
        }
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

    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteProjectMedia(formData as Project);
      await mockDataService.deleteProject(formData.id);
      toast.success('Project deleted successfully!');
      await logMemberAction(
        {
          action: 'delete',
          entityType: 'project',
          entityId: formData.id,
          entitySlug: formData.slug,
          entityName: formData.title,
          message: `Deleted project "${formData.title}"`,
        },
        user,
        member
      );
      navigate('/member');
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  const handlePreview = () => {
    const previewUrl = isEdit ? `/portfolio/${formData.slug}?preview=true` : '#';
    if (previewUrl !== '#') {
      window.open(previewUrl, '_blank');
    } else {
      toast.info('Save the project first to preview');
    }
  };

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

  const headerActions = (
    <>
      <span
        className={`hidden sm:inline-flex px-3 py-1.5 rounded-full text-xs font-medium ${
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
      <button
        onClick={handlePreview}
        disabled={isNew}
        className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Preview
      </button>
      <button
        onClick={() => handleSave(false)}
        disabled={isSaving || !hasChanges}
        className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        {isSaving ? (
          <>
            <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Save
          </>
        )}
      </button>
      {isEdit && (
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </>
  );

  return (
    <MemberLayout
      title={isNew ? 'New Project' : 'Edit Project'}
      subtitle={isNew ? 'Create a new portfolio project' : formData.title}
      showBackButton
      onBack={() => navigate('/member')}
      actions={headerActions}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <CollapsibleSection
          title="Basic Information"
          description="Project title, description, and categorization"
          icon={<FileText className="w-5 h-5 text-blue-400" />}
          required
          defaultOpen
        >
          <div className="space-y-4">
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

            <SlugInput
              value={formData.slug || ''}
              onChange={(value) => handleChange('slug', value)}
              sourceValue={formData.title}
              existingSlugs={existingSlugs}
              currentSlug={isEdit ? formData.slug : undefined}
            />

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-white/60 text-sm mb-1.5">Category</label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value as Project['category'])}
                    className="w-full appearance-none px-3 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                    }}
                  >
                    {PROJECT_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value} className="bg-[#1a1a1a] text-white">
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1.5">Status</label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value as Project['status'])}
                    className="w-full appearance-none px-3 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                    }}
                  >
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s.value} value={s.value} className="bg-[#1a1a1a] text-white">
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1.5">Visibility</label>
                <div className="relative">
                  <select
                    value={formData.visibility}
                    onChange={(e) => handleChange('visibility', e.target.value as Project['visibility'])}
                    className="w-full appearance-none px-3 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 10px center',
                    }}
                  >
                    {VISIBILITY_OPTIONS.map((v) => (
                      <option key={v.value} value={v.value} className="bg-[#1a1a1a] text-white">
                        {v.label}
                      </option>
                    ))}
                    </select>
                  </div>
                </div>
              <div>
                <label className="block text-white/60 text-sm mb-1.5">Featured</label>
                <button
                  type="button"
                  onClick={() => handleChange('isFeatured', !formData.isFeatured)}
                  className={`w-full px-3 py-2 rounded-lg border text-sm flex items-center justify-between transition-all ${
                    formData.isFeatured
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
                  }`}
                >
                  <span>{formData.isFeatured ? 'Started / Featured' : 'Mark as Started'}</span>
                  <Star
                    className="w-4 h-4"
                    fill={formData.isFeatured ? 'currentColor' : 'none'}
                  />
                </button>
                <p className="text-white/30 text-xs mt-1">
                  Started projects appear in the home page Featured section.
                </p>
              </div>
            </div>

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

        <CollapsibleSection
          title="Media"
          description="Images, thumbnails, and gallery"
          icon={<Image className="w-5 h-5 text-purple-400" />}
          badge={formData.images?.length}
        >
          <div className="space-y-6">
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

            <GalleryImages
              images={formData.images || []}
              onChange={(images) => handleChange('images', images)}
            />
          </div>
        </CollapsibleSection>

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
              const ensured = ensureSelfInTeam(ids, roles || []);
              handleChange('teamMembers', ensured.ids);
              if (roles) handleChange('teamMemberRoles', ensured.roles);
            }}
          />
          {validationErrors.teamMembers && (
            <p className="text-red-400 text-xs mt-2">{validationErrors.teamMembers}</p>
          )}
        </CollapsibleSection>

        <CollapsibleSection
          title="Project Timeline"
          description="Start date, end date, and milestone tracking"
          icon={<Calendar className="w-5 h-5 text-cyan-400" />}
          badge={formData.timeline?.length}
        >
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 text-sm mb-1.5">
                  Start Date <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  value={formData.startDate || ''}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                />
                {validationErrors.startDate && (
                  <p className="text-red-400 text-xs mt-1">{validationErrors.startDate}</p>
                )}
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

        <CollapsibleSection
          title="Links & Resources"
          description="External links and resources"
          icon={<Link className="w-5 h-5 text-pink-400" />}
          badge={(formData.externalLinks?.length || 0) + (formData.githubUrl ? 1 : 0)}
        >
          <div className="space-y-4">
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
                    <div className="relative">
                      <select
                        value={link.type}
                        onChange={(e) => updateExternalLink(link.id, 'type', e.target.value)}
                        className="appearance-none px-3 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/10 cursor-pointer hover:bg-white/[0.07] transition-colors"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'right 8px center',
                        }}
                      >
                        <option value="documentation" className="bg-[#1a1a1a] text-white">Documentation</option>
                        <option value="reference" className="bg-[#1a1a1a] text-white">Reference</option>
                        <option value="article" className="bg-[#1a1a1a] text-white">Article</option>
                        <option value="other" className="bg-[#1a1a1a] text-white">Other</option>
                      </select>
                    </div>
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
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleSection>

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

      {/* Mobile Floating Save Button */}
      <button
        onClick={() => handleSave(false)}
        disabled={isSaving || !hasChanges}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white text-black shadow-lg shadow-black/30 flex items-center justify-center md:hidden disabled:opacity-50 disabled:cursor-not-allowed z-50"
        aria-label="Save project"
      >
        {isSaving ? (
          <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
      </button>
    </MemberLayout>
  );
}
