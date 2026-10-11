"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { PencilIcon, BarChart3Icon, ExternalLinkIcon, CopyIcon, CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useCreateForm, useListForms } from "~/hooks/api/form";

type CreateFormValues = {
  title: string;
  description: string;
};

export default function FormsPage() {
  const [open, setOpen] = useState(false);
  const { createFormAsync, isError, error } = useCreateForm();
  const { forms, isLoading } = useListForms();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CreateFormValues>({
    defaultValues: { title: "", description: "" },
  });

  const onSubmit: SubmitHandler<CreateFormValues> = async (values) => {
    await createFormAsync({
      title: values.title,
      description: values.description || undefined,
    });
    reset();
    setOpen(false);
  };

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Forms</h1>
        <Button onClick={() => setOpen(true)}>Create Form</Button>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : !forms || forms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No forms yet. Create your first one.
                </TableCell>
              </TableRow>
            ) : (
              forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">{form.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {form.description ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild title="Edit form">
                        <Link href={`/dashboard/forms/${form.id}`}>
                          <PencilIcon className="size-4" />
                          <span className="sr-only">Edit {form.title}</span>
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="View Submissions">
                        <Link href={`/dashboard/forms/${form.id}/submissions`}>
                          <BarChart3Icon className="size-4" />
                          <span className="sr-only">Submissions for {form.title}</span>
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Copy Public Link"
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/form/${form.id}`);
                          toast.success("Form link copied to clipboard!");
                        }}
                      >
                        <CopyIcon className="size-4" />
                        <span className="sr-only">Copy Link</span>
                      </Button>
                      <Button variant="ghost" size="icon" asChild title="Open Public Form">
                        <Link href={`/form/${form.id}`} target="_blank">
                          <ExternalLinkIcon className="size-4" />
                          <span className="sr-only">Open {form.title}</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a new form</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="title">Title</FieldLabel>
                <Input
                  id="title"
                  placeholder="e.g. Customer Feedback"
                  {...register("title", { required: true, maxLength: 55 })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="description">Description</FieldLabel>
                <Textarea
                  id="description"
                  placeholder="What is this form for? (optional)"
                  {...register("description", { maxLength: 300 })}
                />
              </Field>
              {isError && (
                <p className="text-sm text-destructive">{error?.message}</p>
              )}
            </FieldGroup>

            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => { reset(); setOpen(false); }}
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
    </div>
  );
}
