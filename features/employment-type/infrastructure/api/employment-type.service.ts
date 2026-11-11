import { EmploymentType } from "../../domain/employment-type.entity"
import { IEmploymentTypeRepository } from "../../usecase/employment-type.repository.interface"

export class EmploymentTypeService implements IEmploymentTypeRepository {
    async getAllEmploymentTypes(): Promise<EmploymentType[]> {
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/employment/types`
        const res = await fetch(url)

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data?.message ?? "Failed to fetch employment types")
        }

        return data?.data as EmploymentType[]
    }
}

