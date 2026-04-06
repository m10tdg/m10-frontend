import { NavbarWidget }       from '@/widgets/home/navbar'
import { HeroWidget }         from '@/widgets/home/hero'
import { FeaturesWidget }     from '@/widgets/home/features'
import { InnovationWidget }   from '@/widgets/home/innovation'
import { TestTypesWidget }    from '@/widgets/home/test-types'
import { TrustedByWidget }    from '@/widgets/home/trusted-by'
import { TestimonialsWidget } from '@/widgets/home/testimonials'
import { CtaBannerWidget }    from '@/widgets/home/cta-banner'
import { FooterWidget }       from '@/widgets/home/footer'

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