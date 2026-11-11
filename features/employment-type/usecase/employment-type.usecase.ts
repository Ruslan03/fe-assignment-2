import { IEmploymentTypeRepository } from "./employment-type.repository.interface"

export async function getAllEmploymentTypesUseCase(repo: IEmploymentTypeRepository) {
    return repo.getAllEmploymentTypes()
}

