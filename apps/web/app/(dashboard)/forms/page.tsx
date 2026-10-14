"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, ArchiveIcon, LayoutListIcon, SearchIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { QrCodeDialog } from "~/components/qr-code-dialog";
import { CreateFormDialog, type CreateFormValues } from "~/components/forms/create-form-dialog";
import { FormsTable, type FormListItem } from "~/components/forms/forms-table";
import {
  useCreateForm,
  useListForms,
  useUpdateFormVisibility,
  useCloneForm,
  useArchiveForm,
} from "~/hooks/api/form";
import { useUser } from "~/hooks/api/auth";

export default function FormsPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [createOpen, setCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedQrForm, setSelectedQrForm] = useState<{
    title: string;
    url: string;
    slug?: string | null;
  } | null>(null);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace("/login?redirect=/forms");
    }
  }, [user, isUserLoading, router]);

  const { createFormAsync, error: createError } = useCreateForm();
  const { forms, isLoading } = useListForms();
  const { updateFormVisibilityAsync } = useUpdateFormVisibility();
  const { cloneFormAsync } = useCloneForm();
  const { archiveFormAsync } = useArchiveForm();

  const activeForms = useMemo(
    () => (forms as FormListItem[] | undefined)?.filter((f) => !f.isArchived) ?? [],
    [forms]
  );

  const archivedForms = useMemo(
    () => (forms as FormListItem[] | undefined)?.filter((f) => f.isArchived) ?? [],
    [forms]
  );

  const displayedForms = useMemo(() => {
    const list = activeTab === "ACTIVE" ? activeForms : archivedForms;
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        (f.description?.toLowerCase().includes(q) ?? false) ||
        (f.slug?.toLowerCase().includes(q) ?? false)
    );
  }, [activeTab, activeForms, archivedForms, searchQuery]);

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

  const handleCloneForm = async (formId: string) => {
    try {
      await cloneFormAsync({ formId });
      toast.success("Form cloned successfully! Copy created with all questions.");
    } catch {
      toast.error("Failed to clone form");
    }
  };

  const handleToggleArchive = async (formId: string, isCurrentlyArchived: boolean) => {
    setUpdatingId(formId);
    try {
      await archiveFormAsync({
        formId,
        isArchived: !isCurrentlyArchived,
      });
      toast.success(
        isCurrentlyArchived
          ? "Form unarchived & restored to active list!"
          : "Form moved to archive."
      );
    } catch {
      toast.error("Failed to update archive status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCopyLink = (slugOrId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/form/${slugOrId}`);
    toast.success("Form link copied to clipboard!");
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Forms</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage, publish, duplicate, and organize all your forms.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-1.5 self-start sm:self-auto">
          <PlusIcon className="size-4" />
          Create Form
        </Button>
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={activeTab === "ACTIVE" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("ACTIVE")}
            className="h-8 text-xs gap-1.5"
          >
            <LayoutListIcon className="size-3.5" />
            Active Forms
            <Badge variant="outline" className="ml-1 px-1.5 py-0 text-[10px]">
              {activeForms.length}
            </Badge>
          </Button>

          <Button
            type="button"
            variant={activeTab === "ARCHIVED" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("ARCHIVED")}
            className="h-8 text-xs gap-1.5"
          >
            <ArchiveIcon className="size-3.5" />
            Archived
            {archivedForms.length > 0 && (
              <Badge variant="outline" className="ml-1 px-1.5 py-0 text-[10px] bg-amber-500/10 text-amber-600 border-amber-500/20">
                {archivedForms.length}
              </Badge>
            )}
          </Button>
        </div>

        {/* In-Page Quick Filter Input */}
        <div className="relative w-full sm:w-64">
          <SearchIcon className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 pl-8 pr-7 text-xs bg-card"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer"
            >
              <XIcon className="size-3" />
            </button>
          )}
        </div>
      </div>

      {/* Table Display */}
      <FormsTable
        forms={displayedForms}
        isLoading={isLoading}
        updatingId={updatingId}
        onTogglePublish={handleTogglePublish}
        onVisibilityChange={handleVisibilityChange}
        onCopyLink={handleCopyLink}
        onOpenQr={setSelectedQrForm}
        onClone={handleCloneForm}
        onToggleArchive={handleToggleArchive}
        emptyMessage={
          activeTab === "ACTIVE"
            ? "No active forms. Click \"Create Form\" to start building."
            : "No archived forms. Archived forms will appear here safely without deleting any data."
        }
      />

      {/* Create Form Dialog */}
      <CreateFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateForm}
        errorMessage={createError?.message}
      />

      {/* QR Code Sharing Dialog */}
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
