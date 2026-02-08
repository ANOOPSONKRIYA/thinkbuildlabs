import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  Target,
  Save,
  Plus,
  Trash2,
  BarChart3,
  History,
  Building2,
  Image as ImageIcon,
  Users,
  Sparkles,
  Link,
  Star,
} from 'lucide-react';

import type { AboutData, Facility, HistoryEvent, Partner, Stat } from '@/types';
import { mockDataService } from '@/lib/dataService';
import { logAdminAction } from '@/lib/activityLogs';
import { deleteFileByUrl } from '@/lib/supabase';

import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { CollapsibleSection } from '@/features/admin/components/forms/CollapsibleSection';
import { ImageUpload, GalleryImages } from '@/features/admin/components/forms/ImageUpload';

const emptyAbout: AboutData = {
  id: '',
  mission: '',
  vision: '',
  description: '',
  stats: [],
  history: [],
  facilities: [],
  partners: [],
  gallery: [],
};

const createId = () =>
  (typeof crypto !== 'undefined' && 'randomUUID' in crypto && crypto.randomUUID()) ||
  Math.random().toString(36).slice(2);

export function AboutAdminPage() {
  const [aboutData, setAboutData] = useState<AboutData>(emptyAbout);
  const [originalData, setOriginalData] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await mockDataService.getAboutData();
        const normalized = data
          ? {
              ...data,
              gallery: data.gallery || [],
              stats: data.stats || [],
              history: data.history || [],
              facilities: data.facilities || [],
              partners: data.partners || [],
            }
          : emptyAbout;
        setAboutData(normalized);
        setOriginalData(JSON.stringify(normalized));
      } catch (error) {
        toast.error('Failed to load about page data');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  const hasChanges = useMemo(() => JSON.stringify(aboutData) !== originalData, [aboutData, originalData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...aboutData,
        id: aboutData.id || undefined,
        gallery: aboutData.gallery || [],
        stats: aboutData.stats || [],
        history: aboutData.history || [],
        facilities: aboutData.facilities || [],
        partners: aboutData.partners || [],
      };
      const saved = await mockDataService.saveAboutData(payload);
      if (saved) {
        const normalized = {
          ...saved,
          gallery: saved.gallery || [],
          stats: saved.stats || [],
          history: saved.history || [],
          facilities: saved.facilities || [],
          partners: saved.partners || [],
        };
        setAboutData(normalized);
        setOriginalData(JSON.stringify(normalized));
      }
      toast.success('About page updated');
      await logAdminAction({
        action: 'update',
        entityType: 'about',
        entityId: saved?.id || 'about',
        entityName: 'About page',
        message: 'Updated About page content',
      });
    } catch (error) {
      toast.error('Failed to save about page');
    } finally {
      setIsSaving(false);
    }
  };

  const updateStat = (id: string, field: keyof Stat, value: string) => {
    setAboutData((prev) => ({
      ...prev,
      stats: prev.stats.map((stat) => (stat.id === id ? { ...stat, [field]: value } : stat)),
    }));
  };

  const addStat = () => {
    setAboutData((prev) => ({
      ...prev,
      stats: [...prev.stats, { id: createId(), label: 'New Metric', value: '0', icon: 'CheckCircle' }],
    }));
  };

  const removeStat = (id: string) => {
    setAboutData((prev) => ({
      ...prev,
      stats: prev.stats.filter((stat) => stat.id !== id),
    }));
  };

  const updateHistory = <K extends keyof HistoryEvent>(id: string, field: K, value: HistoryEvent[K]) => {
    setAboutData((prev) => ({
      ...prev,
      history: prev.history.map((event) => (event.id === id ? { ...event, [field]: value } : event)),
    }));
  };

  const addHistory = () => {
    setAboutData((prev) => ({
      ...prev,
      history: [
        ...prev.history,
        { id: createId(), year: new Date().getFullYear().toString(), title: 'New milestone', description: '', milestone: true },
      ],
    }));
  };

  const removeHistory = (id: string) => {
    setAboutData((prev) => ({
      ...prev,
      history: prev.history.filter((event) => event.id !== id),
    }));
  };

  const updateFacility = (id: string, field: keyof Facility, value: string) => {
    setAboutData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((facility) => (facility.id === id ? { ...facility, [field]: value } : facility)),
    }));
  };

  const addFacility = () => {
    setAboutData((prev) => ({
      ...prev,
      facilities: [
        ...prev.facilities,
        { id: createId(), name: 'New Facility', description: '', image: '' },
      ],
    }));
  };

  const removeFacility = async (id: string) => {
    const facility = aboutData.facilities.find((f) => f.id === id);
    if (facility?.image) {
      await deleteFileByUrl(facility.image);
    }
    setAboutData((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((facility) => facility.id !== id),
    }));
  };

  const updatePartner = (id: string, field: keyof Partner, value: string) => {
    setAboutData((prev) => ({
      ...prev,
      partners: prev.partners.map((partner) => (partner.id === id ? { ...partner, [field]: value } : partner)),
    }));
  };

  const addPartner = () => {
    setAboutData((prev) => ({
      ...prev,
      partners: [...prev.partners, { id: createId(), name: 'New Partner', logo: '', website: '' }],
    }));
  };

  const removePartner = async (id: string) => {
    const partner = aboutData.partners.find((p) => p.id === id);
    if (partner?.logo) {
      await deleteFileByUrl(partner.logo);
    }
    setAboutData((prev) => ({
      ...prev,
      partners: prev.partners.filter((partner) => partner.id !== id),
    }));
  };

  const headerActions = (
    <button
      onClick={handleSave}
      disabled={isSaving || !hasChanges}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50"
    >
      <Save className="w-4 h-4" />
      {isSaving ? 'Saving...' : 'Save Changes'}
    </button>
  );

  if (isLoading) {
    return (
      <AdminLayout title="About Page" subtitle="Manage About page content" actions={headerActions}>
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span className="text-white/60">Loading...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="About Page" subtitle="Manage About page content" actions={headerActions}>
      <div className="p-4 sm:p-6 lg:p-8 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto space-y-6"
        >
          <CollapsibleSection
            title="Mission, Vision & Overview"
            description="Core story that appears at the top of the About page"
            icon={<Target className="w-5 h-5 text-emerald-400" />}
            defaultOpen
            required
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Mission</label>
                  <textarea
                    value={aboutData.mission}
                    onChange={(e) => setAboutData((prev) => ({ ...prev, mission: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">Vision</label>
                  <textarea
                    value={aboutData.vision}
                    onChange={(e) => setAboutData((prev) => ({ ...prev, vision: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/60 text-sm mb-1.5">Lab Overview</label>
                <textarea
                  value={aboutData.description}
                  onChange={(e) => setAboutData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Key Stats"
            description="Numbers that represent the lab"
            icon={<BarChart3 className="w-5 h-5 text-blue-400" />}
            badge={aboutData.stats.length}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.stats.map((stat) => (
                  <div key={stat.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-white/60 text-sm">Stat</span>
                      <button
                        type="button"
                        onClick={() => removeStat(stat.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                        title="Remove stat"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-3">
                      <input
                        value={stat.label}
                        onChange={(e) => updateStat(stat.id, 'label', e.target.value)}
                        placeholder="Label"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                      />
                      <input
                        value={stat.value}
                        onChange={(e) => updateStat(stat.id, 'value', e.target.value)}
                        placeholder="Value"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                      />
                      <input
                        value={stat.icon}
                        onChange={(e) => updateStat(stat.id, 'icon', e.target.value)}
                        placeholder="Icon (Lucide name, e.g., CheckCircle)"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addStat}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Stat
              </button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Timeline"
            description="Milestones and journey highlights"
            icon={<History className="w-5 h-5 text-amber-400" />}
            badge={aboutData.history.length}
          >
            <div className="space-y-4">
              <div className="space-y-3">
                {aboutData.history.map((event) => (
                  <div key={event.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-white/60 text-sm">Milestone</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateHistory(event.id, 'milestone', !event.milestone)}
                          className={`px-2.5 py-1 rounded-full text-xs flex items-center gap-1 ${
                            event.milestone ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/5 text-white/60'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5" fill={event.milestone ? 'currentColor' : 'none'} />
                          {event.milestone ? 'Milestone' : 'Standard'}
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHistory(event.id)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                          title="Remove milestone"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <input
                        value={event.year}
                        onChange={(e) => updateHistory(event.id, 'year', e.target.value)}
                        placeholder="Year"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                      />
                      <input
                        value={event.title}
                        onChange={(e) => updateHistory(event.id, 'title', e.target.value)}
                        placeholder="Title"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20 md:col-span-3"
                      />
                      <textarea
                        value={event.description}
                        onChange={(e) => updateHistory(event.id, 'description', e.target.value)}
                        placeholder="Description"
                        rows={3}
                        className="md:col-span-4 w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addHistory}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Timeline Event
              </button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Facilities"
            description="Spaces, labs, and equipment highlights"
            icon={<Building2 className="w-5 h-5 text-cyan-400" />}
            badge={aboutData.facilities.length}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.facilities.map((facility) => (
                  <div key={facility.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Facility</span>
                      <button
                        type="button"
                        onClick={() => void removeFacility(facility.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                        title="Remove facility"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <ImageUpload
                      value={facility.image}
                      onChange={(value) => updateFacility(facility.id, 'image', value)}
                      label="Image"
                      aspectRatio="wide"
                      description="Upload a facility photo"
                    />
                    <input
                      value={facility.name}
                      onChange={(e) => updateFacility(facility.id, 'name', e.target.value)}
                      placeholder="Name"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                    />
                    <textarea
                      value={facility.description}
                      onChange={(e) => updateFacility(facility.id, 'description', e.target.value)}
                      placeholder="Description"
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addFacility}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Facility
              </button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            title="Gallery"
            description="Image gallery for the About page"
            icon={<ImageIcon className="w-5 h-5 text-purple-400" />}
            badge={aboutData.gallery.length}
          >
            <GalleryImages
              images={aboutData.gallery || []}
              onChange={(gallery) => setAboutData((prev) => ({ ...prev, gallery }))}
              label="Gallery Images"
            />
          </CollapsibleSection>

          <CollapsibleSection
            title="Partners & Collaborators"
            description="Logos and links for key partners"
            icon={<Users className="w-5 h-5 text-pink-400" />}
            badge={aboutData.partners.length}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.partners.map((partner) => (
                  <div key={partner.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/60 text-sm">Partner</span>
                      <button
                        type="button"
                        onClick={() => void removePartner(partner.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                        title="Remove partner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <ImageUpload
                      value={partner.logo}
                      onChange={(value) => updatePartner(partner.id, 'logo', value)}
                      label="Logo"
                      aspectRatio="square"
                      description="Upload a logo (square works best)"
                    />
                    <input
                      value={partner.name}
                      onChange={(e) => updatePartner(partner.id, 'name', e.target.value)}
                      placeholder="Name"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                    />
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4 text-white/40" />
                      <input
                        value={partner.website || ''}
                        onChange={(e) => updatePartner(partner.id, 'website', e.target.value)}
                        placeholder="https://partner.com"
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addPartner}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Partner
              </button>
            </div>
          </CollapsibleSection>

          <div className="glass rounded-xl p-4 sm:p-5 border border-white/10">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <div>
                <p className="text-white text-sm font-semibold">Tip</p>
                <p className="text-white/50 text-xs">
                  Use the "Featured" toggles on projects and members to control what appears on the home page. Gallery images here will help keep storage tidy because we delete old files when you remove or replace them.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
