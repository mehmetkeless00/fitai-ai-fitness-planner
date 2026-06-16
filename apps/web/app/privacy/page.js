import Navigation from '@/components/layout/Navigation';
import Container from '@/components/layout/Container';
import HomeFooter from '@/components/layout/HomeFooter';

export const metadata = {
  title: 'Privacy Policy',
  description: 'FitFlow Privacy Policy — how we handle your data.',
};

const SECTIONS = [
  {
    heading: 'Overview',
    body: 'FitFlow is a local-first fitness planning app. Your personal data — workout plans, meals, check-ins, and body measurements — is stored exclusively on your device. We do not collect, transmit, or sell personal information.',
  },
  {
    heading: 'Data We Store (On-Device Only)',
    body: null,
    list: [
      'Personal profile (age, weight, height, fitness goal)',
      'Generated workout and meal plans',
      'Daily check-in logs (weight, workouts completed)',
      'App preferences (language, units, notification settings)',
    ],
    listNote: 'This data never leaves your device unless you explicitly enable the optional Cloud Sync feature (coming soon).',
  },
  {
    heading: 'Data We Do Not Collect',
    body: null,
    list: [
      'Your name or email address',
      'Location data',
      'Usage analytics or crash reports',
      'Device identifiers',
      'Any data transmitted to our servers',
    ],
    listNote: 'FitFlow works completely offline. No account is required.',
  },
  {
    heading: 'Optional Cloud Sync (Coming Soon)',
    body: 'A future release will offer optional Cloud Sync. If you choose to enable it, your data will be encrypted in transit and stored securely. You can delete your cloud data at any time. Cloud Sync will be strictly opt-in and will require explicit consent.',
  },
  {
    heading: 'Plan PDF Sharing',
    body: 'When you tap "Share Plan," FitFlow generates a PDF from your plan data locally on your device and opens your system share sheet. We do not have access to where you send this PDF.',
  },
  {
    heading: "Children's Privacy",
    body: 'FitFlow does not knowingly collect personal information from children under 13. The app requires users to be at least 13 years of age during plan creation.',
  },
  {
    heading: 'Changes to This Policy',
    body: 'We may update this Privacy Policy as features change. Significant changes will be communicated through app update notes. Continued use of the app constitutes acceptance.',
  },
  {
    heading: 'Contact',
    body: null,
    contact: 'support@fitflow.app',
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen pt-24 pb-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Privacy Policy
              </h1>
              <p className="text-sm text-slate-400">Effective: June 2025</p>
            </div>

            {/* Highlight box */}
            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 rounded-xl p-5 mb-10">
              <p className="text-sm text-sky-800 dark:text-sky-200 leading-relaxed font-medium">
                FitFlow is local-first. Your data stays on your device. No account required.
                No personal information collected.
              </p>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {SECTIONS.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-3">
                    {section.heading}
                  </h2>

                  {section.body && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {section.body}
                    </p>
                  )}

                  {section.list && (
                    <>
                      <ul className="space-y-1.5 mb-3">
                        {section.list.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"
                          >
                            <span className="text-sky-500 mt-0.5 shrink-0">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      {section.listNote && (
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                          {section.listNote}
                        </p>
                      )}
                    </>
                  )}

                  {section.contact && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      Questions about this policy? Email us at{' '}
                      <a
                        href={`mailto:${section.contact}`}
                        className="text-sky-500 hover:underline"
                      >
                        {section.contact}
                      </a>
                    </p>
                  )}

                  <div className="mt-6 border-b border-slate-100 dark:border-slate-800" />
                </section>
              ))}
            </div>
          </div>
        </Container>
      </main>
      <HomeFooter />
    </>
  );
}
