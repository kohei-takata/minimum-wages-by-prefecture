import {NextResponse} from 'next/server'
import {promises as fs} from 'fs'

export async function GET() {
  const path = '/src/app/data/current.json'
  const json = await fs.readFile(process.cwd() + path, 'utf-8')

  return NextResponse.json(JSON.parse(json))
}