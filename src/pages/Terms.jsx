import { Link } from 'react-router-dom'
import HomeNav from '../components/home/HomeNav'
import HomeFooter from '../components/home/HomeFooter'

const lastUpdated = 'February 25, 2026'

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <HomeNav />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 mt-2">Last updated: {lastUpdated}</p>

        <div className="mt-10 prose prose-slate prose-sm max-w-none
          prose-headings:text-slate-900 prose-headings:font-semibold prose-headings:tracking-tight
          prose-p:text-slate-600 prose-p:leading-relaxed
          prose-li:text-slate-600
          prose-strong:text-slate-800
        ">
          <h2>Acceptance of Terms</h2>
          <p>
            By accessing or using Slice (&quot;the Service&quot;), operated by Piece of Pie (&quot;we,&quot; &quot;our,&quot;
            or &quot;us&quot;), you agree to be bound by these Terms of Service. If you do not agree to these
            terms, do not use the Service. If you are using the Service on behalf of a company or
            other legal entity, you represent that you have the authority to bind that entity to
            these terms.
          </p>

          <h2>Service Description</h2>
          <p>
            Slice is a sales intelligence platform for CPG brands selling at Whole Foods Market.
            The Service processes Whole Foods QuickSight CSV exports to provide dashboards, store
            rankings, void detection, promotional analysis, AI-powered insights, and sales deck
            generation. Features may be added, modified, or retired at our discretion.
          </p>

          <h2>Account Responsibilities</h2>
          <p>
            You are responsible for maintaining the security of your account credentials and for all
            activity that occurs under your account. You must:
          </p>
          <ul>
            <li>Provide accurate and complete registration information.</li>
            <li>Keep your login credentials confidential and not share them with unauthorized parties.</li>
            <li>Notify us immediately at <a href="mailto:security@pieceofpiecpg.com" className="text-sidebar hover:underline">security@pieceofpiecpg.com</a> if you suspect unauthorized access to your account.</li>
          </ul>
          <p>
            We are not liable for any loss or damage arising from unauthorized use of your account
            where you have failed to safeguard your credentials.
          </p>

          <h2>Data Ownership</h2>
          <p>
            <strong>You retain full ownership of all data you upload to Slice.</strong> By uploading
            data, you grant Piece of Pie a limited, non-exclusive, revocable license to process,
            store, and display that data solely for the purpose of providing and improving the
            Service to you. We do not acquire any ownership interest in your data. Upon termination
            of your account, this license ends and your data is deleted in accordance with our
            data retention policy.
          </p>

          <h2>Confidentiality</h2>
          <p>
            Piece of Pie treats all data uploaded to Slice — including sales figures, store-level
            performance, pricing, promotional results, and any derived analytics — as
            <strong> confidential trade secrets</strong> belonging to you. We will not disclose your
            data to any third party except as required by law (in which case we will notify you
            promptly unless prohibited by the legal order), or to the limited set of infrastructure
            providers described in our <Link to="/privacy" className="text-sidebar hover:underline">Privacy Policy</Link>.
          </p>

          <h2>Competitive Firewall</h2>
          <p>
            We maintain a strict competitive firewall as detailed in our <Link to="/privacy" className="text-sidebar hover:underline">Privacy Policy</Link>.
            No employee, contractor, or founder of Piece of Pie may access, review, or use any
            customer data for competitive intelligence, product development outside of Slice, or
            any purpose unrelated to operating and supporting the platform. This commitment is
            enforceable and any violation constitutes grounds for immediate termination and legal
            liability. All internal data access is logged and auditable.
          </p>

          <h2>Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Use the Service for any unlawful purpose or in violation of any applicable law or regulation.</li>
            <li>Scrape, crawl, or use automated means to extract data from the Service beyond what is provided through our intended interface.</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service.</li>
            <li>Attempt to gain unauthorized access to other users&apos; accounts or data.</li>
            <li>Upload malicious files, viruses, or any content intended to disrupt the Service.</li>
            <li>Resell, sublicense, or redistribute access to the Service without our written consent.</li>
            <li>Use the Service to build a competing product or service.</li>
          </ul>

          <h2>Payment &amp; Billing</h2>
          <p>
            Slice is offered on a subscription basis. By subscribing, you authorize Piece of Pie to
            charge the payment method on file through our payment processor, <strong>Stripe</strong>,
            at the then-current subscription rate. All fees are quoted in U.S. dollars unless
            otherwise stated.
          </p>
          <ul>
            <li>Subscriptions renew automatically at the end of each billing period unless canceled before the renewal date.</li>
            <li>You may cancel your subscription at any time from your account Settings page. Cancellation takes effect at the end of the current billing period — no prorated refunds are issued for partial periods.</li>
            <li>We reserve the right to change pricing with at least 30 days&apos; notice before your next billing cycle. Continued use of the Service after a price change constitutes acceptance of the new pricing.</li>
          </ul>

          <h2>Service Availability</h2>
          <p>
            We strive to maintain high availability of the Service but do not guarantee uninterrupted
            or error-free operation. The Service is provided &quot;as is&quot; and &quot;as available.&quot; We may
            perform scheduled maintenance with reasonable advance notice when possible. We are not
            liable for any downtime, data delays, or service interruptions caused by factors beyond
            our reasonable control, including third-party provider outages and force majeure events.
          </p>

          <h2>Data Retention &amp; Deletion</h2>
          <p>
            Your data is retained for as long as your account is active. Upon cancellation or
            account deletion:
          </p>
          <ul>
            <li>All uploaded files, generated reports, AI conversation history, and derived analytics are permanently deleted from our systems within 30 days.</li>
            <li>Aggregated, anonymized usage statistics that cannot identify you or your business may be retained for product improvement purposes.</li>
            <li>You may request a full data export before canceling your account by contacting <a href="mailto:support@pieceofpiecpg.com" className="text-sidebar hover:underline">support@pieceofpiecpg.com</a>.</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Piece of Pie&apos;s total aggregate
            liability to you for any claims arising out of or related to the Service is limited to
            the amount you paid us in the twelve (12) months immediately preceding the event giving
            rise to the claim. In no event shall Piece of Pie be liable for any indirect, incidental,
            special, consequential, or punitive damages, including lost profits, lost revenue, lost
            data, or business interruption, regardless of the theory of liability.
          </p>

          <h2>Termination</h2>
          <p>
            Either party may terminate this agreement at any time. You may terminate by canceling
            your subscription and deleting your account. We may terminate or suspend your access
            immediately if you violate these Terms, or with 30 days&apos; notice for any other reason.
            Upon termination, your right to use the Service ceases immediately, and your data will
            be deleted in accordance with the Data Retention &amp; Deletion section above.
          </p>

          <h2>Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of the State of
            Delaware, without regard to its conflict of law provisions. Any disputes arising under
            or in connection with these Terms shall be subject to the exclusive jurisdiction of the
            courts located in Delaware.
          </p>

          <h2>Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. For material changes, we will notify you
            by email at least 30 days before the changes take effect. Minor clarifications or
            formatting changes may be made without notice. Your continued use of the Service after
            changes take effect constitutes acceptance of the revised Terms.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about these Terms of Service, contact us at{' '}
            <a href="mailto:legal@pieceofpiecpg.com" className="text-sidebar hover:underline">legal@pieceofpiecpg.com</a>.
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
