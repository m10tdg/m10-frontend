import type { Lang } from "@/shared/stores/types";

export const aboutHelpTranslations = {
  en: {
    about: {
      eyebrow: "About M10",
      title: "Better software starts with better testing.",
      subtitle:
        "M10 helps teams bring clarity and confidence to software quality. Bring test workflows, useful insights, and collaboration together in one platform.",
      missionTitle: "Our mission",
      missionDescription:
        "Make reliable software testing easier to adopt, easier to understand, and a natural part of every team's development process.",
      principlesTitle: "A clearer path to quality",
      principles: [
        {
          title: "Test with confidence",
          description:
            "Run tests across browsers and environments, then review results in one place.",
        },
        {
          title: "See what changed",
          description:
            "Use visual comparisons and test reports to spot changes and make informed decisions.",
        },
        {
          title: "Work as one team",
          description:
            "Keep developers, testers, and stakeholders connected throughout the testing process.",
        },
      ],
      ctaTitle: "Want to learn more about M10?",
      ctaDescription: "Our team would be happy to answer your questions.",
      contact: "Contact us",
      help: "Visit the Help Center",
    },
    help: {
      eyebrow: "Help Center",
      title: "How can we help?",
      subtitle:
        "Find answers to common questions about getting started with M10 and managing your testing workflow.",
      gettingStarted: "Getting started",
      gettingStartedDescription:
        "Sign in to your M10 workspace to access the tools and projects available to your account. If you need access, contact your workspace administrator.",
      questionsTitle: "Frequently asked questions",
      questions: [
        {
          question: "What can I test with M10?",
          answer:
            "M10 supports software quality workflows such as live testing, visual regression, page analysis, performance checks, and accessibility testing. The tools available depend on your workspace setup.",
        },
        {
          question: "How do I run a test?",
          answer:
            "Open the relevant testing tool in your workspace, choose the project and options you need, and start the run. Your workspace may provide different test types and settings.",
        },
        {
          question: "Where can I find test results?",
          answer:
            "After a run completes, review its results and reports in the corresponding test area of your workspace. Some reports may be available as secure, time-limited downloads.",
        },
        {
          question: "I can't access a feature. What should I do?",
          answer:
            "Feature access can depend on your role and workspace configuration. Ask your workspace administrator to check your permissions or contact the M10 team for help.",
        },
      ],
      stillNeedHelp: "Still need help?",
      contactDescription:
        "Send our team a message and include any details that can help us understand your question.",
      contact: "Contact support",
      about: "About M10",
    },
  },
  tr: {
    about: {
      eyebrow: "M10 Hakkında",
      title: "Daha iyi yazılım, daha iyi testlerle başlar.",
      subtitle:
        "M10, ekiplerin yazılım kalitesini daha anlaşılır ve güvenilir hale getirmesine yardımcı olur. Test süreçlerini, faydalı içgörüleri ve ekip çalışmasını tek bir platformda buluşturur.",
      missionTitle: "Misyonumuz",
      missionDescription:
        "Güvenilir yazılım testlerini benimsemeyi ve anlamayı kolaylaştırmak; testleri her ekibin geliştirme sürecinin doğal bir parçası haline getirmek.",
      principlesTitle: "Kaliteye giden daha açık bir yol",
      principles: [
        {
          title: "Güvenle test edin",
          description:
            "Farklı tarayıcı ve ortamlarda testler çalıştırın, sonuçları tek bir yerden inceleyin.",
        },
        {
          title: "Değişiklikleri görün",
          description:
            "Değişiklikleri fark etmek ve bilinçli kararlar almak için görsel karşılaştırmalardan ve test raporlarından yararlanın.",
        },
        {
          title: "Ekip olarak çalışın",
          description:
            "Test süreci boyunca geliştiricileri, test uzmanlarını ve paydaşları bir arada tutun.",
        },
      ],
      ctaTitle: "M10 hakkında daha fazla bilgi mi istiyorsunuz?",
      ctaDescription: "Ekibimiz sorularınızı yanıtlamaktan memnuniyet duyar.",
      contact: "Bize ulaşın",
      help: "Yardım Merkezi'ni ziyaret edin",
    },
    help: {
      eyebrow: "Yardım Merkezi",
      title: "Size nasıl yardımcı olabiliriz?",
      subtitle:
        "M10'u kullanmaya başlama ve test süreçlerinizi yönetme hakkında sık sorulan soruların yanıtlarını bulun.",
      gettingStarted: "Başlarken",
      gettingStartedDescription:
        "Hesabınızda sunulan araçlara ve projelere erişmek için M10 çalışma alanınızda oturum açın. Erişime ihtiyacınız varsa çalışma alanı yöneticinizle iletişime geçin.",
      questionsTitle: "Sık sorulan sorular",
      questions: [
        {
          question: "M10 ile neleri test edebilirim?",
          answer:
            "M10; canlı test, görsel regresyon, sayfa analizi, performans kontrolleri ve erişilebilirlik testleri gibi yazılım kalite süreçlerini destekler. Kullanılabilir araçlar çalışma alanınızın yapılandırmasına bağlıdır.",
        },
        {
          question: "Bir testi nasıl çalıştırabilirim?",
          answer:
            "Çalışma alanınızdaki ilgili test aracını açın, proje ve gerekli seçenekleri belirleyin ve çalıştırmayı başlatın. Kullanabileceğiniz test türleri ve ayarlar çalışma alanınıza göre değişebilir.",
        },
        {
          question: "Test sonuçlarını nerede bulabilirim?",
          answer:
            "Çalıştırma tamamlandıktan sonra sonuçları ve raporları çalışma alanınızdaki ilgili test bölümünden inceleyin. Bazı raporlar güvenli ve süreli indirme bağlantılarıyla sunulabilir.",
        },
        {
          question: "Bir özelliğe erişemiyorum. Ne yapmalıyım?",
          answer:
            "Özelliklere erişim rolünüze ve çalışma alanı ayarlarınıza bağlı olabilir. İzinlerinizi kontrol etmesi için çalışma alanı yöneticinizle veya destek için M10 ekibiyle iletişime geçin.",
        },
      ],
      stillNeedHelp: "Yardıma mı ihtiyacınız var?",
      contactDescription:
        "Sorunuzu anlamamıza yardımcı olacak ayrıntılarla birlikte ekibimize mesaj gönderin.",
      contact: "Destek ekibiyle iletişime geçin",
      about: "M10 Hakkında",
    },
  },
  de: {
    about: {
      eyebrow: "Über M10",
      title: "Bessere Software beginnt mit besseren Tests.",
      subtitle:
        "M10 unterstützt Teams dabei, Softwarequalität klarer und zuverlässiger zu gestalten. Testabläufe, hilfreiche Einblicke und Zusammenarbeit kommen auf einer Plattform zusammen.",
      missionTitle: "Unsere Mission",
      missionDescription:
        "Zuverlässiges Softwaretesten leichter zugänglich und verständlich zu machen und als selbstverständlichen Teil des Entwicklungsprozesses zu etablieren.",
      principlesTitle: "Ein klarerer Weg zu Qualität",
      principles: [
        {
          title: "Mit Zuversicht testen",
          description:
            "Führen Sie Tests in verschiedenen Browsern und Umgebungen aus und prüfen Sie die Ergebnisse an einem Ort.",
        },
        {
          title: "Änderungen erkennen",
          description:
            "Nutzen Sie visuelle Vergleiche und Testberichte, um Änderungen zu erkennen und fundierte Entscheidungen zu treffen.",
        },
        {
          title: "Als Team zusammenarbeiten",
          description:
            "Halten Sie Entwickler, Tester und Beteiligte während des gesamten Testprozesses auf dem Laufenden.",
        },
      ],
      ctaTitle: "Möchten Sie mehr über M10 erfahren?",
      ctaDescription: "Unser Team beantwortet gerne Ihre Fragen.",
      contact: "Kontakt",
      help: "Zum Help Center",
    },
    help: {
      eyebrow: "Help Center",
      title: "Wie können wir helfen?",
      subtitle:
        "Hier finden Sie Antworten auf häufige Fragen zum Einstieg in M10 und zur Verwaltung Ihrer Testabläufe.",
      gettingStarted: "Erste Schritte",
      gettingStartedDescription:
        "Melden Sie sich in Ihrem M10-Arbeitsbereich an, um auf die für Ihr Konto verfügbaren Tools und Projekte zuzugreifen. Wenn Sie Zugriff benötigen, wenden Sie sich an die Administration Ihres Arbeitsbereichs.",
      questionsTitle: "Häufig gestellte Fragen",
      questions: [
        {
          question: "Was kann ich mit M10 testen?",
          answer:
            "M10 unterstützt Software-Qualitätsabläufe wie Live-Tests, visuelle Regressionstests, Seitenanalysen, Leistungstests und Barrierefreiheitstests. Die verfügbaren Tools hängen von der Konfiguration Ihres Arbeitsbereichs ab.",
        },
        {
          question: "Wie führe ich einen Test aus?",
          answer:
            "Öffnen Sie das passende Test-Tool in Ihrem Arbeitsbereich, wählen Sie das gewünschte Projekt und die Optionen aus und starten Sie den Test. Testarten und Einstellungen können je nach Arbeitsbereich variieren.",
        },
        {
          question: "Wo finde ich Testergebnisse?",
          answer:
            "Nach Abschluss eines Tests können Sie Ergebnisse und Berichte im entsprechenden Testbereich Ihres Arbeitsbereichs ansehen. Einige Berichte stehen möglicherweise über sichere, zeitlich begrenzte Download-Links bereit.",
        },
        {
          question: "Ich kann nicht auf eine Funktion zugreifen. Was soll ich tun?",
          answer:
            "Der Zugriff auf Funktionen kann von Ihrer Rolle und der Konfiguration des Arbeitsbereichs abhängen. Bitten Sie die Administration, Ihre Berechtigungen zu prüfen, oder wenden Sie sich an das M10-Team.",
        },
      ],
      stillNeedHelp: "Benötigen Sie weitere Hilfe?",
      contactDescription:
        "Schreiben Sie unserem Team und fügen Sie Details hinzu, die uns helfen, Ihre Frage zu verstehen.",
      contact: "Support kontaktieren",
      about: "Über M10",
    },
  },
} satisfies Record<
  Lang,
  {
    about: {
      eyebrow: string;
      title: string;
      subtitle: string;
      missionTitle: string;
      missionDescription: string;
      principlesTitle: string;
      principles: { title: string; description: string }[];
      ctaTitle: string;
      ctaDescription: string;
      contact: string;
      help: string;
    };
    help: {
      eyebrow: string;
      title: string;
      subtitle: string;
      gettingStarted: string;
      gettingStartedDescription: string;
      questionsTitle: string;
      questions: { question: string; answer: string }[];
      stillNeedHelp: string;
      contactDescription: string;
      contact: string;
      about: string;
    };
  }
>;
