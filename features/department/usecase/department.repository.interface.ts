import { DepartmentType } from "../domain/department.entity"

export interface IDepartmentRepository {
    getAllDepartments: () => Promise<DepartmentType[]>
}

