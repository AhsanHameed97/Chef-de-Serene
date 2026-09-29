'use client'

import { useActionState, useState } from 'react'
import { saveMenuItemAction } from '@/lib/actions/admin'
import { Field, FormAlert, SubmitButton, invalid } from '@/components/portal/forms'
import { MENU_FILTERS } from '@/lib/menu-data'

export type MenuFormValues = {
  id?: string
  title: string
  description: string
  imageUrl: string
  category: string
  specs: string
  calories: string
  proteinG: string
  carbsG: string
  fatG: string
  sortOrder: string
  active: string
}

export function MenuItemForm({ initial }: { initial: MenuFormValues }) {
  const [state, formAction] = useActionState(saveMenuItemAction, undefined)
  const v = { ...initial, ...(state?.values ?? {}) }
  const e = state?.errors ?? {}
  const [preview, setPreview] = useState(v.imageUrl)

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[1fr_340px]" noValidate>
      {initial.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        {state?.message && (
          <div className="sm:col-span-2">
            <FormAlert state={state} />
          </div>
        )}
        <Field label="Dish Title" htmlFor="title" error={e.title} className="sm:col-span-2">
          <input id="title" name="title" defaultValue={v.title} className="field-input" {...invalid(state, 'title')} />
        </Field>
        <Field label="Description & Ingredients" htmlFor="description" error={e.description} className="sm:col-span-2">
          <textarea
            id="description"
            name="description"
            rows={2}
            defaultValue={v.description}
            placeholder="Fermented Yuzu, Avocado Oil Emulsion, Sea Cured Botanicals"
            className="field-input resize-y"
            {...invalid(state, 'description')}
          />
        </Field>
        <Field
          label="Photo"
          htmlFor="imageUrl"
          error={e.imageUrl}
          hint="Upload real photography to /public/assets/menu/ and enter /assets/menu/file.jpg — or paste an https:// URL."
          className="sm:col-span-2"
        >
          <input
            id="imageUrl"
            name="imageUrl"
            defaultValue={v.imageUrl}
            onBlur={(ev) => setPreview(/^(\/|https:\/\/)/.test(ev.target.value) ? ev.target.value : '')}
            className="field-input"
            {...invalid(state, 'imageUrl')}
          />
        </Field>
        <Field label="Category" htmlFor="category" error={e.category}>
          <input
            id="category"
            name="category"
            defaultValue={v.category}
            placeholder="Protein Anchor"
            className="field-input"
            {...invalid(state, 'category')}
          />
        </Field>
        <Field label="Sort Order" htmlFor="sortOrder" hint="Lower numbers appear first.">
          <input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={v.sortOrder} className="field-input" />
        </Field>
        <Field
          label="Clinical Spec Tags"
          htmlFor="specs"
          hint={`Comma-separated. Filterable tags: ${MENU_FILTERS.join(', ')}.`}
          className="sm:col-span-2"
        >
          <input
            id="specs"
            name="specs"
            defaultValue={v.specs}
            placeholder="High Omega-3, Low-Glycemic, Anti-Inflammatory"
            className="field-input"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4 sm:col-span-2 sm:grid-cols-4">
          {(
            [
              ['calories', 'Calories'],
              ['proteinG', 'Protein (g)'],
              ['carbsG', 'Carbs (g)'],
              ['fatG', 'Fat (g)'],
            ] as const
          ).map(([name, label]) => (
            <Field key={name} label={label} htmlFor={name} error={e[name]}>
              <input id={name} name={name} type="number" min={0} defaultValue={v[name]} className="field-input" />
            </Field>
          ))}
        </div>
        <label className="flex items-center gap-3 text-[14px] text-muted sm:col-span-2">
          <input type="checkbox" name="active" defaultChecked={v.active === 'true'} className="h-4 w-4 accent-[#C5A059]" />
          Active on this week’s menu (visible on /current-menu and in client portals)
        </label>
        <div className="sm:col-span-2">
          <SubmitButton pendingLabel="Saving…">{initial.id ? 'Save Dish' : 'Add Dish to Menu'}</SubmitButton>
        </div>
      </div>

      <aside className="h-fit overflow-hidden rounded-[4px] border border-line bg-surface">
        <div className="aspect-[4/3] bg-elevated">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Dish preview" className="h-full w-full object-cover brightness-[0.85]" />
          ) : (
            <div className="flex h-full items-center justify-center mono-label text-[10px] text-muted">No photo yet</div>
          )}
        </div>
        <p className="mono-label p-4 text-[9.5px] text-muted">Card preview</p>
      </aside>
    </form>
  )
}
