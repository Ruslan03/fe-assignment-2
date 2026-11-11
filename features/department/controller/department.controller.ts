import { DepartmentService } from "../infrastructure/api/department.service"
import { getAllDepartmentsUseCase } from "../usecase/department.usecase"

export async function getAllDepartmentController() {
    const repo = new DepartmentService()

    return getAllDepartmentsUseCase(repo)
}

