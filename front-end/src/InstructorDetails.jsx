import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { Link } from "react-router-dom"
const temp = [
    {
        name: 'temp',
        bio: 'temp',
        id: -1,
        courses: []
    }
]

export default function InstructorDetails(){
    const [data, setData] = useState(temp)
    const [courses, setCourses] = useState([])
    const id = useParams().instructorId;
    const [inputName, setinputName] = useState('')
    const [inputBio, setinputBio] = useState('')
    const [allCourse, setAC] = useState([]);

    useEffect(
        () => 
        {
            getter() 
            setCourses([])
            updateCourseList()
        }     
    , [])

    const getter = async() => {
        const data = await axios.get('http://localhost:3000/instructors/' + id)
        setData(data.data)
        setinputName(data.data.name)
        setinputBio(data.data.bio)
        

        const temp = [];
            for (let i = 0; i < data.data.courses.length; i ++){
                const course = await axios.get('http://localhost:3000/courses/' + data.data.courses[i].id)
                temp.push(course.data.title + `(${course.data.id})`)    
            }
            setCourses(temp);
    }

    const handleEdit = async() => {
        try{
            await axios.put('http://localhost:3000/instructors/' + id, {
                name: inputName,
                bio: inputBio,
            })
            await getter()
        }catch(error){
            console.log(error)
        }       
    }

    const [search, setSearch] = useState('');
    function display(){
        return allCourse.filter((item) => item.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) && search != '')
    }

    const handleDelete = async() => {
        try{
            await axios.delete('http://localhost:3000/instructors/' + id)
        }catch(error){
            console.log(error)
        }  
    }

    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [open3, setOpen3] = useState(false)
    var newId = undefined;
    
    const handleEdit2 = async() => {
        try{
            await axios.put('http://localhost:3000/courses/' + newId, {
                instructorId: id,
            })

            setCourses([])
            await getter() 
            
        }catch(error){
            console.log(error)
        }       
    }

    const handleEdit3 = async() => {
        try{
            await axios.put('http://localhost:3000/instructors/' + id, {
                courseId: newId
            })

            setCourses([])
            await getter() 
            
        }catch(error){
            console.log(error)
        }       
    }

    const updateCourseList = async() => {
        try{
            const list = await axios.get('http://localhost:3000/courses/')
            setAC(list.data);
        }catch(error){
            console.log(error)
        }
    }

    return(
        <div className="text-white p-20 flex flex-col gap-10">
            <Link to={'/instructors'} className="absolute left-20 top-10 text-3xl border px-6 py-4 rounded-full">Back</Link>
            <div className="text-5xl flex flex-col items-center gap-2">
                <p>{data.name}</p>
                <p className="text-2xl">{data.bio}</p>
                <p className="text-sm bg-slate-500 w-16 rounded-full"> ID: {data.id}</p>
            </div>
            <p className="text-3xl border-b">Classes Taught</p>
            {courses.length > 0?          
            <div className="flex justify-center text-center text-3xl gap-10">
                {
                    courses.map((item, index) => (
                        <p key={index}>{item}</p>
                    ))
                }
            </div>:
            <p className="text-3xl">No courses taught</p>
            }
            <div className="flex justify-center text-xl gap-10 items-center">
                <button className="border-white" onClick={() => setOpen(true)}>Edit</button>
                <Link className="border border-white text-white p-3 rounded-md hover:text-white hover:border-blue-600" onClick={() => {handleDelete()}} to={'/instructors'}>Delete</Link>
                <button className="border-white" onClick={() => {setOpen3(true); updateCourseList()}}>Abandon Course</button>
                <button className="border-white" onClick={() => {setOpen2(true); updateCourseList()}}>Add Course</button>
            </div>
            <div className={`${open ? undefined:'hidden'} absolute px-60 py-28 bg-gray-200 flex flex-col gap-8 left-auto top-auto -translate-x-[15%] translate-y-[10%] text-black justify-center items-center rounded-2xl`}>
                <div className='flex items-center justify-between gap-6'>
                    <p className='w-20'>Name</p>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputName} onChange={(e) => setinputName(e.target.value)}/>
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <p className='w-20'>Bio</p>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputBio} onChange={(e) => setinputBio(e.target.value)}/>
                </div>
                <div className='flex gap-10'>
                    <button className='text-white' onClick={() => {handleEdit(); setOpen(false);}}>Confirm</button>
                    <button className='text-white' onClick={() => setOpen(false)}>Cancel</button>
                </div>
            </div>
            <div className={`${open2 ? undefined:'hidden'} absolute px-60 py-28 bg-gray-200 flex flex-col gap-8 left-auto top-auto translate-y-[15%] -translate-x-[10%] text-black justify-between items-between rounded-2xl`}>
                <input type="text" value={search} onChange = {(e) => setSearch(e.target.value)} className="px-4 py-3" placeholder="Enter Course Name"/>
                <div className="overflow-x-scroll w-80">
                    <div className="flex gap-10 justify-center">
                        {
                            display().map((item, index) => (
                                <button key={index} onClick={() => {newId = item.id; handleEdit2(); setOpen2(false)}} className="text-white p-4">{item.title}</button>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <button className='text-white bg-blue-600' onClick={() => setOpen2(false)}>Cancel</button>
                </div>
            </div>
            <div className={`${open3 ? undefined:'hidden'} absolute px-60 py-28 bg-gray-200 flex flex-col gap-8 left-auto top-auto translate-y-[15%] -translate-x-[10%] text-black justify-between items-between rounded-2xl`}>
                <div className="overflow-x-scroll w-80">
                    <div className="flex gap-10">
                        {
                            courses.map((item, index) => (
                                <button key={index} onClick={() => {newId = item.slice(-2,-1); handleEdit3(); setOpen3(false)}} className="text-white p-4">{item}</button>
                            ))
                        }
                    </div>
                </div>
                <div>
                    <button className='text-white bg-blue-600' onClick={() => setOpen3(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )
}