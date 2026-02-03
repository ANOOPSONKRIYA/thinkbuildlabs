import { Hero } from '@/features/public/sections/Hero';
import { FeaturedProjects } from '@/features/public/sections/FeaturedProjects';
import { FeaturedTeam } from '@/features/public/sections/FeaturedTeam';
import { Stats } from '@/features/public/sections/Stats';

export function Home() {
  return (
    <main className="relative">
      <Hero />
      <FeaturedProjects />
      <Stats />
      <FeaturedTeam />
    </main>
  );
}
