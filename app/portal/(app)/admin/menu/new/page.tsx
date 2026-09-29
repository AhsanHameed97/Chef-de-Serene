import type { Metadata } from 'next'
import Link from 'next/link'
import { PageIntro } from '@/components/portal/PageIntro'
import { MenuItemForm } from '@/components/admin/MenuItemForm'

export const metadata: Metadata = { title: 'New Dish', robots: { index: false } }

export default function NewMenuItemPage() {
  return (
    <>
      <PageIntro eyebrow="Rotating Weekly Menu" title="New Dish" />
      <div className="mt-8">
        <MenuItemForm
          initial={{
            title: '',
            description: '',
            imageUrl: '',
            category: '',
            specs: '',
            calories: '',
            proteinG: '',
            carbsG: '',
            fatG: '',
            sortOrder: '0',
            active: 'true',
          }}
        />
      </div>
      <Link href="/portal/admin/menu" className="mono-label mt-8 inline-block text-[10px] text-muted hover:text-gold">
        ← Back to menu
      </Link>
    </>
  )
}
