import { Link } from 'react-router-dom'
import Page from '../components/Page'
import PageHero from '../components/PageHero'
import { IconArrowRight } from '../components/Icons'

export default function NotFound() {
  return (
    <Page title="Page not found">
      <PageHero
        eyebrow="Error 404"
        title="A missing"
        script="treasure"
        text="The page you were looking for has been moved or no longer exists."
        decor={[{ src: '/img/p/emerald_10.webp' }, { src: '/img/p/jewelry_6750.webp' }]}
        size="lg"
      >
        <div className="phero__actions">
          <Link to="/" className="btn btn--peach">
            Return home <IconArrowRight />
          </Link>
          <Link to="/shop" className="btn btn--ghost-light">
            Shop the collection
          </Link>
        </div>
      </PageHero>
    </Page>
  )
}
