import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
const temp = [
    {
        title: 'temp',
        description: 'temp',
        level: -1,
        id: -1,
        enrollments: [],
        instructorId: -1
    }
]

export default function CourseDetails(){
    const [data, setData] = useState(temp)
    const [students, setStudents] = useState([])
    const [instructors, setInstructors] = useState()
    const id = useParams().courseId;
    const [inputTitle, setinputTitle] = useState('')
    const [inputDescription, setinputDescription] = useState('')
    const [inputLevel, setinputLevel] = useState(-1);
    const [allStudent, setAS] = useState([])

    useEffect(
        () => 
        {
            setStudents([])
            getter() 
            updateCourseList()
        }     
    , [])

    const getter = async() => {
        const data = await axios.get('http://localhost:3000/courses/' + id)
        console.log(data)
        setData(data.data)
        setinputTitle(data.data.title)
        setinputDescription(data.data.description)
        setinputLevel(data.data.level)
        if(data){
            if (data.data.instructorId != null){const name = await axios.get('http://localhost:3000/instructors/' + data.data.instructorId)
            setInstructors(name.data.name)}
        const temp = [];
            for (let i = 0; i < data.data.enrollments.length; i ++){
                const student = await axios.get('http://localhost:3000/students/' + data.data.enrollments[i].studentId)
                temp.push(student.data.firstName + ' ' + student.data.lastName) 
            }
            setStudents(temp);
        }
    }

    const handleEdit = async() => {
        try{
            await axios.put('http://localhost:3000/courses/' + id, {
                title: inputTitle,
                description: inputDescription,
                level: inputLevel,
            })
            await getter()
        }catch(error){
            console.log(error)
        } 
    }

    const handleDelete = async() => {
        try{
            await axios.delete('http://localhost:3000/courses/' + id)
        }catch(error){
            console.log(error)
        }  
    }
    const [search, setSearch] = useState('');
    function display(){
        return allStudent.filter((item) => item.firstName.toLocaleLowerCase().includes(search.toLocaleLowerCase()) && search != '' || item.lastName.toLocaleLowerCase().includes(search.toLocaleLowerCase()) && search != '')
    }

    const updateCourseList = async() => {
        try{
            const list = await axios.get('http://localhost:3000/students/')
            setAS(list.data);
        }catch(error){
            console.log(error)
        }
    }
    
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    var newId = undefined;
    const handleEdit2 = async() => {
        try{
            await axios.post('http://localhost:3000/enrollments/', {
                studentId: newId,
                courseId: id
            })
            await getter()
        }catch(error){
            console.log(error)
        }       
    }

    return(
        <div className="text-white p-20 flex flex-col gap-10">
            <Link to={'/courses'} className="absolute left-20 top-10 text-3xl border px-6 py-4 rounded-full">Back</Link>
            <div className="text-5xl flex flex-col items-center gap-2">
                <p>{data.title}</p>
                <p className="text-2xl">{data.description}</p>
                <p className="text-xl">Level {data.level}</p>
                <p className="text-sm bg-slate-500 w-16 rounded-full"> ID: {data.id}</p>
                {instructors != null? <div className="text-lg">Instructor: {instructors}</div>:undefined}
            </div>
            <p className="text-3xl border-b">Students</p>
            {students.length > 0?          
            <div className="grid grid-cols-3 justify-center text-center text-3xl gap-10">
                {
                    students.map((item, index) => (
                        <p key={index}>{item}</p>
                    ))
                }
            </div>:
            <p className="text-3xl">No students yet</p>
            }
            <div className="flex justify-center text-xl gap-10 items-center">
                <button className="border-white" onClick={() => setOpen(true)}>Edit</button>
                <Link className="border border-white text-white p-3 rounded-md hover:text-white hover:border-blue-600" onClick={() => {handleDelete()}} to={'/courses'}>Delete</Link>
                <button className="border-white" onClick={() => {setOpen2(true); updateCourseList()}}>Add Students</button>            </div>
            <div className={`${open && !open2? undefined:'hidden'} absolute px-60 py-28 bg-gray-200 flex flex-col gap-8 left-auto top-auto -translate-x-[22%] text-black justify-center items-center rounded-2xl`}>
                <div className='flex items-center justify-between gap-6'>
                    <p className='w-20'>Title</p>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputTitle} onChange={(e) => setinputTitle(e.target.value)}/>   
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <p className='w-20'>Description</p>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputDescription} onChange={(e) => setinputDescription(e.target.value)}/>
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <p className='w-20'>Level</p>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputLevel} onChange={(e) => setinputLevel(e.target.value)}/>
                </div>
                <div className='flex gap-10'>
                    <button className='text-white' onClick={() => {handleEdit(); setOpen(false);}}>Confirm</button>
                    <button className='text-white' onClick={() => setOpen(false)}>Cancel</button>
                </div>
            </div>
            <div className={`${open2 ? undefined:'hidden'} absolute px-60 py-36 bg-gray-200 flex flex-col gap-8 left-auto top-auto -translate-x-[25%] translate-y-[15%] text-black justify-between items-between rounded-2xl w-[65rem]`}>
                <input type="text" value={search} onChange = {(e) => setSearch(e.target.value)} className="px-4 py-3" placeholder="Enter Student Name"/>
                <div className="flex flex-col justify-center items-center overflow-x-scroll w-[50rem] -translate-x-[15%]">
                    <div className="flex gap-10">
                        {
                            display().map((item, index) => (
                                <button key={index} onClick={() => {newId = item.id; handleEdit2(); setOpen2(false)}} className="text-white p-4 w-40">{item.firstName} {item.lastName}</button>
                            ))
                        }
                    </div> 
                </div>
                <div>
                    <button className='text-white bg-blue-600' onClick={() => setOpen2(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}