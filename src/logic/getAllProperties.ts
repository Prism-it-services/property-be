import PropertyModel from '@prism-it-services/helper-utils/dist/models/property'
import { dateFilter, DateFilterOptions } from '@prism-it-services/helper-utils/dist/helpers/dateFilter'
import { paginate } from '@prism-it-services/helper-utils/dist/helpers/paginator'
import { GetAllProperties } from '@prism-it-services/helper-utils/dist/types/property'

export const getAllProperties = async (queryParams: Record<string, unknown>): Promise<GetAllProperties> => {
  const { pagination, queryParams: paginatedQueryParams } = paginate(queryParams)
  const updatedQueryParams = dateFilter(paginatedQueryParams as DateFilterOptions)
  updatedQueryParams['deletedAt'] = null
  const properties = await PropertyModel.find(updatedQueryParams, null, pagination)
  const total = await PropertyModel.countDocuments(updatedQueryParams)
  return {
    properties,
    total,
  }
}
