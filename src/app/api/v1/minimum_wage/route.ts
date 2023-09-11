import {NextRequest, NextResponse} from 'next/server'
import {promises as fs} from 'fs'
import humps from 'humps'
import {MinimumWages} from "../../../types/MinimumWages";
import * as url from "url";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {MinimumWage} from "../../../types/MinimumWage";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Tokyo");

const CURRENT_JSON_PATH = '/src/app/data/current.json'
const NEXT_JSON_PATH = '/src/app/data/next.json'

type QueryParameter = {
  prefectureName?: string
  forceGetNextYear?: string
}

type ErrorBody = {
  message: string,
  status: number
}

export async function GET(request: NextRequest) {
  const queryParams = url.parse(request.url, true).query as QueryParameter;

  const currentData = await fs.readFile(process.cwd() + CURRENT_JSON_PATH, 'utf-8')
  const currentMinimumWages = humps.camelizeKeys(JSON.parse(currentData)) as MinimumWages
  const errorBody: ErrorBody = {
    message: '都道府県名の指定が不正です。',
    status: 422
  };

  if (!queryParams.prefectureName) {
    return createErrorResponse(errorBody);
  }

  const currentMinimumWage = currentMinimumWages.minimumWages.find((minimumWage) => {
      return minimumWage.prefectureName === queryParams.prefectureName
    }
  );

  if (typeof currentMinimumWage === 'undefined') {
    return createErrorResponse(errorBody);
  }

  let isNextDataCreated = true
  let nextData

  try {
    nextData = await fs.readFile(process.cwd() + NEXT_JSON_PATH, 'utf-8')
  } catch (e) {
    isNextDataCreated = false
  }

  if (typeof nextData === 'undefined' || !isNextDataCreated) {
    return createResponse(currentMinimumWage);
  }

  const nextMinimumWages = humps.camelizeKeys(JSON.parse(nextData)) as MinimumWages
  const nextMinimumWage = nextMinimumWages.minimumWages.find((minimumWage) => {
      return minimumWage.prefectureName === queryParams.prefectureName
    }
  );

  if (typeof nextMinimumWage === 'undefined') {
    return createErrorResponse(errorBody);
  }

  if (queryParams.forceGetNextYear) {
    return createResponse(nextMinimumWage);
  }

  const startDate = dayjs(nextMinimumWage.effectiveStartDate).tz()
  const currentDate = dayjs().tz()

  if (currentDate.isBefore(startDate)) {
    return createResponse(currentMinimumWage);
  }
  return createResponse(nextMinimumWage);

}

const createResponse = (body: MinimumWage) => {
  const response = NextResponse.json(body);
  response.headers.set('Content-Type', 'application/json; charset=utf-8')
  return response
}

const createErrorResponse = (errBody: ErrorBody) => {
  const response = NextResponse.json(errBody);
  response.headers.set('Content-Type', 'application/json; charset=utf-8')
  return response
}