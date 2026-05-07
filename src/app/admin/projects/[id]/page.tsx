import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { projects } from "@/data/projects";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();
  return <ProjectForm project={project} />;
}
