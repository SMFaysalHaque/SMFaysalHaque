import { HeroSection } from "@/features/hero/components/hero-section";
import { AboutSection } from "@/features/about/components/about-section";
import { SkillsSection } from "@/features/skills/components/skills-section";
import { ExperienceSection } from "@/features/experience/components/experience-section";
import { ProjectsSection } from "@/features/projects/components/projects-section";
import { ContactSection } from "@/features/contact/components/contact-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ContactSection />
    </>
  );
}
