'use client';

import Container from '@/components/layout/Container';
import { useLanguage } from '@/components/layout/LanguageProvider';

export default function HomeFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-50 dark:bg-dark-surface border-t border-slate-200 dark:border-dark-border py-8 mt-12 md:mt-20">
      <Container className="text-center text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
        <p>© {new Date().getFullYear()} {t.footer.copyright}</p>
      </Container>
    </footer>
  );
}
