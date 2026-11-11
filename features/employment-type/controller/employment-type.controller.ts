import { EmploymentTypeService } from "../infrastructure/api/employment-type.service"
import { getAllEmploymentTypesUseCase } from "../usecase/employment-type.usecase"

export async function getAllEmploymentTypeController() {
    const repo = new EmploymentTypeService()

    return getAllEmploymentTypesUseCase(repo)
}

