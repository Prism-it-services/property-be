import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { Handler } from 'aws-lambda'
import { DeleteByIdRequest, HttpGenericResponse } from '@prism-it-services/helper-utils/dist/types/http'
import { successResponse } from '@prism-it-services/helper-utils'
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware'
import { inputOutputLoggerMiddleware } from '@prism-it-services/helper-utils/dist/middleware/loggerMiddleware'
import { logger } from '@prism-it-services/helper-utils/dist/logger'
import { mongoMiddleware } from '@prism-it-services/helper-utils/dist/middleware/mongoMiddleware'
import { deleteProperty as deletePropertyDetails } from '../logic/deleteProperty'
import { mongoErrorhandler } from '@prism-it-services/helper-utils/dist/helpers/mongoErrorHandler'

const deleteProperty: Handler = async (event: DeleteByIdRequest): Promise<HttpGenericResponse> => {
  try {
    const { id } = event.pathParameters
    await deletePropertyDetails(id)
    return successResponse({
      status: 'success',
      message: 'success',
      data: null,
    })
  } catch (error: unknown) {
    return mongoErrorhandler(error)
  }
}

export const handler = middy(deleteProperty)
  .use(injectLambdaContext(logger.logger))
  .use(inputOutputLoggerMiddleware())
  .use(mongoMiddleware())
  .use(httpErrorHandler({ fallbackMessage: 'Unhandled error' }))
