import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
export type locations = { location_name: string; location_id: string }[]
function handlerDelete(location_id: number) {
  fetch('/api/location', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location_id,
    }),
  })
}
function onsubmit(e: React.FormEvent) {
  const target = e.target as typeof e.target & {
    location: { value: string }
  }
  fetch('/api/location', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      location: target.location.value,
    }),
  })
  console.log('onsubmit')
  return 0
}
const index = ({ locations }: { locations: locations }) => {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()
  const refreshData = () => {
    router.replace(router.asPath)
    setIsRefreshing(true)
  }
  const [location, setCity] = useState('')
  const [department, setDepartment] = useState('')
  useEffect(() => {
    document.addEventListener('mouseenter', refreshData)
    return () => {
      document.addEventListener('mouseenter', refreshData)
    }
  }, [])
  useEffect(() => {
    refreshData()
    setIsRefreshing(false)
  }, [isRefreshing])
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div className=''>
        <form
          onSubmit={(
            e: React.FormEvent<HTMLFormElement> & {
              target: { location: string }
            },
          ) => {
            e.preventDefault()
            if (e.target.location) {
              onsubmit(e)
              setCity('')
              setIsRefreshing(true)
            }
          }}
        >
          <label>
            <input
              type='text'
              name='location'
              onChange={({ target }) => setCity(target.value)}
              value={location}
            />
            Location
          </label>
          <button type='submit'>Add new location</button>
        </form>
        <ul>
          {locations.map((val, ind) => (
            <div
              key={ind}
              style={{
                display: 'flex',
                width: '20vw',
                height: '3vh',
                justifyContent: 'space-between',
              }}
            >
              <li id={'location_id_' + val.location_id}>{val.location_name}</li>
              <label
                onClick={(e) => {
                  handlerDelete(+val.location_id)
                  setIsRefreshing(true)
                }}
                htmlFor={'location_id_' + val.location_id}
                style={{
                  cursor: 'pointer',
                  color: 'green',
                  userSelect: 'none',
                }}
              >
                delete
              </label>
            </div>
          ))}
        </ul>
      </div>
      <div>
        <form>
          <label>
            <input
              type='text'
              value={department}
              onChange={({ target }) => setDepartment(target.value)}
            />
            Department
          </label>
          <select name='' id=''>
            {locations.map((val, ind, arr) => (
              <option value={val.location_name} key={ind}>
                {val.location_name}
              </option>
            ))}
          </select>
          <button type='submit'>Add department</button>
        </form>
      </div>
    </div>
  )
}
export async function getServerSideProps() {
  console.log('----\n server Side Props')
  const locations: locations = JSON.parse(
    await (await fetch(`${process.env.API_URL}location`)).json(),
  )
  const departments = JSON.parse(
    await (await fetch(`${process.env.API_URL}department`)).json(),
  )
  return {
    props: {
      locations,
      departments,
    },
  }
}
export default index
