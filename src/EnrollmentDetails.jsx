import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
const temp = [
    {
        firstName: 'temp',
        lastName: 'temp', 
        email: 'temp', 
        id: -1,
        enrollments: [],
        enrollmentDate: null
    }
]

export default function EnrollmentDetails(){
    const [data, setData] = useState(temp)
    const [courses, setCourses] = useState([])
    const id = useParams().id;
    const [inputCourseId, setinputCourseId] = useState('')
    const [name, setName] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(
        () => 
        {
            getter() 
        }     
    , [])

    const getter = async() => {
        const data = await axios.get('http://localhost:3000/enrollments/' + id)
        setData(data.data)
        console.log(data)
        if (data){
            const Sname = await axios.get('http://localhost:3000/students/' + data.data.studentId)
                    setName(Sname.data.firstName)
            const Cname = await axios.get('http://localhost:3000/courses/' + data.data.courseId)
                    setCourses(Cname.data.title)
        }
    }

    const handleEdit = async() => {
        try{
            await axios.put('http://localhost:3000/enrollments/' + id, {
                courseId: inputCourseId,
            })
            getter()
        }catch(error){
            console.log(error)
        }       
    }

    const handleDelete = async() => {
        try{
            await axios.delete('http://localhost:3000/enrollments/' + id)
        }catch(error){
            console.log(error)
        }  
    }

    const [open, setOpen] = useState(false)

    return(
        <div className="text-white p-20 flex flex-col gap-10 ">
            <Link to={'/enrollments'} className="absolute left-20 top-10 text-3xl border px-6 py-4 rounded-full">Back</Link>
            <div className="text-5xl flex flex-col items-center gap-2">
                <div className="flex items-center gap-10 justify-center">
                    <p>{name}</p>
                    <p>{'->'}</p>
                    <p>{courses}</p> 
                </div>
                <p className="text-sm bg-slate-500 w-16 rounded-full"> ID: {data.id}</p>
            </div>
            
            <div className="flex justify-center text-xl gap-10 items-center">
                <button className="border-white" onClick={() => setOpen(true)}>Edit</button>
                <Link className="border border-white text-white p-3 rounded-md hover:text-white hover:border-blue-600" onClick={() => {handleDelete()}} to={'/enrollments'}>Delete</Link>
            </div>
            <div className={`${open ? undefined:'hidden'} absolute px-60 py-28 bg-gray-200 flex flex-col gap-8 left-auto top-auto -translate-x-[32%] text-black justify-center items-center rounded-2xl`}>
                <div className='flex items-center justify-between gap-6'>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputCourseId} onChange={(e) => setinputCourseId(e.target.value)}/>
                    <p className='w-20'>New Course ID</p>
                </div>
                <div className='flex gap-10'>
                    <button className='text-white' onClick={() => {handleEdit(); setOpen(false);}}>Confirm</button>
                    <button className='text-white' onClick={() => setOpen(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}