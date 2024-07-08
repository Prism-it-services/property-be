import PropertyModel from '@prism-it-services/helper-utils/dist/models/property'
import { IProperties } from '@prism-it-services/helper-utils/dist/types/property'

export const getPropertyById = async (propertyId: string): Promise<IProperties | null> => {
  return await PropertyModel.findOne({ _id: propertyId, deletedAt: null })
}
