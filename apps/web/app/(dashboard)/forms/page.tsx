"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  IconPlus,
  IconArchive,
  IconLayoutList,
  IconSearch,
  IconX,
  IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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
import { landingTheme } from "~/config/landing-theme";

export default function FormsPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [activeTab, setActiveTab] = useState<"ACTIVE" | "ARCHIVED">("ACTIVE");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
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
    [forms],
  );

  const archivedForms = useMemo(
    () => (forms as FormListItem[] | undefined)?.filter((f) => f.isArchived) ?? [],
    [forms],
  );

  const displayedForms = useMemo(() => {
    let list = activeTab === "ACTIVE" ? activeForms : archivedForms;
    if (statusFilter === "PUBLISHED") {
      list = list.filter((f) => f.isPublished);
    } else if (statusFilter === "DRAFT") {
      list = list.filter((f) => !f.isPublished);
    }
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (f) =>
        f.title.toLowerCase().includes(q) ||
        (f.description?.toLowerCase().includes(q) ?? false) ||
        (f.slug?.toLowerCase().includes(q) ?? false),
    );
  }, [activeTab, activeForms, archivedForms, searchQuery, statusFilter]);

  const MAX_FORMS_LIMIT = 14;

  const handleOpenCreateModal = () => {
    if ((forms?.length ?? 0) >= MAX_FORMS_LIMIT) {
      toast.error(
        `Workspace form limit reached (${MAX_FORMS_LIMIT}/${MAX_FORMS_LIMIT}). Please delete an older form to create a new one.`,
      );
      return;
    }
    setCreateOpen(true);
  };

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
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create form";
      toast.error(msg);
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
          : "Form unpublished! Submissions paused.",
      );
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVisibilityChange = async (formId: string, visibility: "PUBLIC" | "UNLISTED") => {
    setUpdatingId(formId);
    try {
      await updateFormVisibilityAsync({
        formId,
        visibility,
      });
      toast.success(`Visibility changed to ${visibility === "PUBLIC" ? "Public" : "Unlisted"}`);
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
          : "Form moved to archive.",
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
    <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8 w-full animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <Badge
              variant="outline"
              className={`text-[11px] px-2.5 py-0.5 gap-1.5 font-medium ${landingTheme.dashboardBadge}`}
            >
              <IconSparkles className={`size-3 ${landingTheme.iconColor}`} />
              <span>Form Directory</span>
            </Badge>
            <Badge
              variant="outline"
              className={`text-[10px] font-mono px-2 py-0.5 border-border/80 bg-muted/40 ${
                activeForms.length >= MAX_FORMS_LIMIT
                  ? "text-amber-500 border-amber-500/30"
                  : "text-muted-foreground"
              }`}
            >
              <span>
                Capacity: {activeForms.length} / {MAX_FORMS_LIMIT}
              </span>
            </Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Your <span className={landingTheme.gradientText}>Forms</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage, publish, duplicate, inspect analytics, and organize all your forms.
          </p>
        </div>
        <Button
          onClick={handleOpenCreateModal}
          className={`gap-1.5 self-start sm:self-auto h-9 text-xs cursor-pointer ${landingTheme.primaryButton}`}
        >
          <IconPlus className="size-4" />
          <span>Create Form</span>
        </Button>
      </div>

      {/* Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="inline-flex items-center p-0.5 rounded-lg bg-muted/30 border border-border/50 gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("ACTIVE")}
            className={`h-7.5 px-3 text-xs gap-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "ACTIVE" ? landingTheme.tabActive : landingTheme.tabInactive
            }`}
          >
            <IconLayoutList
              className={`size-3.5 ${
                activeTab === "ACTIVE" ? landingTheme.iconColor : "text-muted-foreground"
              }`}
            />
            <span>Active Forms</span>
            <span
              className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-medium tabular-nums ${
                activeTab === "ACTIVE"
                  ? "bg-muted text-foreground border border-border/70"
                  : "bg-muted/40 text-muted-foreground border border-border/40"
              }`}
            >
              {activeForms.length}
            </span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab("ARCHIVED")}
            className={`h-7.5 px-3 text-xs gap-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === "ARCHIVED" ? landingTheme.tabActive : landingTheme.tabInactive
            }`}
          >
            <IconArchive
              className={`size-3.5 ${
                activeTab === "ARCHIVED" ? landingTheme.iconColor : "text-muted-foreground"
              }`}
            />
            <span>Archived</span>
            {archivedForms.length > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 text-[10px] rounded-full font-medium tabular-nums ${
                  activeTab === "ARCHIVED"
                    ? "bg-muted text-foreground border border-border/70"
                    : "bg-muted/40 text-muted-foreground border border-border/40"
                }`}
              >
                {archivedForms.length}
              </span>
            )}
          </Button>
        </div>

        {/* Status Filter & In-Page Quick Search */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select
            value={statusFilter}
            onValueChange={(val: "ALL" | "PUBLISHED" | "DRAFT") => setStatusFilter(val)}
          >
            <SelectTrigger
              className={`h-8 text-xs w-[115px] bg-card border-border/70 ${landingTheme.inputFocus}`}
            >
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs">
                All Status
              </SelectItem>
              <SelectItem value="PUBLISHED" className="text-xs">
                Published
              </SelectItem>
              <SelectItem value="DRAFT" className="text-xs">
                Draft
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-60">
            <IconSearch className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search forms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`h-8 pl-8 pr-7 text-xs bg-card border-border/70 ${landingTheme.inputFocus}`}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs cursor-pointer p-0.5 rounded"
                aria-label="Clear search"
              >
                <IconX className="size-3" />
              </button>
            )}
          </div>
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
            ? 'No active forms. Click "Create Form" to start building.'
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
