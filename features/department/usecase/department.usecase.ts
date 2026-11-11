import { IDepartmentRepository } from "./department.repository.interface"

export async function getAllDepartmentsUseCase(repo: IDepartmentRepository) {
    return repo.getAllDepartments()
}

