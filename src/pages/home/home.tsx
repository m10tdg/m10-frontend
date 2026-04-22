import { NavbarWidget }       from '@/pages/home/components/navbar'
import { HeroWidget }         from '@/pages/home/components/hero'
import { FeaturesWidget }     from '@/pages/home/components/features'
import { InnovationWidget }   from '@/pages/home/components/innovation'
import { TestTypesWidget }    from '@/pages/home/components/test-types'
import { TrustedByWidget }    from '@/pages/home/components/trusted-by'
import { TestimonialsWidget } from '@/pages/home/components/testimonials'
import { CtaBannerWidget }    from '@/pages/home/components/cta-banner'
import { FooterWidget }       from '@/pages/home/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-bg font-sans">
      <NavbarWidget />
      <main>
        <HeroWidget />
        <FeaturesWidget />
        <InnovationWidget />
        <TestTypesWidget />
        <TrustedByWidget />
        <TestimonialsWidget />
        <CtaBannerWidget />
      </main>
      <FooterWidget />
    </div>
  )
}