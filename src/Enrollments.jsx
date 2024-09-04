import { useEffect, useState } from 'react'
import axios from 'axios';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

const temp = [
    {
        courseId: -1,
        studentId: -1,
    }
]

const finaltemp = [
    {
        studentName: 'temp',
        studentId: -1, 
        courseName: 'temp',
        courseId: -1
    }
]

export default function Enrollments() {
    const [data, setData] = useState()
    const [search, setSearch] = useState('')
    const [studentName, setSN] = useState('')
    const [courseName, setCN] = useState('');
    const [finalData, setFinal] = useState('');
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setData([]);
        reloading();
      }, [])

    const reloading = async() => {
        const data = await axios.get('http://localhost:3000/enrollments');
        if(data){
            setData(data.data)
            const temp = [];
            const temp2 = [];
            for (let i = 0; i < data.data.length; i ++){
                const Sname = await axios.get('http://localhost:3000/students/' + data.data[i].studentId)
                    temp.push(Sname.data.firstName)
                const Cname = await axios.get('http://localhost:3000/courses/' + data.data[i].courseId)
                    temp2.push(Cname.data.title)
            }
            setSN(temp)
            setCN(temp2)
            setLoading(false)
        }
    }

    function display() {
        const temp = data.filter((info) => 
            search == ''? true:
            info.studentId == parseInt(search) || info.courseId == parseInt(search)
        )
        return temp
    }
    

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [inputCourseId, setinputCourseId] = useState('')
    const [inputStudentId, setinputStudentId] = useState('')

    const addNew = async() =>{
        const data = await axios.post('http://localhost:3000/enrollments', {
                        courseId: inputCourseId,
                        studentId: inputStudentId,
                    })
        if(data){
            setOpen(false)
            await reloading()
            setinputCourseId('');
            setinputStudentId('');
        }
    }

    if (loading){
        return (
            <div>Loading..</div>
        )
    }
    return(
        <div className='flex flex-col h-[38rem] gap-6'>
            <div className='flex flex-col gap-4'>
                <div className='hidden'>
                    <input type="text" className='w-full px-4 py-2 rounded-lg text-black' value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-black relative top-[-2.3rem] left-[49rem]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <div className='h-96 flex flex-col'>
                    <p className='text-3xl pb-4'>All enrollments</p>
                    <div className='grid grid-cols-1 items-start border overflow-y-scroll'>
                        {
                            display().map((item, index) => (
                                <Link key={index} className='text-white' to={'/enrollments/' +  item.id}>
                                    <p className='text-2xl p-4 border'>{studentName[index] + `(${item.studentId})` + ' -> ' + courseName[index] + `(${item.courseId})`}</p>
                                </Link>
                            ))
                        }
                    </div>
                </div>
                <p>scroll down for more rows</p>
            </div>
            <button className='rounded-full' onClick={handleOpen}>Add New</button>
            <div className={`${open ? undefined:'hidden'} absolute px-60 py-28 bg-gray-200 flex flex-col gap-8 left-auto top-auto -translate-x-[15%] text-black justify-center items-center rounded-2xl`}>
                <div className='flex items-center justify-between gap-6'>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputCourseId} onChange={(e) => setinputCourseId(e.target.value)}/>
                    <p className='w-20'>Course ID</p>
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputStudentId} onChange={(e) => setinputStudentId(e.target.value)}/>
                    <p className='w-20'>Student ID</p>
                </div>
                <div className='flex gap-10'>
                    <button className='text-white' onClick={() => { addNew();}}>Confirm</button>
                    <button className='text-white' onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
        
    )
}