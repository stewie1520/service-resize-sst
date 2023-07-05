import { APIGatewayProxyHandlerV2, APIGatewayProxyEventV2, Context } from "aws-lambda";
import { z } from "zod";

export function jsonHandler(lambda: (event: APIGatewayProxyEventV2, context: Context) => any): APIGatewayProxyHandlerV2 {
  return async function (event, context) {
    let body, statusCode;

    try {
      body = await lambda(event, context);
      statusCode = 200;
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        statusCode = 400
        body = { error: error.message }
      } else {
        statusCode = 500
        body = { error: "Unexpected error" }
      }
    }

    return {
      statusCode,
      body: JSON.stringify(body),
    };
  };
}

export function redirectHandler(lambda: (event: APIGatewayProxyEventV2, context: Context) => Promise<string>): APIGatewayProxyHandlerV2 {
  return async function (event, context) {
    let body, location, statusCode;

    try {
      location = await lambda(event, context);
      statusCode = 301;
    } catch (error) {
      console.error(error);

      if (error instanceof z.ZodError) {
        statusCode = 400
        body = { error: error.message }
      } else {
        statusCode = 404
        body = { error: "File not found" }
      }
    }

    return {
      statusCode,
      ...(location && {
        headers: {
          Location: location,
        },
      }),
      body: JSON.stringify(body || ''),
    };
  };
}
