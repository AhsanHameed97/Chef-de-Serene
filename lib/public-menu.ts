import { getActiveMenu, toDishView, type DishView } from '@/lib/portal'
import { MENU_SEED } from '@/lib/menu-data'

/** Active menu for the public /current-menu page; falls back to the seed menu if the DB is unreachable. */
export async function getPublicMenu(): Promise<{ dishes: DishView[]; live: boolean }> {
  try {
    const items = await getActiveMenu()
    return { dishes: items.map(toDishView), live: true }
  } catch (err) {
    console.error('[current-menu] database unavailable, showing seed menu', err)
    return { dishes: MENU_SEED.map((d, i) => ({ id: `seed-${i}`, ...d })), live: false }
  }
}
