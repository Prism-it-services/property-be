import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { Handler } from 'aws-lambda'
import { GetAllRequest, HttpGenericResponse } from '@prism-it-services/helper-utils/dist/types/http'
import { successResponse } from '@prism-it-services/helper-utils'
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware'
import { inputOutputLoggerMiddleware } from '@prism-it-services/helper-utils/dist/middleware/loggerMiddleware'
import { logger } from '@prism-it-services/helper-utils/dist/logger'
import { mongoMiddleware } from '@prism-it-services/helper-utils/dist/middleware/mongoMiddleware'
import { getAllProperties as getAllPropertyDetails } from '../logic/getAllProperties'

const getAllProperties: Handler = async (event: GetAllRequest): Promise<HttpGenericResponse> => {
  const queryParams = event.queryStringParameters || {}
  const property = await getAllPropertyDetails(queryParams)
  return successResponse({
    status: 'success',
    message: 'success',
    data: property,
  })
}

export const handler = middy(getAllProperties)
  .use(injectLambdaContext(logger.logger))
  .use(inputOutputLoggerMiddleware())
  .use(mongoMiddleware())
  .use(httpErrorHandler({ fallbackMessage: 'Unhandled error' }))
