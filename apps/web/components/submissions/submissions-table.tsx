"use client";

import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

export interface SubmissionField {
  id: string;
  label: string;
  labelKey: string;
  type: string;
  isRequired: boolean;
  index: string;
}

export interface SubmissionValue {
  formFieldId: string;
  value: string;
}

export interface SubmissionItem {
  id: string;
  createdAt: Date | string | null;
  values?: SubmissionValue[] | null;
}

interface SubmissionsTableProps {
  fields: SubmissionField[] | undefined;
  submissions: SubmissionItem[] | undefined;
  isLoading: boolean;
}

export function SubmissionsTable({
  fields,
  submissions,
  isLoading,
}: SubmissionsTableProps) {
  const sortedFields = [...(fields ?? [])].sort(
    (a, b) => parseFloat(a.index) - parseFloat(b.index)
  );

  return (
    <div className="rounded-xl border overflow-hidden bg-card shadow-xs">
      <Table>
        <TableHeader className="bg-muted/60">
          <TableRow>
            <TableHead className="w-44 font-semibold">Submitted At</TableHead>
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-24" />
                  </TableHead>
                ))
              : sortedFields.map((field) => (
                  <TableHead key={field.id} className="font-semibold">
                    {field.label}
                    {field.isRequired && (
                      <span className="text-destructive ml-0.5">*</span>
                    )}
                  </TableHead>
                ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                {Array.from({ length: 3 }).map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : !submissions || submissions.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={sortedFields.length + 1}
                className="h-28 text-center text-muted-foreground"
              >
                No responses submitted yet.
              </TableCell>
            </TableRow>
          ) : (
            submissions.map((submission) => {
              const valueMap = new Map(
                (submission.values ?? []).map((v) => [v.formFieldId, v.value])
              );

              return (
                <TableRow key={submission.id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="text-muted-foreground text-sm whitespace-nowrap font-mono text-xs">
                    {submission.createdAt
                      ? new Date(submission.createdAt).toLocaleString([], {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </TableCell>
                  {sortedFields.map((field) => {
                    const val = valueMap.get(field.id);
                    return (
                      <TableCell key={field.id} className="text-sm">
                        {val !== undefined && val !== "" ? (
                          field.type === "RATING" ? (
                            <span className="inline-flex items-center gap-1 font-medium text-amber-500">
                              <span>★</span> {val} / 5
                            </span>
                          ) : (
                            val
                          )
                        ) : (
                          <span className="text-muted-foreground/40 italic">—</span>
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
