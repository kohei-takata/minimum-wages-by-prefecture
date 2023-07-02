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

  if (!queryParams.prefectureName) {
    return NextResponse.json(minimumWages)
  } else {

    if (typeof minimumWages.minimumWages.find((minimumWage) => {
        return minimumWage.prefectureName === queryParams.prefectureName
      }
    ) === 'undefined') {
      return NextResponse.json({
        message: '都道府県名の指定が不正です。',
        status: 422
      })
    }

    return NextResponse.json({
        minimumWages: minimumWages.minimumWages.filter(
          (minimumWage) => {
            return minimumWage.prefectureName === queryParams.prefectureName
          }
        )
      }
    )
  }

}