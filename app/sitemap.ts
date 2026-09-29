import type { MetadataRoute } from 'next'
import { appUrl } from '@/lib/url'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = appUrl()
  return ['', '/private-dining', '/meal-prep', '/current-menu', '/philosophy'].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === '/current-menu' ? 'weekly' : 'monthly',
    priority: path === '' ? 1 : 0.8,
  }))
}
