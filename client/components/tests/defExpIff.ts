import { NextApiRequest, NextApiResponse } from 'next'
const enum HttpMethods {
  'POST' = 'POST',
  'GET' = 'GET',
  'DELETE' = 'DELETE',
}
export type TresponceFunc<Tpayload> = Promise<{
  payload?: Tpayload
  function: string
  status: 'true' | 'false' | 'error'
  errorMsg?: string
}>
type TdepartmentFunc<Tpayload, K extends any[]> = (
  ...anotherArg: K
) => TresponceFunc<Tpayload>
export default function (
  getFunc: TdepartmentFunc<any[], []>,
  postFunc: TdepartmentFunc<any[], [string, number]>,
  deleteFunc: TdepartmentFunc<undefined, [number]>,
) {
  return function (
    req: NextApiRequest & {
      body: {
        location: string
        location_id?: number
      }
    },
    res: NextApiResponse,
  ) {
    switch (req.method) {
      case HttpMethods.GET:
        getFunc()
      case HttpMethods.DELETE:
        deleteFunc(1)
      case HttpMethods.POST:
        postFunc('s', 1)
      default:
        res.status(400).json({ error: 'Unknown method' })
        return
    }
  }
}
//export default function sas() {
//  return 0
//}
