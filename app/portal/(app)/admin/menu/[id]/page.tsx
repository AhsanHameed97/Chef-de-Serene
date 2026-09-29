import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { PageIntro } from '@/components/portal/PageIntro'
import { MenuItemForm } from '@/components/admin/MenuItemForm'

export const metadata: Metadata = { title: 'Edit Dish', robots: { index: false } }

const s = (n: number | null) => (n == null ? '' : String(n))

export default async function EditMenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await prisma.menuItem.findUnique({ where: { id } })
  if (!item) notFound()

  return (
    <>
      <PageIntro eyebrow="Rotating Weekly Menu" title={item.title} />
      <div className="mt-8">
        <MenuItemForm
          initial={{
            id: item.id,
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            category: item.category,
            specs: item.specs.join(', '),
            calories: s(item.calories),
            proteinG: s(item.proteinG),
            carbsG: s(item.carbsG),
            fatG: s(item.fatG),
            sortOrder: String(item.sortOrder),
            active: String(item.active),
          }}
        />
      </div>
      <Link href="/portal/admin/menu" className="mono-label mt-8 inline-block text-[12px] text-muted hover:text-gold">
        ← Back to menu
      </Link>
    </>
  )
}
