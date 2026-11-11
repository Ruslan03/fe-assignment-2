'use client'

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
import { useAppDispatch, useAppSelector } from "@/shared/presentation/store/hooks"
import { Button } from "@atoms/button"
import { Card, CardFooter } from "@atoms/card"
import { Text } from "@atoms/text"
import { FeedbackDialog } from "@molecules/feedback-dialog"
import { SectionCard } from "@molecules/section-card"
import { SelectField } from "@molecules/select-field"
import { TextField } from "@molecules/text-field"
import { TextareaField } from "@molecules/textarea-field"

import { clearCreateError, createMember, selectMemberState } from "../../store"

const createMemberSchema = z.object({
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

type CreateMemberFormValues = z.infer<typeof createMemberSchema>

interface CreatedMemberInfo {
  id?: string
  name: string
}

const STATUS_OPTIONS = [
  { label: "Active – Full Workspace Access", value: "active" },
  { label: "Inactive – Suspended Access", value: "inactive" },
]

const DEFAULT_VALUES: CreateMemberFormValues = {
  name: "",
  email: "",
  status: "active",
  role: "",
  department: "",
  employmentType: "",
  bio: "",
}

export function CreateMemberForm() {
  const dispatch = useAppDispatch()
  const { isCreating, createError } = useAppSelector(selectMemberState)
  const [createdMember, setCreatedMember] = useState<CreatedMemberInfo | null>(
    null
  )

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMemberFormValues>({
    resolver: zodResolver(createMemberSchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    return () => {
      dispatch(clearCreateError())
    }
  }, [dispatch])

  const onSubmit = async (values: CreateMemberFormValues) => {
    const result = await dispatch(
      createMember({
        name: values.name,
        email: values.email,
        role: values.role,
        department: values.department,
        status: values.status,
      })
    )

    if (createMember.fulfilled.match(result)) {
      const latestMember = result.payload[0]
      setCreatedMember({
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
            subtitle="Add personal records, contact credentials, and communication metadata."
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

          <CardFooter className="justify-end gap-3 border-t border-border bg-muted/30 py-4">
            {createError && (
              <Text
                as="p"
                variant="caption"
                role="alert"
                className="mr-auto text-destructive"
              >
                {createError}
              </Text>
            )}

            {isCreating ? (
              <Button type="button" variant="secondary" disabled>
                Cancel
              </Button>
            ) : (
              <Button type="button" variant="secondary" asChild>
                <Link href="/">Cancel</Link>
              </Button>
            )}

            <Button type="submit" disabled={isCreating}>
              <Save />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </form>

      <FeedbackDialog
        open={Boolean(createdMember)}
        onOpenChange={(open) => {
          if (!open) setCreatedMember(null)
        }}
        variant="success"
        title="Member Added Successfully"
        description={
          createdMember && (
            <>
              The profile information for{" "}
              <span className="font-semibold text-foreground">
                {createdMember.name}
              </span>
              {createdMember.id && (
                <>
                  {" "}
                  (
                  <span className="font-mono text-primary">
                    #{createdMember.id.toUpperCase()}
                  </span>
                  )
                </>
              )}{" "}
              has been added and synchronized across all workspace services.
            </>
          )
        }
        icon={
          <span className="flex size-6 items-center justify-center rounded-full bg-sky-950 text-white">
            <Check className="size-3.5 stroke-[3]" />
          </span>
        }
        footer={
          <Button asChild>
            <Link href="/">
              <LayoutGrid />
              Back to Dashboard
            </Link>
          </Button>
        }
      />
    </>
  )
}
