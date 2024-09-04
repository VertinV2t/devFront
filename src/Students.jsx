import { useEffect, useState } from 'react'
import axios from 'axios';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';

const temp = [
    {
        firstName:'temp',
        lastName:'temp',
        id: -1
    }
]
export default function Students(){
    const [data, setData] = useState(temp)
    const [search, setSearch] = useState('')

    useEffect(() => {
        setData([]);
        axios.get('http://localhost:3000/students')
          .then(function (response){
            setData(response.data);
          })
          .catch(function (error){
            console.log(error);
          })
          .finally(function(){})
      }, [])
    
    function reloading() {
        axios.get('http://localhost:3000/students')
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
            search == '' ? true:info.firstName.toLocaleLowerCase().includes(search.toLocaleLowerCase())||info.lastName.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
    }

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [inputFN, setinputFN] = useState('')
    const [inputLN, setinputLN] = useState('')
    const [inputEmail, setinputEmail] = useState('')

    const addNew = async() =>{
        const data = await axios.post('http://localhost:3000/students', {
                        firstName: inputFN,
                        lastName: inputLN,
                        email: inputEmail
                    })
        if(data){
            setOpen(false)
            await reloading()
            setinputFN('');
            setinputLN('');
            setinputEmail('');
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
                            display().slice(page[0],page[1]).map((item, index) => (
                                <Link key={index} className='text-white' to={'/students/' +  item.id}>
                                    <p className='text-2xl p-4 border'>{item.firstName} {item.lastName}</p>
                                </Link>
                            ))
                        }
                    </div>
                </div>
                <div className='flex gap-10 justify-center item-center'>
                    <button onClick={() => {page[1]/8 == 1? undefined:setPage([page[0] - 8,page[1] - 8])}}>Prev</button>
                    <p>{Math.floor((page[1])/8)}</p>
                    <button onClick={() => {display().length / page[1] < 1? undefined:setPage([page[0] + 8,page[1] + 8])}}>Next</button>
                </div>
            </div>
            <button className='rounded-full' onClick={handleOpen}>Add New</button>
            <div className={`${open ? undefined:'hidden'} absolute px-60 py-28 bg-gray-200 flex flex-col gap-8 left-auto top-auto -translate-x-[15%] text-black justify-center items-center rounded-2xl`}>
                <div className='flex items-center justify-between gap-6'>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputFN} onChange={(e) => setinputFN(e.target.value)}/>
                    <p className='w-20'>First Name</p>
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputLN} onChange={(e) => setinputLN(e.target.value)}/>
                    <p className='w-20'>Last Name</p>
                </div>
                <div className='flex items-center justify-between gap-6'>
                    <input type="text" className='bg-gray-400 w-80 px-4 rounded-xl py-4' value={inputEmail} onChange={(e) => setinputEmail(e.target.value)}/>
                    <p className='w-20'>Email</p>
                </div>
                <div className='flex gap-10'>
                    <button className='text-white' onClick={() => { addNew();}}>Confirm</button>
                    <button className='text-white' onClick={handleClose}>Cancel</button>
                </div>
            </div>
        </div>
        
    )
}