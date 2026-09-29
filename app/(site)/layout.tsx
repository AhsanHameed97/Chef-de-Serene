import { InquiryProvider } from '@/components/site/InquiryContext'
import { SiteNav } from '@/components/site/SiteNav'
import { SiteFooter } from '@/components/site/SiteFooter'
import { RevealObserver } from '@/components/site/RevealObserver'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <InquiryProvider>
      <div className="site">
        <SiteNav />
        <main id="top">{children}</main>
        <SiteFooter />
      </div>
      <RevealObserver />
      <noscript>
        <style>{'[data-reveal]{opacity:1!important;transform:none!important}'}</style>
      </noscript>
    </InquiryProvider>
  )
}
