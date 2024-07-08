import middy from '@middy/core'
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'
import { Handler } from 'aws-lambda'
import { AddPropertyRequest, HttpGenericResponse } from '@prism-it-services/helper-utils/dist/types/http'
import { successResponse } from '@prism-it-services/helper-utils'
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware'
import { inputOutputLoggerMiddleware } from '@prism-it-services/helper-utils/dist/middleware/loggerMiddleware'
import { logger } from '@prism-it-services/helper-utils/dist/logger'
import { mongoMiddleware } from '@prism-it-services/helper-utils/dist/middleware/mongoMiddleware'
import { addProperty as addPropertyDetails } from '../logic/addProperty'
import { mongoErrorhandler } from '@prism-it-services/helper-utils/dist/helpers/mongoErrorHandler'

const addProperty: Handler = async (event: AddPropertyRequest): Promise<HttpGenericResponse> => {
  try {
    const propertyData = event.body
    const property = await addPropertyDetails({
      ...propertyData,
    })
    return successResponse({
      status: 'success',
      message: 'success',
      data: property,
    })
  } catch (error: unknown) {
    return mongoErrorhandler(error)
  }
}

export const handler = middy(addProperty)
  .use(jsonBodyParser())
  .use(injectLambdaContext(logger.logger))
  .use(inputOutputLoggerMiddleware())
  .use(mongoMiddleware())
  .use(httpErrorHandler({ fallbackMessage: 'Unhandled error' }))
