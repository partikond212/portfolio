import { siteConfig } from "@/shared/config/site";
import ContactSection from "@/widgets/contact/ui/ContactSection";
import Header from "@/widgets/header/ui/Header";
import Hero from "@/widgets/hero/ui/Hero";
import JsonLd from "@/widgets/hero/ui/JsonLd";
import ProjectsSection from "@/widgets/projects/ui/ProjectsSection";

export default async function Home() {
  return (
    <>
      <Header />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
            {
              "@type": "Person",
              name: siteConfig.name,
              url: siteConfig.url,
              jobTitle: "Веб-разработчик",
              sameAs: Object.values(siteConfig.social),
            },
          ],
        }}
      />

      <main>
        <Hero />
        <ProjectsSection />
        <ContactSection />
      </main>
    </>
  );
}
