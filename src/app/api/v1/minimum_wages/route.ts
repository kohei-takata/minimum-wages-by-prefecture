import {NextRequest, NextResponse} from 'next/server'
import {promises as fs} from 'fs'
import humps from 'humps'
import {MinimumWages} from "../../../types/MinimumWages";
import url from "url";
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
  forceGetNextYear?: string
}

export async function GET(request: NextRequest) {
  const queryParams = url.parse(request.url, true).query as QueryParameter;

  const currentData = await fs.readFile(process.cwd() + CURRENT_JSON_PATH, 'utf-8')
  const currentMinimumWages = humps.camelizeKeys(JSON.parse(currentData)) as MinimumWages

  let isNextDataCreated = true
  let nextData

  try {
    nextData = await fs.readFile(process.cwd() + NEXT_JSON_PATH, 'utf-8')
  } catch (e) {
    isNextDataCreated = false
  }
  if (typeof nextData === 'undefined' || !isNextDataCreated) {
    return createResponse(currentMinimumWages)
  }

  const nextMinimumWages = humps.camelizeKeys(JSON.parse(nextData)) as MinimumWages

  if (queryParams.forceGetNextYear) {
    return createResponse(nextMinimumWages);
  }

  const mergedMinimumWages = nextMinimumWages
    .minimumWages
    .map((nextMinimumWage) => {
      const startDate = dayjs(nextMinimumWage.effectiveStartDate).tz()
      const currentDate = dayjs().tz()
      if (currentDate.isBefore(startDate)) {
        const currentMinimumWage = currentMinimumWages.minimumWages.find(
          (currentMinimumWage) => {
            return currentMinimumWage.prefectureName === nextMinimumWage.prefectureName
          })
        return currentMinimumWage
      }
      return nextMinimumWage
    })

  return createResponse({minimumWages: mergedMinimumWages} as MinimumWages)

}

const createResponse = (body: MinimumWages) => {
  const response = NextResponse.json(body);
  response.headers.set('Content-Type', 'application/json; charset=utf-8')
  return response
}