import {NextRequest, NextResponse} from 'next/server'
import {promises as fs} from 'fs'
import humps from 'humps'
import {MinimumWages} from "../../../types/MinimumWages";

const CURRENT_JSON_PATH = '/src/app/data/current.json'

export async function GET(request: NextRequest) {
  const data = await fs.readFile(process.cwd() + CURRENT_JSON_PATH, 'utf-8')
  const minimumWages = humps.camelizeKeys(JSON.parse(data)) as MinimumWages

  const nextResponse = NextResponse.json(minimumWages);

  nextResponse.headers.set('Content-Type', 'application/json; charset=utf-8')
  return nextResponse;

}