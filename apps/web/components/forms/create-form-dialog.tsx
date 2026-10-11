"use client";

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { GlobeIcon, LinkIcon } from "lucide-react";
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

export interface CreateFormValues {
  title: string;
  description: string;
  visibility: "PUBLIC" | "UNLISTED";
  isPublished: boolean;
}

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
    formState: { isSubmitting },
  } = useForm<CreateFormValues>({
    defaultValues: {
      title: "",
      description: "",
      visibility: "UNLISTED",
      isPublished: true,
    },
  });

  const handleFormSubmit: SubmitHandler<CreateFormValues> = async (values) => {
    await onSubmit(values);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new form</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4 mt-2">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input
                id="title"
                placeholder="e.g. Customer Feedback Survey"
                {...register("title", { required: true, maxLength: 55 })}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Textarea
                id="description"
                placeholder="What is this form for? (optional)"
                rows={3}
                {...register("description", { maxLength: 300 })}
              />
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
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Form"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
