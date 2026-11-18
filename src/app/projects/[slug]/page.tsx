import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProjectDetailPage from "../../components/ProjectDetailPage";
import projectsData from "../../data/projects.json";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

async function ProjectDetailContent({ params }: ProjectPageProps) {
  const { slug } = await params;

  const project = projectsData.carousel.cards.find(
    (card) => card.path === `/projects/${slug}`
  );

  if (!project) {
    notFound();
  }

  return (
    <ProjectDetailPage
      project={project}
      allProjects={projectsData.carousel.cards}
    />
  );
}

export default function ProjectPage({ params }: ProjectPageProps) {
  return (
    <Suspense fallback={null}>
      <ProjectDetailContent params={params} />
    </Suspense>
  );
}
