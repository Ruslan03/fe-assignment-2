import { EmploymentType } from "../domain/employment-type.entity"

export interface IEmploymentTypeRepository {
    getAllEmploymentTypes: () => Promise<EmploymentType[]>
}

