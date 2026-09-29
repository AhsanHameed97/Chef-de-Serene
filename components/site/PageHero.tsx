/* eslint-disable @next/next/no-img-element */
type Props = { image: string; imageAlt: string; tag: string; title: React.ReactNode; subtitle: string; children?: React.ReactNode }

/** Full-bleed 500px editorial banner used by the service pages (Master Spec §2.0 / §3.0). */
export function PageHero({ image, imageAlt, tag, title, subtitle, children }: Props) {
  return (
    <section className="page-hero">
      <div className="page-hero-bg">
        <img src={image} alt={imageAlt} fetchPriority="high" />
      </div>
      <div className="page-hero-content" data-reveal>
        <span className="hero-tag !mb-0">[ {tag} ]</span>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="mono-label text-[12.5px] text-gold">{children}</p>
}
