import middy from '@middy/core'
import httpErrorHandler from '@middy/http-error-handler'
import { Handler } from 'aws-lambda'
import { GetByIdRequest, HttpGenericResponse } from '@prism-it-services/helper-utils/dist/types/http'
import { notFoundResponse, successResponse } from '@prism-it-services/helper-utils'
import { injectLambdaContext } from '@aws-lambda-powertools/logger/middleware'
import { inputOutputLoggerMiddleware } from '@prism-it-services/helper-utils/dist/middleware/loggerMiddleware'
import { logger } from '@prism-it-services/helper-utils/dist/logger'
import { mongoMiddleware } from '@prism-it-services/helper-utils/dist/middleware/mongoMiddleware'
import { getPropertyById } from '../logic/getProperty'

const hasArguments = (event: any): event is { arguments: { id: string } } => {
  return (event as { arguments?: { id: string } }).arguments !== undefined;
};

const getProperty: Handler = async (event: GetByIdRequest): Promise<HttpGenericResponse> => {
  const propertyId = (event.pathParameters?.id) || (hasArguments(event) ? event.arguments.id : undefined);

  if (!propertyId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: 'fail',
        message: 'Property ID not provided',
      }),
    };
  }



  const property = await getPropertyById(propertyId)
  if (property)
    return successResponse({
      status: 'success',
      message: 'success',
      data: property,
    })
  return notFoundResponse({
    status: 'fail',
    message: 'Property not found',
    data: null,
  })
}

export const handler = middy(getProperty)
  .use(injectLambdaContext(logger.logger))
  .use(inputOutputLoggerMiddleware())
  .use(mongoMiddleware())
  .use(httpErrorHandler({ fallbackMessage: 'Unhandled error' }))
