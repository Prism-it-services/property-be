import PropertyModel from '@prism-it-services/helper-utils/dist/models/property'

export const deleteProperty = async (propertyId: string): Promise<void> => {
  const propertyData = { deletedAt: new Date().toISOString() }
  await PropertyModel.findOneAndUpdate({ _id: propertyId }, propertyData)
}
