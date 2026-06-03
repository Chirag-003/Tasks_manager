"use client";

import { useParams } from "next/navigation";
import { useGetSubtaskByIdQuery } from "@/services/api";
import DetailedSubtask from "@/components/DetailedSubtask";

export default function SubtaskPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data, isLoading, isError } = useGetSubtaskByIdQuery(id);

  if (isLoading) return <p style={{ padding: 20 }}>Loading...</p>;
  if (isError) return <p style={{ padding: 20 }}>Error</p>;
  if (!data) return null;

  return <DetailedSubtask subtask={data} />;
}
