import {
  APIGatewayEvent,
  Context,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda';
import Axios from 'axios-observable';
import { SuggestApiWrapper } from './suggest-api-wrapper';
import { SuggestionService } from './suggestion.service';
import { map } from 'rxjs/operators';

let response: APIGatewayProxyResult;
const axios = Axios.create({});
const suggestApi = new SuggestApiWrapper(axios);
const suggestionService = new SuggestionService(suggestApi);

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const lambdaHandler: APIGatewayProxyHandler = (
  event: APIGatewayEvent,
  context: Context
) => {
  if (typeof event.queryStringParameters['q'] === 'undefined') {
    return { statusCode: 400, body: "No query parameter `q' given." };
  }

  const q = event.queryStringParameters['q'];

  console.log(`Trying to get suggestions of q=${q}`);

  try {
    return suggestionService
      .getSuggestions(q)
      .pipe(
        map(suggestions => {
          return { statusCode: 200, body: JSON.stringify(suggestions) };
        })
      )
      .toPromise();
  } catch (err) {
    console.log(err);
    return err;
  }
};

export { lambdaHandler };
