import HeroSection from "../components/HeroSection";
import ProjectCarousel from "../components/ProjectCarousel";

export default function ProjectsPage() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <HeroSection
        title="Projetos"
        backgroundImage="/images/projects-bg.webp"
        showScrollIndicator={false}
        showBackButton
        backHref="/?section=3"
      />

      <div className="absolute bottom-0 left-0 z-30 w-full pb-8">
        <ProjectCarousel />
      </div>
    </main>
  );
}
