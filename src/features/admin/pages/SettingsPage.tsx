import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Globe, Mail, Phone, MapPin, Video, FileText, Link2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { getSettings, saveSettings } from '@/lib/settings';
import { logAdminAction } from '@/lib/activityLogs';
import type { SiteSettings, SocialLink } from '@/types';
import { SOCIAL_PLATFORMS } from '@/types';

export function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    heroVideoUrl: '',
    footerDescription: '',
    footerSocialLinks: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newSocial, setNewSocial] = useState<{ platform: SocialLink['platform']; url: string }>({
    platform: 'linkedin',
    url: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    const loaded = await getSettings();
    setSettings(loaded);
    setIsLoading(false);
  };

  const handleChange = <K extends keyof SiteSettings>(field: K, value: SiteSettings[K]) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const addSocialLink = () => {
    if (!newSocial.url.trim()) return;

    const filtered = settings.footerSocialLinks?.filter((s) => s.platform !== newSocial.platform) || [];
    handleChange('footerSocialLinks', [
      ...filtered,
      { platform: newSocial.platform, url: newSocial.url.trim() },
    ]);
    setNewSocial({ platform: 'linkedin', url: '' });
  };

  const removeSocialLink = (platform: SocialLink['platform']) => {
    handleChange(
      'footerSocialLinks',
      settings.footerSocialLinks?.filter((s) => s.platform !== platform) || []
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSettings(settings);
      toast.success('Settings saved successfully!');
      await logAdminAction({
        action: 'update',
        entityType: 'site_settings',
        entityId: settings.id,
        entityName: settings.siteName,
        message: 'Updated site settings',
      });
      window.dispatchEvent(new Event('site-settings-updated'));
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const headerActions = (
    <button
      onClick={handleSave}
      disabled={isSaving}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm disabled:opacity-50"
    >
      <Save className="w-4 h-4" />
      {isSaving ? 'Saving...' : 'Save Changes'}
    </button>
  );

  if (isLoading) {
    return (
      <AdminLayout title="Settings" subtitle="Manage site configuration">
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="glass rounded-xl h-96 animate-pulse" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Site Settings" subtitle="Manage website configuration and contact details" actions={headerActions}>
      <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Site Info */}
          <section className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <h3 className="text-white font-medium">Site Information</h3>
                <p className="text-white/40 text-sm">Basic website details</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Site Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  placeholder="VLSI & AI Robotics Lab"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                />
              </div>
            </div>
          </section>

          {/* Contact Info */}
          <section className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Mail className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <h3 className="text-white font-medium">Contact Information</h3>
                <p className="text-white/40 text-sm">How visitors can reach you</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Contact Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="contact@lab.edu"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="tel"
                    value={settings.contactPhone || ''}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Contact Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-white/30" />
                  <textarea
                    value={settings.contactAddress || ''}
                    onChange={(e) => handleChange('contactAddress', e.target.value)}
                    placeholder="Engineering Building, Room 405&#10;University Campus, CA 94305"
                    rows={3}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Hero Video */}
          <section className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <Video className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <h3 className="text-white font-medium">Hero Video</h3>
                <p className="text-white/40 text-sm">Background video for homepage</p>
              </div>
            </div>

            <div>
              <label className="block text-white/60 text-sm mb-2">YouTube Video URL</label>
              <input
                type="url"
                value={settings.heroVideoUrl || ''}
                onChange={(e) => handleChange('heroVideoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
              />
              <p className="text-white/30 text-xs mt-2">
                Leave empty to use the default animated background
              </p>
            </div>
          </section>

          {/* Footer */}
          <section className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white/60" />
              </div>
              <div>
                <h3 className="text-white font-medium">Footer Content</h3>
                <p className="text-white/40 text-sm">Footer description and social links</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-white/60 text-sm mb-2">Footer Description</label>
                <textarea
                  value={settings.footerDescription || ''}
                  onChange={(e) => handleChange('footerDescription', e.target.value)}
                  placeholder="Short description displayed in the footer"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-white/60 text-sm mb-2">Social Links</label>
                
                {/* Existing links */}
                <div className="space-y-2 mb-4">
                  {settings.footerSocialLinks?.map((link) => (
                    <div
                      key={link.platform}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                    >
                      <Link2 className="w-4 h-4 text-white/40" />
                      <span className="text-white text-sm capitalize">{link.platform}</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 text-white/40 text-sm hover:text-white/60 truncate"
                      >
                        {link.url}
                      </a>
                      <button
                        onClick={() => removeSocialLink(link.platform)}
                        className="p-1.5 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new link */}
                <div className="flex gap-2">
                  <select
                    value={newSocial.platform}
                    onChange={(e) => setNewSocial({ ...newSocial, platform: e.target.value as SocialLink['platform'] })}
                    className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-white/20"
                  >
                    {SOCIAL_PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value} className="bg-[#1a1a1a]">
                        {p.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="url"
                    value={newSocial.url}
                    onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                    placeholder="https://..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-white/20"
                  />
                  <button
                    onClick={addSocialLink}
                    disabled={!newSocial.url.trim()}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg text-white text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
