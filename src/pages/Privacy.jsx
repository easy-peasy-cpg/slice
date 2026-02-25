import { Link } from 'react-router-dom'
import HomeNav from '../components/home/HomeNav'
import HomeFooter from '../components/home/HomeFooter'

const lastUpdated = 'February 25, 2026'

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <HomeNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mt-2">Last updated: {lastUpdated}</p>

        <div className="mt-10 prose prose-slate prose-sm max-w-none
          prose-headings:text-slate-900 prose-headings:font-semibold prose-headings:tracking-tight
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-li:text-slate-600
          prose-strong:text-slate-800
        ">
          <p>
            Slice is operated by Piece of Pie (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting
            your privacy and the confidentiality of your business data. This policy explains what
            information we collect, how we use it, and the measures we take to keep it safe.
          </p>

          <h2>Your Data Belongs to You</h2>
          <p>
            Your Whole Foods sales data, QuickSight exports, and any files you upload remain <strong>100% yours</strong>.
            We do not sell, share, license, or otherwise distribute your data to any third party — ever.
            Your data is used solely to power the Slice features you use, and for no other purpose.
          </p>
          <ul>
            <li>We <strong>never</strong> sell your data to advertisers, brokers, or competitors.</li>
            <li>We <strong>never</strong> use your data to train AI models outside of your account.</li>
            <li>We <strong>never</strong> aggregate your data with other customers&apos; data.</li>
            <li>If you delete your account, your data is permanently deleted within 30 days.</li>
          </ul>

          <h2>What We Collect</h2>

          <h3>Account Information</h3>
          <p>
            When you sign up, we collect your name and email address. If you sign in with Google,
            we receive only your name, email, and profile photo from Google — we never receive or
            store your Google password. We use this information solely to authenticate your account
            and communicate with you about your subscription.
          </p>

          <h3>Sales Data You Upload</h3>
          <p>
            When you upload Whole Foods QuickSight CSV exports, we process and store that data to
            generate your dashboards, rankings, void alerts, promo analysis, and AI insights.
            This data is encrypted at rest and in transit (AES-256 and TLS 1.2+). Access is
            restricted to your account only — no other customer or Slice employee can view your data
            without your explicit permission.
          </p>

          <h3>Payment Information</h3>
          <p>
            Payment processing is handled entirely by <strong>Stripe</strong>, a PCI DSS Level 1
            certified payment processor. Your credit card number, expiration date, and CVC are sent
            directly to Stripe and <strong>never touch our servers</strong>. We only receive a
            tokenized reference, your card&apos;s last four digits, and billing status from Stripe.
          </p>

          <h3>Usage Data</h3>
          <p>
            We collect basic usage analytics (pages visited, features used, session duration) to
            improve Slice. This data is anonymized and cannot be used to identify you personally.
            We do not use third-party tracking pixels, ad networks, or behavioral advertising tools.
          </p>

          <h2>How We Protect Your Data</h2>
          <ul>
            <li><strong>Encryption at rest:</strong> All data is encrypted using AES-256 in our database (Supabase, hosted on AWS).</li>
            <li><strong>Encryption in transit:</strong> All connections use TLS 1.2 or higher. There is no unencrypted access to any Slice service.</li>
            <li><strong>Row-level security:</strong> Database access policies ensure that each user can only query their own data — enforced at the database level, not just the application level.</li>
            <li><strong>No shared access:</strong> Your data is isolated from every other customer. There are no shared tables, no cross-account queries, and no unrestricted admin access. All internal database access requires explicit authorization and is logged.</li>
            <li><strong>Infrastructure:</strong> Hosted on Vercel (frontend) and Supabase/AWS (backend), both SOC 2 Type II compliant.</li>
          </ul>

          <h2>Competitive Firewall</h2>
          <p>
            Piece of Pie&apos;s founding team includes CPG operators. We understand that your sales data
            is competitively sensitive, and we enforce strict internal controls to ensure it is never
            misused:
          </p>
          <ul>
            <li>No employee, contractor, or founder of Piece of Pie may access, review, or use any customer data for competitive intelligence, product development outside of Slice, or any purpose unrelated to operating and supporting the Slice platform.</li>
            <li>All internal access to customer data is logged and auditable. Access logs are retained for a minimum of one year.</li>
            <li>Direct access to customer data is limited to support and debugging purposes and requires the customer&apos;s explicit permission or an active support request.</li>
            <li>Any violation of this firewall policy by a Piece of Pie team member is grounds for immediate termination and legal liability.</li>
          </ul>

          <h2>AI Features</h2>
          <p>
            Slice&apos;s AI features (Ask Slice, AI Analysis) send portions of your data to
            Anthropic&apos;s Claude API for processing. This data is:
          </p>
          <ul>
            <li>Sent over encrypted connections (TLS 1.2+).</li>
            <li><strong>Not used to train Anthropic&apos;s models.</strong> We use Anthropic&apos;s commercial API, which has a zero-retention data policy.</li>
            <li>Not stored by Anthropic beyond the duration of the API request.</li>
          </ul>

          <h2>Google Sign-In</h2>
          <p>
            If you choose to sign in with Google, we use Google OAuth 2.0 through Supabase Auth.
            We request only the minimum scopes needed: your email address and basic profile
            information. We do <strong>not</strong> request access to your Google Drive, Gmail,
            Calendar, or any other Google service. You can revoke Slice&apos;s access at any time from
            your <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-sidebar hover:underline">Google Account settings</a>.
          </p>

          <h2>Cookies</h2>
          <p>
            Slice uses only essential cookies required for authentication (session tokens). We do
            not use advertising cookies, tracking cookies, or any third-party cookies. There is no
            cross-site tracking.
          </p>

          <h2>Data Retention & Deletion</h2>
          <p>
            Your data is retained for as long as your account is active. You can delete individual
            datasets at any time from the Settings page. If you cancel your subscription or delete
            your account, all associated data — including uploaded files, generated reports, and
            AI conversation history — is permanently deleted from our systems within 30 days.
          </p>

          <h2>Third-Party Services</h2>
          <p>We use a limited number of trusted third-party services:</p>
          <ul>
            <li><strong>Supabase</strong> (database & authentication) — SOC 2 Type II, hosted on AWS</li>
            <li><strong>Vercel</strong> (hosting) — SOC 2 Type II</li>
            <li><strong>Stripe</strong> (payments) — PCI DSS Level 1</li>
            <li><strong>Anthropic</strong> (AI processing) — zero-retention commercial API</li>
          </ul>
          <p>We do not share your data with any other third parties.</p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> all data we hold about you.</li>
            <li><strong>Export</strong> your data at any time.</li>
            <li><strong>Delete</strong> your data and account.</li>
            <li><strong>Correct</strong> any inaccurate information.</li>
            <li><strong>Withdraw consent</strong> for data processing at any time by closing your account.</li>
          </ul>

          <h2>Changes to This Policy</h2>
          <p>
            If we make material changes to this policy, we will notify you by email at least 30
            days before the changes take effect. Minor clarifications or formatting changes may be
            made without notice.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this privacy policy or how your data is handled, contact us
            at <a href="mailto:privacy@pieceofpiecpg.com" className="text-sidebar hover:underline">privacy@pieceofpiecpg.com</a>.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <Link to="/" className="text-sm text-sidebar font-medium hover:underline">
            &larr; Back to Home
          </Link>
        </div>
      </div>

      <HomeFooter />
    </div>
  )
}
