import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useLanguage } from '../../i18n/LanguageContext';

const POLICY = {
  en: {
    title: 'Privacy Policy',
    effective: 'Effective: June 2025',
    sections: [
      {
        heading: 'Overview',
        body: 'FitFlow is a local-first fitness planning app. Your personal data — workout plans, meals, check-ins, and body measurements — is stored exclusively on your device. We do not collect, transmit, or sell personal information.',
      },
      {
        heading: 'Data We Store (On-Device Only)',
        body: 'FitFlow stores the following data locally using your device\'s secure storage:\n\n• Personal profile (age, weight, height, fitness goal)\n• Generated workout and meal plans\n• Daily check-in logs (weight, workouts completed)\n• App preferences (language, units, notification settings)\n\nThis data never leaves your device unless you explicitly use the optional Cloud Sync feature (coming soon).',
      },
      {
        heading: 'Data We Do Not Collect',
        body: 'We do not collect:\n\n• Your name or email address\n• Location data\n• Usage analytics or crash reports\n• Device identifiers\n• Any data transmitted to our servers\n\nFitFlow works completely offline. No account is required.',
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
        heading: 'Children\'s Privacy',
        body: 'FitFlow does not knowingly collect personal information from children under 13. The app requires users to be at least 13 years of age during plan creation.',
      },
      {
        heading: 'Changes to This Policy',
        body: 'We may update this Privacy Policy as features change. Significant changes will be communicated through app update notes. Continued use of the app constitutes acceptance.',
      },
      {
        heading: 'Contact',
        body: 'Questions about this policy? Reach us at:\nsupport@fitflow.app',
      },
    ],
  },
  tr: {
    title: 'Gizlilik Politikası',
    effective: 'Geçerlilik: Haziran 2025',
    sections: [
      {
        heading: 'Genel Bakış',
        body: 'FitFlow, yerel-öncelikli bir fitness planlama uygulamasıdır. Kişisel verileriniz — antrenman planları, öğünler, günlük takipler ve vücut ölçümleri — yalnızca cihazınızda saklanır. Kişisel bilgilerinizi toplamıyor, iletmiyor veya satmıyoruz.',
      },
      {
        heading: 'Sakladığımız Veriler (Yalnızca Cihazda)',
        body: 'FitFlow aşağıdaki verileri cihazınızın güvenli depolama alanında yerel olarak saklar:\n\n• Kişisel profil (yaş, kilo, boy, fitness hedefi)\n• Oluşturulan antrenman ve beslenme planları\n• Günlük takip kayıtları (kilo, tamamlanan antrenmanlar)\n• Uygulama tercihleri (dil, birimler, bildirim ayarları)\n\nİsteğe bağlı Bulut Senkronizasyonunu (yakında) açıkça kullanmadığınız sürece bu veriler cihazınızdan çıkmaz.',
      },
      {
        heading: 'Toplamadığımız Veriler',
        body: 'Şunları toplamıyoruz:\n\n• Adınız veya e-posta adresiniz\n• Konum verileri\n• Kullanım analitiği veya kilitlenme raporları\n• Cihaz tanımlayıcıları\n• Sunucularımıza iletilen herhangi bir veri\n\nFitFlow tamamen çevrimdışı çalışır. Hesap gerekmez.',
      },
      {
        heading: 'İsteğe Bağlı Bulut Senkronizasyonu (Yakında)',
        body: 'Gelecekteki bir sürümde isteğe bağlı Bulut Senkronizasyonu sunulacaktır. Etkinleştirmeyi seçerseniz verileriniz aktarım sırasında şifrelenerek güvenli şekilde saklanacaktır. Bulut verilerinizi istediğiniz zaman silebilirsiniz. Bulut Senkronizasyonu kesinlikle isteğe bağlı olacak ve açık onay gerektirecektir.',
      },
      {
        heading: 'Plan PDF Paylaşımı',
        body: '"Planı Paylaş" düğmesine bastığınızda, FitFlow plan verilerinizden cihazınızda yerel olarak bir PDF oluşturur ve sistem paylaşım panelini açar. Bu PDF\'i nereye gönderdiğinize erişimimiz yoktur.',
      },
      {
        heading: 'Çocukların Gizliliği',
        body: 'FitFlow, 13 yaşın altındaki çocuklardan bilerek kişisel bilgi toplamaz. Uygulama, plan oluşturma sırasında kullanıcıların en az 13 yaşında olmasını gerektirir.',
      },
      {
        heading: 'Bu Politikadaki Değişiklikler',
        body: 'Özellikler değiştikçe bu Gizlilik Politikasını güncelleyebiliriz. Önemli değişiklikler uygulama güncelleme notlarıyla iletilecektir. Uygulamayı kullanmaya devam etmek kabulü oluşturur.',
      },
      {
        heading: 'İletişim',
        body: 'Bu politika hakkında sorularınız mı var? Bize ulaşın:\nsupport@fitflow.app',
      },
    ],
  },
};

export default function PrivacyModal() {
  const router = useRouter();
  const { lang, t } = useLanguage();
  const policy = POLICY[lang] ?? POLICY.en;
  const s = t.settings;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-slate-900">
      <ScrollView className="flex-1" contentContainerClassName="px-5 py-6">
        <View className="flex-row items-center justify-between mb-1">
          <Text
            className="text-xl font-bold text-slate-900 dark:text-white"
            accessibilityRole="header"
          >
            {policy.title}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700"
            accessibilityRole="button"
            accessibilityLabel={s.close}
          >
            <Text className="text-slate-600 dark:text-slate-300 font-medium text-sm">
              {s.close}
            </Text>
          </Pressable>
        </View>

        <Text className="text-xs text-slate-400 dark:text-slate-500 mb-6">
          {policy.effective}
        </Text>

        {policy.sections.map((section) => (
          <View key={section.heading} className="mb-6">
            <Text className="text-sm font-semibold text-slate-800 dark:text-white mb-2">
              {section.heading}
            </Text>
            <Text className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {section.body}
            </Text>
          </View>
        ))}

        <View className="mt-2 mb-4 p-4 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-800">
          <Text className="text-xs text-sky-700 dark:text-sky-300 leading-relaxed">
            {lang === 'tr'
              ? 'FitFlow, verilerinizi korumayı taahhüt eder. Uygulama hesap gerektirmeden ve internet bağlantısı olmadan tamamen çalışır.'
              : 'FitFlow is committed to protecting your data. The app works completely without an account or internet connection.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
