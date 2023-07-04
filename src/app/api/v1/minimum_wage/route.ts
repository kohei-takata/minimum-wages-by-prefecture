import {NextRequest, NextResponse} from 'next/server'
import {promises as fs} from 'fs'
import humps from 'humps'
import {MinimumWages} from "../../../types/MinimumWages";
import * as url from "url";

const CURRENT_JSON_PATH = '/src/app/data/current.json'

type QueryParameter = {
  prefectureName?: string
}

export async function GET(request: NextRequest) {
  const queryParams = url.parse(request.url, true).query as QueryParameter;

  const data = await fs.readFile(process.cwd() + CURRENT_JSON_PATH, 'utf-8')
  const minimumWages = humps.camelizeKeys(JSON.parse(data)) as MinimumWages
  const errorBody = {
    message: '都道府県名の指定が不正です。',
    status: 422
  };

  const createResponse = (body: Object) => {
    const response = NextResponse.json(body);
    response.headers.set('Content-Type', 'application/json; charset=utf-8')
    return response
  }

  if (!queryParams.prefectureName) {
    return createResponse(errorBody);
  }

  const minimumWage = minimumWages.minimumWages.find((minimumWage) => {
      return minimumWage.prefectureName === queryParams.prefectureName
    }
  );

  if (minimumWage === undefined) {
    return createResponse(errorBody);
  }

  return createResponse(minimumWage);
}