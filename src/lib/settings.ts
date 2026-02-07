// Site settings management using Supabase
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'thinkbuildlabs',
  contactEmail: 'contact@lab.edu',
  contactPhone: '+1 (555) 123-4567',
  contactAddress: 'Engineering Building, Room 405\nUniversity Campus, CA 94305',
  heroVideoUrl: 'https://ik.imagekit.io/asdflkj/Drone_Flying_Video_Generation.mp4?updatedAt=1770105351047',
  footerDescription: 'Pushing the boundaries of silicon and intelligence through innovative research and collaborative learning.',
  footerSocialLinks: [
    { platform: 'github', url: 'https://github.com' },
    { platform: 'linkedin', url: 'https://linkedin.com' },
    { platform: 'twitter', url: 'https://twitter.com' },
    { platform: 'instagram', url: 'https://instagram.com' },
  ],
};

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching site settings:', error);
    return DEFAULT_SETTINGS;
  }

  return data ? { ...DEFAULT_SETTINGS, ...data } : DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const { data: existing, error: existingError } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1)
    .maybeSingle();

  if (existingError) {
    console.error('Error checking site settings:', existingError);
  }

  if (existing?.id) {
    const { data, error } = await supabase
    .from('site_settings')
    .update({ ...settings, updatedAt: new Date().toISOString() })
    .eq('id', existing.id)
    .select()
    .single();

    if (error) {
      console.error('Error updating site settings:', error);
      return getSettings();
    }

    return { ...DEFAULT_SETTINGS, ...data };
  }

  const { data, error } = await supabase
    .from('site_settings')
    .insert({
      siteName: settings.siteName || DEFAULT_SETTINGS.siteName,
      contactEmail: settings.contactEmail || DEFAULT_SETTINGS.contactEmail,
      contactPhone: settings.contactPhone || DEFAULT_SETTINGS.contactPhone,
      contactAddress: settings.contactAddress || DEFAULT_SETTINGS.contactAddress,
      heroVideoUrl: settings.heroVideoUrl || DEFAULT_SETTINGS.heroVideoUrl,
      footerDescription: settings.footerDescription || DEFAULT_SETTINGS.footerDescription,
      footerSocialLinks: settings.footerSocialLinks || DEFAULT_SETTINGS.footerSocialLinks,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating site settings:', error);
    return DEFAULT_SETTINGS;
  }

  return { ...DEFAULT_SETTINGS, ...data };
}

export async function getHeroVideoUrl(): Promise<string> {
  const settings = await getSettings();
  return settings.heroVideoUrl;
}
