import { DepartmentType } from "../../domain/department.entity"
import { IDepartmentRepository } from "../../usecase/department.repository.interface"

export class DepartmentService implements IDepartmentRepository {
    async getAllDepartments(): Promise<DepartmentType[]> {
        const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/departments`
        const res = await fetch(url)

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data?.message ?? "Failed to fetch departments")
        }

        return data?.data as DepartmentType[]
    }
}

