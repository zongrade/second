import { NextApiRequest, NextApiResponse } from 'next'
import defExpIff, { TresponceFunc } from '../../components/tests/defExpIff'
import { pool } from '../../lib/db'
async function checkDepartments(id: number) {
  try {
    return {
      function: checkDepartments.name,
      status: ('' +
        ((
          await pool.query(
            `select location_id FROM locations where locations.location_name = '${location}'`,
          )
        ).rowCount > 0
          ? true
          : false)) as 'true' | 'false',
    }
  } catch (error) {
    return {
      errorMsg: JSON.stringify(error),
      function: checkDepartments.name,
      status: 'error' as const,
    }
  }
}
async function getDepartments(): TresponceFunc<any[]> {
  try {
    const payload = (
      await pool.query(`select department_name FROM departments`)
    ).rows
    return { payload, function: getDepartments.name, status: 'true' as const }
  } catch (error) {
    return {
      errorMsg: JSON.stringify(error),
      function: getDepartments.name,
      status: 'error' as const,
    }
  }
}
async function postDepartment(
  department_name: string,
  location_id: number,
): TresponceFunc<any[]> {
  try {
    return {
      payload: (
        await pool.query(
          `insert into departments (department_name,location_id) VALUES ('${department_name},${location_id}')`,
        )
      ).rows,
      function: postDepartment.name,
      status: 'true' as const,
    }
  } catch (error) {
    return {
      errorMsg: JSON.stringify(error),
      function: postDepartment.name,
      status: 'error' as const,
    }
  }
}
async function deleteDepartment(
  department_id: number,
): TresponceFunc<undefined> {
  try {
    return {
      function: postDepartment.name,
      status: JSON.stringify(
        (
          await pool.query(
            `delete from departments where departments_id=${department_id}`,
          )
        ).rowCount > 0,
      ) as 'true' | 'false',
    }
  } catch (error) {
    return {
      errorMsg: JSON.stringify(error),
      function: postDepartment.name,
      status: 'error' as const,
    }
  }
}
export default defExpIff(getDepartments, postDepartment, deleteDepartment)
