import PropertyModel from '@prism-it-services/helper-utils/dist/models/property'
import { IProperties, UpdateProperty } from '@prism-it-services/helper-utils/dist/types/property'

export const updateProperty = async (propertyId: string, propertyData: UpdateProperty): Promise<IProperties | null> => {
  const property = await PropertyModel.findOneAndUpdate({ _id: propertyId }, propertyData, {
    new: true,
  })
  return property
}
