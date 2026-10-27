"use client";

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { GlobeIcon, LinkIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Switch } from "~/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { CharacterCounter } from "~/components/ui/character-counter";
import { landingTheme } from "~/config/landing-theme";

export interface CreateFormValues {
  title: string;
  description: string;
  visibility: "PUBLIC" | "UNLISTED";
  isPublished: boolean;
}

const TITLE_MAX = 55;
const DESC_MAX = 300;

interface CreateFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CreateFormValues) => Promise<void>;
  errorMessage?: string | null;
}

export function CreateFormDialog({
  open,
  onOpenChange,
  onSubmit,
  errorMessage,
}: CreateFormDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<CreateFormValues>({
    defaultValues: {
      title: "",
      description: "",
      visibility: "UNLISTED",
      isPublished: true,
    },
  });

  const titleValue = watch("title") || "";
  const descValue = watch("description") || "";

  const handleFormSubmit: SubmitHandler<CreateFormValues> = async (values) => {
    if (!values.title.trim()) {
      toast.error("Form title cannot be empty");
      return;
    }
    if (values.title.length > TITLE_MAX) {
      toast.error(`Form title cannot exceed ${TITLE_MAX} characters`);
      return;
    }
    if (values.description && values.description.length > DESC_MAX) {
      toast.error(`Description cannot exceed ${DESC_MAX} characters`);
      return;
    }
    await onSubmit(values);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create a new form</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 mt-1">
          <FieldGroup className="gap-3.5">
            <Field>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel htmlFor="create-form-title" className="text-xs font-semibold">
                  Form Title <span className="text-destructive">*</span>
                </FieldLabel>
                <CharacterCounter current={titleValue.length} max={TITLE_MAX} />
              </div>
              <Input
                id="create-form-title"
                placeholder="e.g. Customer Feedback Survey"
                maxLength={TITLE_MAX}
                {...register("title", {
                  required: "Form title is required",
                  maxLength: {
                    value: TITLE_MAX,
                    message: `Title cannot exceed ${TITLE_MAX} characters`,
                  },
                })}
                className="h-9 text-xs sm:text-sm focus-visible:ring-amber-400/40"
              />
              {errors.title && (
                <p className="text-[11px] text-destructive font-medium mt-1">
                  {errors.title.message}
                </p>
              )}
            </Field>

            <Field>
              <div className="flex items-center justify-between mb-1">
                <FieldLabel htmlFor="create-form-desc" className="text-xs font-semibold">
                  Description
                </FieldLabel>
                <CharacterCounter current={descValue.length} max={DESC_MAX} />
              </div>
              <Textarea
                id="create-form-desc"
                placeholder="What is this form for? (optional)"
                rows={3}
                maxLength={DESC_MAX}
                {...register("description", {
                  maxLength: {
                    value: DESC_MAX,
                    message: `Description cannot exceed ${DESC_MAX} characters`,
                  },
                })}
                className="text-xs sm:text-sm resize-none focus-visible:ring-amber-400/40"
              />
              {errors.description && (
                <p className="text-[11px] text-destructive font-medium mt-1">
                  {errors.description.message}
                </p>
              )}
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <Field>
                <FieldLabel>Visibility</FieldLabel>
                <Controller
                  name="visibility"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNLISTED" className="text-xs">
                          <span className="flex items-center gap-1.5">
                            <LinkIcon className="size-3 text-muted-foreground" />
                            Unlisted (Link only)
                          </span>
                        </SelectItem>
                        <SelectItem value="PUBLIC" className="text-xs">
                          <span className="flex items-center gap-1.5">
                            <GlobeIcon className="size-3 text-blue-500" />
                            Public (Listed)
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>Status</FieldLabel>
                <Controller
                  name="isPublished"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2.5 h-9 px-3 rounded-md border bg-muted/30">
                      <Switch
                        id="new-form-published"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <label
                        htmlFor="new-form-published"
                        className="text-xs font-medium cursor-pointer"
                      >
                        {field.value ? "Published" : "Draft (Closed)"}
                      </label>
                    </div>
                  )}
                />
              </Field>
            </div>

            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
          </FieldGroup>

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="outline"
              className={landingTheme.buttonOutlineHover}
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`gap-2 ${landingTheme.primaryButton}`}
            >
              {isSubmitting && <Loader2 className="size-4 animate-spin" />}
              {isSubmitting ? "Creating..." : "Create Form"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
