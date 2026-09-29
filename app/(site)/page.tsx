/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { HeroNav } from '@/components/site/SiteNav'
import { InquiryWizard } from '@/components/site/InquiryWizard'
import { GalleryTabs, HeroFrame, MoatRow } from '@/components/home/HomeInteractive'

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=900&auto=format&fit=crop`

const MARQUEE = [
  { src: unsplash('1414235077428-338989a2e8c0'), alt: 'Dish detail, dark editorial plating' },
  { src: unsplash('1543352632-5a4b24e4d2a6'), alt: 'Clean-label meals portioned in luxury glass containers', glass: true },
  { src: unsplash('1550966871-3ed3cdb5ed0c'), alt: 'Kitchen execution, chef plating in low light' },
  { src: unsplash('1467003909585-2f8a72700288'), alt: 'Fine dining table setting detail' },
]

const STAR = 'M20 4 L23.5 14.5 L34.5 14.5 L25.5 21 L29 31.5 L20 25 L11 31.5 L14.5 21 L5.5 14.5 L16.5 14.5 Z'

export default function HomePage() {
  return (
    <>
      {/* ================= HERO ================= */}
      <section className="hero-wrap">
        <HeroFrame>
          <div className="hero-bg">
            <img
              src="/assets/images/hero-estate-kitchen.webp"
              alt="Chef plating a performance meal prep protocol in luxury glass containers on a private estate kitchen island at dusk"
              fetchPriority="high"
            />
            <div className="hero-scrim" />
          </div>

          <HeroNav />

          <div className="hero-center" data-reveal>
            <span className="hero-tag">[ Michelin-Star Craft × Clinical Longevity ]</span>
            <h1 className="hero-word">
              Turn Daily Nutrition Into a <em>Silent Advantage.</em>
            </h1>
            <p className="hero-sub">
              Eliminate decision fatigue and protect longevity with dietitian-aligned fine dining and custom weekly meal prep&mdash;delivered
              across Los Angeles in luxury glassware.
            </p>
            <div className="cta-row">
              <Link href="/private-dining" className="btn btn-solid-gold">
                Private Estate Dining
              </Link>
              <Link href="/meal-prep" className="btn btn-glass">
                Weekly Meal Prep
              </Link>
            </div>
          </div>
        </HeroFrame>
      </section>

      {/* ================= CREDENTIAL BAR ================= */}
      <section className="credential-bar" id="credentials" data-reveal>
        <div className="credential-inner">
          <div className="badge">
            <div className="badge-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <path d={STAR} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="badge-title">Michelin Pedigree</p>
            <p className="badge-sub">Paris &bull; Nice &bull; Sicily</p>
          </div>
          <div className="badge-divider" />
          <div className="badge">
            <div className="badge-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M20 5 L32 10 V19 C32 27 27 32.5 20 35 C13 32.5 8 27 8 19 V10 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M14.5 19.5 L18 23 L26 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="badge-title">ACF Credentialed</p>
            <p className="badge-sub">American Culinary Federation</p>
          </div>
          <div className="badge-divider" />
          <div className="badge">
            <div className="badge-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <path d="M20 8 L35 15 L20 22 L5 15 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M12 18.5 V26 C12 28.5 15.5 31 20 31 C24.5 31 28 28.5 28 26 V18.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M35 15 V23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </div>
            <p className="badge-title">Ohio State Alumnus</p>
            <p className="badge-sub">Culinary &amp; Dietary Science</p>
          </div>
          <div className="badge-divider" />
          <div className="badge">
            <div className="badge-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="2.6" fill="currentColor" />
                <circle cx="10" cy="12" r="2" fill="currentColor" />
                <circle cx="30" cy="12" r="2" fill="currentColor" />
                <circle cx="10" cy="28" r="2" fill="currentColor" />
                <circle cx="30" cy="28" r="2" fill="currentColor" />
                <path d="M20 20 L10 12 M20 20 L30 12 M20 20 L10 28 M20 20 L30 28" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <p className="badge-title">Clinical RD Partner</p>
            <p className="badge-sub">Physician-Aligned Protocols</p>
          </div>
        </div>
      </section>

      {/* ================= DUAL SERVICE ================= */}
      <section className="services lux-glow" id="services">
        <div className="section-head" data-reveal>
          <h2>
            Choose Your <em>Engagement</em>
          </h2>
        </div>

        <div className="service-cards">
          <article className="service-card" id="estate-retainers" data-reveal>
            <Link href="/private-dining" className="card-arrow" aria-label="View estate retainer architecture">
              &#8599;
            </Link>
            <p className="card-tag mono">Full Residence Operations</p>
            <h3>Private Estate Culinary Management</h3>
            <p className="card-desc">
              Dedicated in-residence culinary operations, bespoke tasting menus, seasonal travel coverage (yachts, winter estates), and full
              household staff integration.
            </p>
            <ul className="feature-list">
              <li>Complete Household Discretion &amp; NDA Compliance</li>
              <li>Guest &amp; Private Event Tasting Menus</li>
              <li>Seamless Staff &amp; Butler Coordination</li>
            </ul>
            <Link href="/private-dining" className="card-link">
              Explore Private Dining <span aria-hidden="true">&rarr;</span>
            </Link>
          </article>

          <article className="service-card" id="meal-prep" data-reveal data-reveal-delay="120">
            <Link href="/meal-prep" className="card-arrow" aria-label="View meal prep protocols">
              &#8599;
            </Link>
            <p className="card-tag mono">Recurring Clinical Delivery</p>
            <h3>Performance Culinary Protocols</h3>
            <p className="card-desc">
              Daily or weekly bespoke meal delivery engineered directly from personal physician lab work, metabolic targets, and dietary
              parameters&mdash;delivered in sustainable luxury glassware.
            </p>
            <ul className="feature-list">
              <li>Licensed Dietitian (RD) Menu Co-Authoring</li>
              <li>Anti-Inflammatory, Circadian &amp; Athletic Recovery Focus</li>
              <li>Precision Portioned Macro &amp; Micro Density in Glassware</li>
            </ul>
            <Link href="/meal-prep" className="card-link">
              Explore Weekly Meal Prep <span aria-hidden="true">&rarr;</span>
            </Link>
          </article>
        </div>
      </section>

      {/* ================= POSITIONING MATRIX ================= */}
      <section className="matrix" id="positioning-matrix">
        <div className="section-head" data-reveal>
          <h2>
            The Chef de Serene <em>Difference</em>
          </h2>
          <p className="section-sub">Rejecting the extremes of sterile fitness prep and heavy restaurant dining.</p>
        </div>
        <div className="matrix-columns" data-reveal>
          <div className="matrix-col">
            <div className="matrix-col-header">Fitness Meal Prep</div>
            <div className="matrix-col-body">
              {['Dry, Sterile, Boring', 'Plastic Trays & Tupperware', 'Mass-Produced Rotation'].map((t) => (
                <div key={t} className="matrix-row">
                  <span className="matrix-icon matrix-icon-x">&#10005;</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="matrix-col matrix-col-highlight">
            <div className="matrix-col-header matrix-col-header-highlight">
              <svg viewBox="0 0 24 24" className="matrix-brand-icon" aria-hidden="true">
                <path d="M12 2 L14 9 L21 9 L15.5 13.5 L17.5 21 L12 16.5 L6.5 21 L8.5 13.5 L3 9 L10 9 Z" fill="currentColor" />
              </svg>
              Chef de Serene
            </div>
            <div className="matrix-col-body">
              {['Functional Fine Dining', 'Luxury Glassware & Bamboo Lids', 'Dietitian-Aligned Bespoke Macros'].map((t) => (
                <div key={t} className="matrix-row">
                  <span className="matrix-icon matrix-icon-check">&#10003;</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="matrix-col">
            <div className="matrix-col-header">Heavy Restaurants</div>
            <div className="matrix-col-body">
              {['Cream-Laden, Slowing', 'High-Sodium Takeout', 'Decision Fatigue & Inflammation'].map((t) => (
                <div key={t} className="matrix-row">
                  <span className="matrix-icon matrix-icon-x">&#10005;</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CLINICAL MOAT ================= */}
      <section className="moat" id="clinical-moat">
        <div className="section-head" data-reveal>
          <h2>
            Where Fine Dining Meets <em>Clinical Precision</em>
          </h2>
          <p className="section-sub">Why standard private chefs create gaps in high-performance household regimes.</p>
        </div>
        <div className="moat-list" data-reveal>
          <MoatRow>
            <div className="moat-icon">
              <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d={STAR} stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="moat-row-text">
              <h3>Michelin-Star Technique</h3>
              <p>Classical French and Mediterranean foundations executed with absolute visual and flavor precision inside private homes.</p>
            </div>
            <span className="moat-row-num">01</span>
          </MoatRow>
          <MoatRow>
            <div className="moat-icon">
              <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <circle cx="20" cy="20" r="2.4" fill="currentColor" />
                <circle cx="10" cy="11" r="1.8" fill="currentColor" />
                <circle cx="30" cy="11" r="1.8" fill="currentColor" />
                <circle cx="10" cy="29" r="1.8" fill="currentColor" />
                <circle cx="30" cy="29" r="1.8" fill="currentColor" />
                <path d="M20 20 L10 11 M20 20 L30 11 M20 20 L10 29 M20 20 L30 29" stroke="currentColor" strokeWidth="1.1" />
              </svg>
            </div>
            <div className="moat-row-text">
              <h3>Physician and Lab Synchronization</h3>
              <p>
                Menus designed around direct bloodwork, food sensitivities, and metabolic goals in direct partnership with a licensed
                Registered Dietitian.
              </p>
            </div>
            <span className="moat-row-num">02</span>
          </MoatRow>
          <MoatRow>
            <div className="moat-icon">
              <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                <path d="M20 5 L32 10 V19 C32 27 27 32.5 20 35 C13 32.5 8 27 8 19 V10 Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                <path d="M14.5 19.5 L18 23 L26 14.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="moat-row-text">
              <h3>Institutional-Grade Discretion</h3>
              <p>Ironclad confidentiality agreements, zero-profile social media policies, and vetted background clearances for high-security estates.</p>
            </div>
            <span className="moat-row-num">03</span>
          </MoatRow>
        </div>
      </section>

      {/* ================= GALLERY / TABS ================= */}
      <section className="gallery lux-glow" id="gallery">
        <div className="section-head" data-reveal>
          <h2>
            Plated Aesthetics &amp; <em>Sample Menu</em>
          </h2>
        </div>
        <GalleryTabs
          plated={
            <div className="image-marquee">
              <div className="image-marquee-track">
                {[...MARQUEE, ...MARQUEE].map((img, i) => (
                  <div key={i} className="marquee-card" aria-hidden={i >= MARQUEE.length || undefined}>
                    <img src={img.src} alt={i >= MARQUEE.length ? '' : img.alt} loading="lazy" className={img.glass ? 'glass-shot-img' : undefined} />
                  </div>
                ))}
              </div>
            </div>
          }
          clinical={
            <>
              <div className="menu-carousel">
                <div className="menu-carousel-track">
                  <article className="menu-dish-card">
                    <div className="menu-dish-media">
                      <img src="/assets/images/hero-estate-kitchen.webp" alt="Wild King Salmon Crudo plated in glass" loading="lazy" />
                      <span className="menu-course-num">I</span>
                    </div>
                    <div className="menu-dish-body">
                      <h4>Wild King Salmon Crudo</h4>
                      <p className="menu-course-desc">Fermented Yuzu, Avocado Oil Emulsion</p>
                      <div className="menu-specs">
                        <span className="menu-spec-pill">Rich in Omega&#8209;3</span>
                        <span className="menu-spec-pill">Low&#8209;Glycemic</span>
                        <span className="menu-spec-pill">Anti&#8209;Inflammatory</span>
                      </div>
                    </div>
                  </article>
                  <article className="menu-dish-card">
                    <div className="menu-dish-media">
                      <img src={unsplash('1414235077428-338989a2e8c0')} alt="Grass-Fed Bison Tenderloin plated" loading="lazy" />
                      <span className="menu-course-num">II</span>
                    </div>
                    <div className="menu-dish-body">
                      <h4>Grass&#8209;Fed Bison Tenderloin</h4>
                      <p className="menu-course-desc">Sunchoke Puree, Bone Marrow Reduction</p>
                      <div className="menu-specs">
                        <span className="menu-spec-pill">High Bioavailable Iron</span>
                        <span className="menu-spec-pill">Athletic Recovery Protocol</span>
                      </div>
                    </div>
                  </article>
                  <article className="menu-dish-card">
                    <div className="menu-dish-media">
                      <img src={unsplash('1642220618391-72214d19711c')} alt="Valrhona Dark Chocolate Fondant plated" loading="lazy" className="dessert-img" />
                      <span className="menu-course-num">III</span>
                    </div>
                    <div className="menu-dish-body">
                      <h4>Valrhona Dark Chocolate Fondant</h4>
                      <p className="menu-course-desc">Adaptogenic Cacao Nib Dust, Mushroom&#8209;Infused Ganache</p>
                      <div className="menu-specs">
                        <span className="menu-spec-pill">Antioxidant Dense</span>
                        <span className="menu-spec-pill">Low&#8209;Glycemic Sweetener</span>
                        <span className="menu-spec-pill">Adaptogenic Cognitive Support</span>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
              <div className="gallery-more">
                <Link href="/current-menu" className="btn btn-outline-gold">
                  View This Week&rsquo;s Full Menu &rarr;
                </Link>
              </div>
            </>
          }
        />
      </section>

      {/* ================= DISCRETION ================= */}
      <section className="discretion" id="discretion">
        <div className="section-head" data-reveal>
          <h2>
            Engineered for Family Offices &amp; <em>Estate Managers</em>
          </h2>
        </div>
        <div className="discretion-stage" data-reveal>
          <div className="discretion-bg">
            <img src="/assets/images/discretion-fire.webp" alt="" />
            <div className="discretion-scrim" />
          </div>
          <div className="discretion-grid">
            {[
              ['NDA Compliance', 'Standard or custom non-disclosure agreements executed prior to service kick-off.', 'card-up'],
              ['Background Cleared', 'Fully vetted personnel adhering to private estate security standards.', 'card-up'],
              ['Zero Digital Footprint', 'Complete privacy guarantee regarding private residence photos and family identity.', 'card-down'],
              ['Seamless Coordination', 'Direct operational reporting to Chiefs of Staff and Estate Managers.', 'card-down'],
            ].map(([title, body, pos], i) => (
              <div key={title} className={`discretion-card ${pos}`}>
                <div className="discretion-card-top">
                  <h4>{title}</h4>
                </div>
                <span className="discretion-num">{i + 1}</span>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BOOKING FORM (2-fork, Master Spec §1.5) ================= */}
      <section className="intake-prompt">
        <div className="intake-banner" id="inquiry" data-reveal>
          <div className="intake-banner-bg">
            <video autoPlay muted loop playsInline preload="metadata">
              <source src="/assets/videos/intake-bg.mp4" type="video/mp4" />
            </video>
            <div className="intake-banner-scrim" />
          </div>
          <div className="intake-banner-content">
            <div className="intake-banner-head">
              <h2 className="intake-banner-headline">
                Book Your <em>Private Chef</em>
              </h2>
              <p>Choose private dining or weekly meal prep, share a few details, and we&rsquo;ll confirm within one business day.</p>
            </div>
            <InquiryWizard />
          </div>
        </div>
      </section>
    </>
  )
}
