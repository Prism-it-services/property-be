import PropertyModel from '@prism-it-services/helper-utils/dist/models/property'
import { AddProperty, IProperties } from '@prism-it-services/helper-utils/dist/types/property'

export const addProperty = async (propertyData: AddProperty): Promise<IProperties> => {
  const property = await new PropertyModel(propertyData)
  const propertyResponse = await property.save()
  return propertyResponse
}
