"use client";

import { useParams } from "next/navigation";
import { useGetTaskByIdQuery } from "@/services/api";
import DetailedTask from "@/components/tasks/DetailedTask";

import UILoader from "@/components/common/Loader";

export default function TaskDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError } = useGetTaskByIdQuery(id);

  if (isLoading) return <UILoader type="detail" />;
  if (isError) return null;
  if (!data) return null;

  return <DetailedTask task={data} />;
}
