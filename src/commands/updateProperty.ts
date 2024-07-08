import middy from '@middy/core'
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import { Handler } from 'aws-lambda'
import { HttpGenericResponse, UpdatePropertyRequest } from '@prism-it-services/helper-utils/dist/types/http'
import { successResponse } from '@prism-it-services/helper-utils'
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware'
import { inputOutputLoggerMiddleware } from '@prism-it-services/helper-utils/dist/middleware/loggerMiddleware'
import { logger } from '@prism-it-services/helper-utils/dist/logger'
import { mongoMiddleware } from '@prism-it-services/helper-utils/dist/middleware/mongoMiddleware'
import { updateProperty as updatePropertyDetails } from '../logic/updateProperty'
import { mongoErrorhandler } from '@prism-it-services/helper-utils/dist/helpers/mongoErrorHandler'

const updateProperty: Handler = async (event: UpdatePropertyRequest): Promise<HttpGenericResponse> => {
  try {
    const propertyData = event.body
    const { id } = event.pathParameters
    const property = await updatePropertyDetails(id, propertyData)
    return successResponse({
      status: 'success',
      message: 'success',
      data: property,
    })
  } catch (error: unknown) {
    return mongoErrorhandler(error)
  }
}

export const handler = middy(updateProperty)
  .use(jsonBodyParser())
  .use(injectLambdaContext(logger.logger))
  .use(inputOutputLoggerMiddleware())
  .use(mongoMiddleware())
  .use(httpErrorHandler({ fallbackMessage: 'Unhandled error' }))
