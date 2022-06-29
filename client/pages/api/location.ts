import { NextApiRequest, NextApiResponse } from 'next'
import { pool } from '../../lib/db'
export const arrOfErrors: { code: string; error: string }[] = [
  { code: '23505', error: 'уже существует' },
  { code: '42601', error: 'Syntax error on database request' },
]
const enum HttpMethods {
  'POST' = 'POST',
  'GET' = 'GET',
  'DELETE' = 'DELETE',
}
const arrOfMethods = ['POST', 'GET', 'DELETE']
function firstLetterToUpperCase(req: { body: { location: string } }) {
  return req.body.location.charAt(0).toUpperCase() + req.body.location.slice(1)
}
async function deleteLocation(location_id: number) {
  try {
    return (
      (
        await pool.query(
          `delete from locations where location_id = ${location_id}`,
        )
      ).rowCount > 0
    )
  } catch (error) {
    return false
  }
}
async function checkLocation(location: string) {
  //true есть, false нет
  try {
    return (
      await pool.query(
        `select location_id FROM locations where locations.location_name = '${location}'`,
      )
    ).rowCount > 0
      ? true
      : false
  } catch (error) {
    return false
  }
}
async function getLocation() {
  console.log('get location')
  try {
    return (await pool.query(`select * FROM locations`)).rows
  } catch (error) {
    return []
  }
}
async function postLocation(location: string) {
  console.log('post location')
  try {
    await pool.query(
      `insert into locations (location_name) VALUES ('${location}')`,
    )
    return true
  } catch (error) {
    return false
  }
}
export default async function (
  req: NextApiRequest & {
    body: {
      location: string
      location_id?: number
    }
  },
  res: NextApiResponse,
) {
  console.log('switch in location')
  console.log(req.method)
  switch (req.method) {
    case HttpMethods.POST:
      if (!(req.body.location as string)?.trim()) {
        res.status(400).json({ error: 'No location' })
        return
      }
      const location = firstLetterToUpperCase(req)
      let alreadyHas = await checkLocation(location)
      if (!alreadyHas) {
        return postLocation(location).then(
          (data) =>
            res.status(201).json({
              method: HttpMethods.POST,
              body: location,
            }),
          (error: { code: string }) => {
            return res.status(409).json({
              method: HttpMethods.POST,
              body: req.body.location,
              error:
                arrOfErrors[
                  arrOfErrors.reduce((prev, curr, ind, arr) => {
                    if (curr.code === error.code) {
                      return ind
                    } else return prev
                  }, -1)
                ].error ?? 'unknown error',
            })
          },
        )
      } else {
        return res.status(409).json({
          method: HttpMethods.POST,
          body: req.body.location,
          error: arrOfErrors[0],
        })
      }
    case HttpMethods.GET:
      return res.status(200).json(JSON.stringify(await getLocation()))
    case HttpMethods.DELETE:
      if (req.body.location_id) {
        const isDeleted = await deleteLocation(+req.body.location_id)
        if (isDeleted)
          return res
            .status(200)
            .json({ method: HttpMethods.DELETE, body: req.body.location_id })
        return res.status(400).json({
          method: HttpMethods.DELETE,
          body: req.body.location_id,
          error: 'unknown error',
        })
      }
      return
    default:
      res.status(400).json({ error: 'Unknown method' })
      return
  }
}
