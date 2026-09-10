"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Stats } from "@/components/Stats";
import { Services } from "@/components/Services";
import { Projects } from "@/components/Projects";
import { TechEcosystem } from "@/components/TechEcosystem";
import { Blog } from "@/components/Blog";
import { TestimonialsContact } from "@/components/TestimonialsContact";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { CommandPalette } from "@/components/CommandPalette";
import { Preloader } from "@/components/Preloader";
import { CustomCursor } from "@/components/CustomCursor";
import { personalInfo, projects } from "@/lib/data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: personalInfo.name,
      jobTitle: personalInfo.title,
      description: personalInfo.about,
      url: siteUrl,
      image: `${siteUrl}/profile.png`,
      email: `mailto:${personalInfo.email}`,
      address: { "@type": "PostalAddress", addressLocality: "Nagpur", addressCountry: "IN" },
      knowsAbout: ["Full-stack development", "Artificial intelligence", "React", "Next.js", "Python", "Product engineering"],
      sameAs: [personalInfo.github, personalInfo.linkedin, personalInfo.twitter],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "Rishi Pandey Portfolio",
      url: siteUrl,
      description: "Portfolio of Rishi Pandey, a full-stack developer and AI engineer.",
      publisher: { "@id": `${siteUrl}/#person` },
      inLanguage: "en-IN",
    },
    {
      "@type": "ProfilePage",
      "@id": `${siteUrl}/#profile`,
      url: siteUrl,
      name: "Rishi Pandey — Full-Stack Developer & AI Engineer",
      isPartOf: { "@id": `${siteUrl}/#website` },
      mainEntity: { "@id": `${siteUrl}/#person` },
    },
    {
      "@type": "ItemList",
      name: "Selected projects by Rishi Pandey",
      itemListElement: projects.map((project, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "CreativeWork",
          name: project.name,
          description: project.description,
          url: project.link || `${siteUrl}/#projects`,
          creator: { "@id": `${siteUrl}/#person` },
          keywords: project.technologies.join(", "),
        },
      })),
    },
  ],
};

export default function Home() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [bootFinished, setBootFinished] = useState(false);

  useEffect(() => {
    const handleToggle = () => setPaletteOpen((prev) => !prev);
    window.addEventListener("toggle-command-palette", handleToggle);
    return () => window.removeEventListener("toggle-command-palette", handleToggle);
  }, []);

  return (
    <main id="main-content" className="flex min-h-screen w-full flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <Preloader onComplete={() => setBootFinished(true)} />
      <CustomCursor />
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <ScrollProgress />
      <Hero onOpenPalette={() => setPaletteOpen(true)} />
      <About />
      <Experience />
      <Stats />
      <Services />
      <Projects />
      <TechEcosystem />
      <Blog />
      <TestimonialsContact />
      <Footer />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </main>
  );
}

