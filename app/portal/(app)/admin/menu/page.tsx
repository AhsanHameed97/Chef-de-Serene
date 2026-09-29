import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { deleteMenuItemAction, toggleMenuItemAction } from '@/lib/actions/admin'
import { PageIntro } from '@/components/portal/PageIntro'
import { FormAlert } from '@/components/portal/forms'
import { ConfirmSubmit } from '@/components/admin/AutoSubmitSelect'

export const metadata: Metadata = { title: 'Menu', robots: { index: false } }

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> }

export default async function AdminMenuPage({ searchParams }: Props) {
  const params = await searchParams
  const items = await prisma.menuItem.findMany({
    orderBy: [{ active: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
    include: { _count: { select: { orderItems: true } } },
  })
  const notice = params.saved
    ? 'Dish saved. The public menu and client portals are updated.'
    : params.deleted
      ? 'Dish deleted.'
      : params.archived
        ? 'This dish appears in past orders, so it was archived (hidden) instead of deleted.'
        : null

  return (
    <>
      <PageIntro
        eyebrow="Concierge Admin"
        title="Rotating Weekly Menu"
        actions={
          <Link href="/portal/admin/menu/new" className="btn-gold">
            + New Dish
          </Link>
        }
      >
        Active dishes appear on /current-menu and in every client’s weekly selection.
      </PageIntro>

      {notice && (
        <div className="mt-6">
          <FormAlert state={{ ok: true, message: notice }} />
        </div>
      )}

      <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex gap-4 rounded-[4px] border bg-surface p-3 ${item.active ? 'border-line' : 'border-line/60 opacity-60'}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.imageUrl} alt="" className="h-24 w-28 shrink-0 rounded-[2px] object-cover brightness-90" />
            <div className="flex min-w-0 flex-1 flex-col">
              <p className="mono-label text-[9px] text-muted">
                {item.category} {item.active ? '' : '· Hidden'}
              </p>
              <Link href={`/portal/admin/menu/${item.id}`} className="mt-0.5 truncate font-serif text-[18px] tracking-[-0.01em] hover:text-gold">
                {item.title}
              </Link>
              <p className="truncate text-[12px] text-muted">{item.specs.join(' · ')}</p>
              <div className="mt-auto flex items-center gap-4 pt-2">
                <form action={toggleMenuItemAction}>
                  <input type="hidden" name="id" value={item.id} />
                  <button type="submit" className="mono-label text-[9.5px] text-gold hover:underline">
                    {item.active ? 'Hide' : 'Activate'}
                  </button>
                </form>
                <Link href={`/portal/admin/menu/${item.id}`} className="mono-label text-[9.5px] text-muted hover:text-alabaster">
                  Edit
                </Link>
                <form action={deleteMenuItemAction} className="ml-auto">
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmSubmit
                    message={item._count.orderItems > 0 ? 'This dish is in past orders and will be archived. Continue?' : 'Delete this dish permanently?'}
                    className="mono-label text-[9.5px] text-muted hover:text-danger"
                  >
                    Delete
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
