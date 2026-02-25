import { Link } from 'react-router-dom'
import {
  ShieldCheckIcon,
  LockClosedIcon,
  ServerStackIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline'

const trustBadges = [
  { icon: LockClosedIcon, label: 'AES-256 Encryption', detail: 'Data encrypted at rest & in transit' },
  { icon: ShieldCheckIcon, label: 'SOC 2 Infrastructure', detail: 'Hosted on Vercel & AWS' },
  { icon: CreditCardIcon, label: 'Stripe Payments', detail: 'PCI DSS Level 1 certified' },
  { icon: ServerStackIcon, label: 'Row-Level Security', detail: 'Your data is isolated & private' },
]

const productLinks = [
  { label: 'Sales Dashboard', href: '#features' },
  { label: 'Void Detection', href: '#features' },
  { label: 'Store Rankings', href: '#features' },
  { label: 'Promo Analysis', href: '#features' },
  { label: 'Ask Slice AI', href: '#features' },
  { label: 'Sales Deck', href: '#features' },
]

const companyLinks = [
  { label: 'Pricing', href: '#pricing' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Contact Us', href: 'mailto:hello@pieceofpiecpg.com' },
]

export default function HomeFooter() {
  return (
    <footer className="bg-sidebar">
      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-cta" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                  <p className="text-xs text-white/50 mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <span className="text-xl font-bold text-white tracking-tight">Slice</span>
            <p className="text-sm text-white/50 mt-2 max-w-sm leading-relaxed">
              Whole Foods Sales Intelligence for CPG brands. Upload your QuickSight data and get
              instant dashboards, void alerts, and AI-powered insights.
            </p>
            <div className="mt-5 p-3 bg-white/5 rounded-lg border border-white/10 max-w-sm">
              <div className="flex items-start gap-2">
                <ShieldCheckIcon className="w-4 h-4 text-cta shrink-0 mt-0.5" />
                <p className="text-xs text-white/60 leading-relaxed">
                  We never sell, share, or use your data to train AI models.
                  Your Whole Foods data stays yours — always.
                  <Link to="/privacy" className="text-cta hover:underline ml-1">
                    Read our privacy policy
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {companyLinks.map(({ label, href, to }) => (
                <li key={label}>
                  {to ? (
                    <Link to={to} className="text-sm text-white/50 hover:text-white transition-colors">
                      {label}
                    </Link>
                  ) : (
                    <a href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                to="/login"
                className="text-sm text-cta font-medium hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/30">
              &copy; {new Date().getFullYear()} Piece of Pie. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:hello@pieceofpiecpg.com" className="text-xs text-white/30 hover:text-white/60 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
