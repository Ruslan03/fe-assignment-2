"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Briefcase,
  Check,
  IdCard,
  LayoutGrid,
  Mail,
  Save,
  ToggleLeft,
} from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { DepartmentSelect } from "@department/presentation/components/ui/department-select"
import { EmploymentTypeSelect } from "@employment-type/presentation/components/ui/employment-type-select"
import {
  useAppDispatch,
  useAppSelector,
} from "@/shared/presentation/store/hooks"
import { Button } from "@atoms/button"
import { Card, CardFooter } from "@atoms/card"
import { Text } from "@atoms/text"
import { FeedbackDialog } from "@molecules/feedback-dialog"
import { SectionCard } from "@molecules/section-card"
import { SelectField } from "@molecules/select-field"
import { TextField } from "@molecules/text-field"
import { TextareaField } from "@molecules/textarea-field"

import type { MemberType } from "../../../domain/member.entity"
import {
  clearCreateError,
  clearDeleteError,
  clearUpdateError,
  createMember,
  selectMemberState,
  updateMember,
} from "../../store"
import { DeleteMemberButton } from "./delete-member-button"

const memberSchema = z.object({
  name: z.string().trim().min(1, "Full name is required"),
  email: z
    .string()
    .trim()
    .min(1, "Work email is required")
    .email("Please enter a valid email address"),
  status: z.enum(["active", "inactive"]),
  role: z.string().trim().min(1, "Job title is required"),
  department: z.string().trim().min(1, "Department is required"),
  employmentType: z.string().optional(),
  bio: z.string().optional(),
})

type MemberFormValues = z.infer<typeof memberSchema>

export interface MemberFormProps {
  mode?: "create" | "edit"
  initialData?: MemberType
}

interface SubmittedMemberInfo {
  mode: "create" | "edit"
  id?: string
  name: string
}

const STATUS_OPTIONS = [
  { label: "Active – Full Workspace Access", value: "active" },
  { label: "Inactive – Suspended Access", value: "inactive" },
]

const DEFAULT_VALUES: MemberFormValues = {
  name: "",
  email: "",
  status: "active",
  role: "",
  department: "",
  employmentType: "",
  bio: "",
}

function toFormValues(member?: MemberType): MemberFormValues {
  if (!member) return DEFAULT_VALUES

  return {
    name: member.name,
    email: member.email,
    status: member.status === "inactive" ? "inactive" : "active",
    role: member.role,
    department: member.department,
    employmentType: member.employmentType ?? "",
    bio: member.bio ?? "",
  }
}

export function MemberForm({ mode = "create", initialData }: MemberFormProps) {
  const isEdit = mode === "edit"
  const dispatch = useAppDispatch()
  const {
    isCreating,
    createError,
    isUpdating,
    updateError,
    isDeleting,
    deleteError,
  } = useAppSelector(selectMemberState)
  const [submittedMember, setSubmittedMember] =
    useState<SubmittedMemberInfo | null>(null)

  const isSubmitting = isEdit ? isUpdating : isCreating
  const isBusy = isSubmitting || isDeleting
  const submitError = (isEdit ? updateError : createError) ?? deleteError

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: toFormValues(initialData),
  })

  useEffect(() => {
    if (!initialData) return
    reset(toFormValues(initialData))
  }, [initialData, reset])

  useEffect(() => {
    return () => {
      dispatch(clearCreateError())
      dispatch(clearUpdateError())
      dispatch(clearDeleteError())
    }
  }, [dispatch])

  const onSubmit = async (values: MemberFormValues) => {
    const payload = {
      name: values.name,
      email: values.email,
      role: values.role,
      department: values.department,
      employmentType: values.employmentType ?? "",
      bio: values.bio ?? "",
      status: values.status,
    }

    if (isEdit) {
      if (!initialData) return
      const result = await dispatch(
        updateMember({ id: initialData.id, payload })
      )

      if (updateMember.fulfilled.match(result)) {
        setSubmittedMember({
          mode: "edit",
          id: result.payload.id,
          name: result.payload.name,
        })
      }
      return
    }

    const result = await dispatch(createMember(payload))

    if (createMember.fulfilled.match(result)) {
      const latestMember = result.payload[0]
      setSubmittedMember({
        mode: "create",
        id: latestMember?.id,
        name: latestMember?.name ?? values.name,
      })
      reset(DEFAULT_VALUES)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Card className="gap-0 py-0">
          <SectionCard
            title="General Information"
            subtitle={
              isEdit
                ? "Update personal records, contact credentials, and communication metadata."
                : "Add personal records, contact credentials, and communication metadata."
            }
            className="rounded-none border-b border-border shadow-none ring-0"
            contentClassName="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <TextField
              label="Full Name"
              required
              icon={<IdCard />}
              placeholder="Michael Phelps"
              message="Displayed publicly across collaborative repositories."
              errorMessage={errors.name?.message}
              {...register("name")}
            />

            <TextField
              label="Work Email"
              required
              type="email"
              icon={<Mail />}
              placeholder="michael.phelps@acme.corp"
              message="Used for SSO sign-in and security notifications."
              errorMessage={errors.email?.message}
              {...register("email")}
            />

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SelectField
                  label="Account Status"
                  icon={<ToggleLeft />}
                  options={STATUS_OPTIONS}
                  value={field.value}
                  onValueChange={field.onChange}
                  message="Controls login eligibility across organization SSO."
                  errorMessage={errors.status?.message}
                />
              )}
            />
          </SectionCard>

          <SectionCard
            title="Work Details & Permissions"
            subtitle="Manage departmental allocations, administrative scopes, and governance clearance."
            className="rounded-none shadow-none ring-0"
            contentClassName="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <TextField
              label="Job Title"
              required
              icon={<Briefcase />}
              placeholder="Staff UI/UX Designer"
              errorMessage={errors.role?.message}
              {...register("role")}
            />

            <Controller
              control={control}
              name="department"
              render={({ field }) => (
                <DepartmentSelect
                  required
                  value={field.value}
                  onValueChange={field.onChange}
                  errorMessage={errors.department?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="employmentType"
              render={({ field }) => (
                <EmploymentTypeSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  errorMessage={errors.employmentType?.message}
                />
              )}
            />

            <TextareaField
              label="Bio & Administrative Notes"
              placeholder="Mainly working on low fidelity and high fidelity design generation"
              fieldClassName="md:col-span-2"
              rows={4}
              errorMessage={errors.bio?.message}
              {...register("bio")}
            />
          </SectionCard>

          <CardFooter className="flex-wrap items-center justify-end gap-3 border-t border-border bg-muted/30 py-4">
            {isEdit && initialData && (
              <DeleteMemberButton
                member={initialData}
                dismissHref="/"
                className="mr-auto"
                disabled={isBusy}
              />
            )}

            {submitError && (
              <Text
                as="p"
                variant="caption"
                role="alert"
                className={
                  isEdit ? "text-destructive" : "mr-auto text-destructive"
                }
              >
                {submitError}
              </Text>
            )}

            {isBusy ? (
              <Button type="button" variant="secondary" disabled>
                Cancel
              </Button>
            ) : (
              <Button type="button" variant="secondary" asChild>
                <Link href="/">Cancel</Link>
              </Button>
            )}

            <Button type="submit" disabled={isBusy}>
              <Save />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>

      <FeedbackDialog
        open={Boolean(submittedMember)}
        onOpenChange={(open) => {
          if (!open) setSubmittedMember(null)
        }}
        variant="success"
        title={
          submittedMember?.mode === "edit"
            ? "Member Updated Successfully"
            : "Member Added Successfully"
        }
        description={
          submittedMember && (
            <>
              The profile information for{" "}
              <span className="font-semibold text-foreground">
                {submittedMember.name}
              </span>
              {submittedMember.id && (
                <>
                  {" "}
                  (
                  <span className="font-mono text-primary">
                    #{submittedMember.id.toUpperCase()}
                  </span>
                  )
                </>
              )}{" "}
              has been {submittedMember.mode === "edit" ? "updated" : "added"}{" "}
              and synchronized across all workspace services.
            </>
          )
        }
        icon={
          <span className="flex size-6 items-center justify-center rounded-full bg-sky-950 text-white">
            <Check className="size-3.5 stroke-[3]" />
          </span>
        }
        footer={
          submittedMember?.mode === "edit" ? (
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setSubmittedMember(null)}
              >
                Continue Editing
              </Button>
              <Button asChild>
                <Link href="/">
                  <LayoutGrid />
                  Back to Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild>
              <Link href="/">
                <LayoutGrid />
                Back to Dashboard
              </Link>
            </Button>
          )
        }
      />
    </>
  )
}
