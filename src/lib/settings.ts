// Site settings management using Supabase
import { supabase } from '@/lib/supabase';
import type { SiteSettings } from '@/types';

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'VLSI & AI Robotics Lab',
  contactEmail: 'contact@lab.edu',
  heroVideoUrl: 'https://ik.imagekit.io/asdflkj/Drone_Flying_Video_Generation.mp4?updatedAt=1770105351047',
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
      heroVideoUrl: settings.heroVideoUrl || DEFAULT_SETTINGS.heroVideoUrl,
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
