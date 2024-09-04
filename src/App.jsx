import { useEffect, useState } from 'react'
import './App.css'
import { Link, Outlet } from 'react-router-dom';

const temp = [];

function App() {  
  const link = window.location.href.slice(22);
  const [current, setCurrent] = useState(link.toLocaleUpperCase().slice(0,1)+link.slice(1).toLocaleLowerCase());

  return (
    <>
      <div className='flex gap-10 w-[70rem] border p-10 rounded-3xl h-full bg-neutral-800'>
        <div className='flex flex-col gap-10 text-2xl'>
          <p className='font-bold'>{current}</p>
          <div className='flex flex-col gap-4'>
            <Link onClick={() => setCurrent('Students')} className={`${current == 'Students'? 'bg-gray-500':'bg-neutral-700'} w-40 px-4 py-2 rounded-xl hover:outline text-white`} to={'/students'}>Students</Link>
            <Link onClick={() => setCurrent('Instructors')} className={`${current == 'Instructors'? 'bg-gray-500':'bg-neutral-700'} w-40 px-4 py-2 rounded-xl hover:outline text-white`} to={'/instructors'}>Instructors</Link>
            <Link onClick={() => setCurrent('Courses')} className={`${current == 'Courses'? 'bg-gray-500':'bg-neutral-700'} w-40 px-4 py-2 rounded-xl hover:outline text-white`} to={'/courses'}>Courses</Link>
            <Link onClick={() => setCurrent('Enrollments')} className={`${current == 'Enrollments'? 'bg-gray-500':'bg-neutral-700'} w-40 px-4 py-2 rounded-xl hover:outline text-white`} to={'/enrollments'}>Enrollments</Link>
          </div>
        </div>
        <div className='w-full m-0 h-full'>
          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
