import middy from '@middy/core'
import { APIGatewayEvent, Handler } from 'aws-lambda'
import httpErrorHandler from '@middy/http-error-handler'
import { HttpGenericResponse } from '../types'
import { successResponse } from '@prism-it-services/helper-utils'
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware'
import { inputOutputLoggerMiddleware } from '@prism-it-services/helper-utils/dist/middleware/loggerMiddleware'
import { logger } from '@prism-it-services/helper-utils/dist/logger'
// import { retrieveTokenInfo } from '@prism-it-services/helper-utils/dist/helpers/retrieveTokenInfo'

const simpleGet: Handler = async (event: APIGatewayEvent): Promise<HttpGenericResponse> => {
  // const tokenInfo = retrieveTokenInfo(event)
  return successResponse({
    status: 'success',
    // message: tokenInfo,
  })
}

export const handler = middy(simpleGet)
  .use(injectLambdaContext(logger.logger))
  .use(inputOutputLoggerMiddleware())
  .use(httpErrorHandler({ fallbackMessage: 'Unhandled error' }))
