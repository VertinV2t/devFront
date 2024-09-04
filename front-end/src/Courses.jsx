import { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom';

const temp = [
    {
        title:'temp',
    }
]
export default function Courses(){
    const [data, setData] = useState(temp)
    const [search, setSearch] = useState('')

    useEffect(() => {
        setData([]);
        axios.get('http://localhost:3000/courses')
          .then(function (response){
            setData(response.data);
          })
          .catch(function (error){
            console.log(error);
          })
          .finally(function(){})
      }, [])
    
    function reloading() {
        axios.get('http://localhost:3000/courses')
        .then(function (response){
          setData([...response.data]);
        })
        .catch(function (error){
          console.log(error);
        })
        .finally(function(){})
    }

    function display() {
        return data.filter((info) => 
            search == '' ? true:info.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())||info.level == parseInt(search)
        )
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [inputTitle, setinputTITLE] = useState('')
    const [inputDescription, setinputDESC] = useState('')
    const [inputLevel, setinputLEVEL] = useState('')

    const addNew = async() =>{
        const data = await axios.post('http://localhost:3000/courses', {
                        title: inputTitle,
                        description: inputDescription,
                        level: inputLevel
                    })
        if(data){
            setOpen(false)
            await reloading()
            setinputTITLE('');
            setinputDESC('');
            setinputLEVEL('');
        }
    }
    const [page, setPage] = useState([0,8])
    return(
        <div className='flex flex-col h-[38rem] gap-6'>
            <div className='flex flex-col gap-4'>
                <div>
                    <input type="text" className='w-full px-4 py-2 rounded-lg text-black' value={search} onChange={(e) => setSearch(e.target.value)}/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-black relative top-[-2.3rem] left-[49rem]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
                <div className='h-96 flex flex-col'>
                    <div className='grid grid-cols-2 items-start border overflow-y-scroll'>
                        {
                            display().slice(page[0], page[1]).map((item, index) => (
                                <Link key={index} className='text-white' to={'/courses/' + item.id}>
                                    <p className='text-2xl p-4 border'>{item.title} level {item.level}</p>
                                </Link>
                            ))
                        }
                    </div>
                </div>
                <div className='flex gap-10 justify-center'>
                    <button onClick={() => {page[1]/8 == 1? undefined:setPage([page[0] - 8,page[1] - 8])}}>Prev</button>
                    <p>{Math.floor((page[1])/8)}</p>
                    <button onClick={() => {display().length / page[1] < 1? undefined:setPage([page[0] + 8,page[1] + 8])}}>Next</button>
                </div>
            </div>
            <button className='rounded-full' onClick={handleOpen}>Add New</button>
            <div className={`${open ? undefined:'hidden'} absolute px-60 py-28 bg-gray-200 flex flex-col gap-8 left-auto top-auto -translate-x-[15%] text-black justify-center items-center rounded-2xl`}>
                <div className='flex items-center justify-between gap-6'>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputTitle} onChange={(e) => setinputTITLE(e.target.value)}/>
                    <p className='w-20'>Title</p>
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputDescription} onChange={(e) => setinputDESC(e.target.value)}/>
                    <p className='w-20'>Description</p>
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputLevel} onChange={(e) => setinputLEVEL(e.target.value)}/>
                    <p className='w-20'>Level</p>
                </div>
                <div className='flex gap-10'>
                    <button className='text-white' onClick={() => {addNew();}}>Confirm</button>
                    <button className='text-white' onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
    )
}