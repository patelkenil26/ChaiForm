"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { QrCodeDialog } from "~/components/qr-code-dialog";
import { CreateFormDialog, type CreateFormValues } from "~/components/forms/create-form-dialog";
import { FormsTable, type FormListItem } from "~/components/forms/forms-table";
import { useCreateForm, useListForms, useUpdateFormVisibility } from "~/hooks/api/form";

export default function FormsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedQrForm, setSelectedQrForm] = useState<{
    title: string;
    url: string;
    slug?: string | null;
  } | null>(null);

  const { createFormAsync, error: createError } = useCreateForm();
  const { forms, isLoading } = useListForms();
  const { updateFormVisibilityAsync } = useUpdateFormVisibility();

  const handleCreateForm = async (values: CreateFormValues) => {
    try {
      await createFormAsync({
        title: values.title,
        description: values.description || undefined,
        visibility: values.visibility,
        isPublished: values.isPublished,
      });
      setCreateOpen(false);
      toast.success("Form created successfully!");
    } catch {
      toast.error("Failed to create form");
    }
  };

  const handleTogglePublish = async (formId: string, currentPublished: boolean) => {
    setUpdatingId(formId);
    try {
      await updateFormVisibilityAsync({
        formId,
        isPublished: !currentPublished,
      });
      toast.success(
        !currentPublished
          ? "Form published! Live & accepting responses."
          : "Form unpublished! Submissions paused."
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVisibilityChange = async (
    formId: string,
    visibility: "PUBLIC" | "UNLISTED"
  ) => {
    setUpdatingId(formId);
    try {
      await updateFormVisibilityAsync({
        formId,
        visibility,
      });
      toast.success(
        `Visibility changed to ${visibility === "PUBLIC" ? "Public" : "Unlisted"}`
      );
    } catch {
      toast.error("Failed to update visibility");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopyLink = (slugOrId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/form/${slugOrId}`);
    toast.success("Form link copied to clipboard!");
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Forms</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage, publish, and track responses for all your forms.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5">
          <PlusIcon className="size-4" />
          Create Form
        </Button>
      </div>

      <FormsTable
        forms={forms as FormListItem[] | undefined}
        isLoading={isLoading}
        updatingId={updatingId}
        onTogglePublish={handleTogglePublish}
        onVisibilityChange={handleVisibilityChange}
        onCopyLink={handleCopyLink}
        onOpenQr={setSelectedQrForm}
      />

      <CreateFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateForm}
        errorMessage={createError?.message}
      />

      {selectedQrForm && (
        <QrCodeDialog
          open={!!selectedQrForm}
          onOpenChange={(isOpen) => {
            if (!isOpen) setSelectedQrForm(null);
          }}
          url={selectedQrForm.url}
          title={selectedQrForm.title}
          slug={selectedQrForm.slug}
        />
      )}
    </div>
  );
}
