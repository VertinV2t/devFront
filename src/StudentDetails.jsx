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

export default function StudentDetails(){
    const [data, setData] = useState(temp)
    const [courses, setCourses] = useState([])
    const id = useParams().studentId;
    const [inputFN, setinputFN] = useState('')
    const [inputLN, setinputLN] = useState('')
    const [inputEmail, setinputEmail] = useState('')
    useEffect(
        () => 
        {
            getter() 
            setCourses([])
        }     
    , [])

    const getter = async() => {
        const data = await axios.get('http://localhost:3000/students/' + id)
        setData(data.data)
        setinputFN(data.data.firstName)
        setinputLN(data.data.lastName)
        setinputEmail(data.data.email)
        const temp = [];
            for (let i = 0; i < data.data.enrollments.length; i ++){
                const course = await axios.get('http://localhost:3000/courses/' + data.data.enrollments[i].courseId)
                temp.push(course.data.title)
                console.log(courses)  
            }
        setCourses(temp);
    }

    const handleEdit = async() => {
        try{
            await axios.put('http://localhost:3000/students/' + id, {
                firstName: inputFN,
                lastName: inputLN,
                email: inputEmail,
            })
            getter()
        }catch(error){
            console.log(error)
        }       
    }

    const handleDelete = async() => {
        try{
            await axios.delete('http://localhost:3000/students/' + id)
        }catch(error){
            console.log(error)
        }  
    }

    const [open, setOpen] = useState(false)

    return(
        <div className="text-white p-20 flex flex-col gap-10">
            <Link to={'/students'} className="absolute left-20 top-10 text-3xl border px-6 py-4 rounded-full">Back</Link>
            <div className="text-5xl flex flex-col items-center gap-2">
                <p>{data.firstName} {data.lastName}</p>   
                <p className="text-2xl">{data.email}</p>
                <p className="text-sm bg-slate-500 w-16 rounded-full"> ID: {data.id}</p>
            </div>
            <p className="text-3xl border-b">Enrollments</p>
            {courses.length > 0?          
            <div className="flex justify-center text-center text-3xl gap-10">
                {
                    courses.map((item, index) => (
                        <p key={index}>{item}</p>
                    ))
                }
            </div>:
            <p className="text-3xl">No courses enrolled</p>
            }
            <div className="flex justify-center text-xl gap-10 items-center">
                <button className="border-white" onClick={() => setOpen(true)}>Edit</button>
                <Link className="border border-white text-white p-3 rounded-md hover:text-white hover:border-blue-600" onClick={() => {handleDelete()}} to={'/students'}>Delete</Link>
            </div>
            <div className={`${open ? undefined:'hidden'} absolute px-60 py-28 bg-gray-200 flex flex-col gap-8 left-auto top-auto -translate-x-[32%] text-black justify-center items-center rounded-2xl`}>
                <div className='flex items-center justify-between gap-6'>
                    <p className='w-20'>First Name</p>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputFN} onChange={(e) => setinputFN(e.target.value)}/>
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <p className='w-20'>Last Name</p>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputLN} onChange={(e) => setinputLN(e.target.value)}/>
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <p className='w-20'>Email</p>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputEmail} onChange={(e) => setinputEmail(e.target.value)}/>
                </div>
                <div className='flex gap-10'>
                    <button className='text-white' onClick={() => {handleEdit(); setOpen(false);}}>Confirm</button>
                    <button className='text-white' onClick={() => setOpen(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}