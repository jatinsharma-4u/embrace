import Page from '../components/Page'
import Hero from '../components/home/Hero'
import { Appointment, Bestsellers, CraftStory, Creations, IconCollections, Marquee, NewIn, Testimonials } from '../components/home/Sections'

export default function Home({ booted }) {
  return (
    <Page className="page--home">
      <Hero booted={booted} />
      <Creations />
      <NewIn />
      <IconCollections />
      <Bestsellers />
      <CraftStory />
      <Marquee />
      <Testimonials />
      <Appointment />
    </Page>
  )
}
