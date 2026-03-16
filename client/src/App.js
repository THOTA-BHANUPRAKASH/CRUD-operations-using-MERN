
import './App.css';
import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios'

axios.defaults.baseURL="http://localhost:5000/"
function App() {
  const [addbtn,setaddbtn]=useState(false)
  const[formdata,setformdata]=useState({
    name:'',
    email:'',
    mobile:''
  })
  const[datalist,setDatalist]=useState([])
  const[editId,setEditId] = useState(null)

  const handleOnChange=(e)=>{
    const {value,name}=e.target;
    setformdata((preve)=>{
      return{
        ...preve,
        [name]:value
      }
    })
  }
// CREATE
  const submitbtn=async(e)=>{
    e.preventDefault();

    if(!formdata.name || !formdata.email || !formdata.mobile){
      alert("please fill the details");
      return;
    }
    if(editId){
      await axios.post("/create",formdata)
    }else{
      await axios.post("/create",formdata)
    }

    await getfetchData();
    setaddbtn(false);
    setEditId(null)

    setformdata({
      name:'',
      email:'',
      mobile:''
    })
  }


//GET
  const getfetchData=async()=>{
    const data=await axios.get("/get");
    console.log(data)
    setDatalist(data.data);    
  }
  useEffect(()=>{
    getfetchData()
  },[])


// DELETE
  const handleDelete=async(id)=>{
    const confirm=window.confirm("Are you sure want to  delete?")
    if(confirm){
      await axios.delete(`/delete/${id}`)
      getfetchData()
    } 
  }

//EDIT/UPDATE
  const handleEdit=(ele)=>{
    setformdata({
      name:ele.name,
      email:ele.email,
      mobile:ele.mobile
    })
    setEditId(ele._id)
    setaddbtn(true)
  }

  

  return (
    <div className="container">
      <button className="btn-add" onClick={()=>setaddbtn(true)}>Add</button>

      {
        addbtn &&(
           <div className="addcontainer">

        <form onSubmit={submitbtn}>
          <button type="button" className='cross-btn' onClick={()=>setaddbtn(false)}>❌</button>

          <label>Name:</label>
          <input type="text" name="name" placeholder="valid Name" onChange={handleOnChange} value={formdata.name}/>

          <label>Email:</label>
          <input type="email" name="email" placeholder='Ex:123@gmail.com' onChange={handleOnChange} value={formdata.email}/>

          <label>Mobile:</label>
          <input type="tel" name="mobile" placeholder='Enter valid number' onChange={handleOnChange} value={formdata.mobile} />

          <button className='submit'>{editId ? "update":"submit"}</button>
        </form>
      </div>
        )
      }
      {
        !addbtn &&(
        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            
            { datalist.length ===0?(
              <tr>
                <td colSpan={"4"} style={{textAlign:"center"}}>No Data Avilable</td>
              </tr>
            ):(
              datalist.map((ele)=>(
                  <tr key ={ele._id} className='show-data'>
                    <td>{ele.name}</td>
                    <td>{ele.email}</td>
                    <td>{ele.mobile}</td>
                    <td>
                      <button className='btn-edit'  onClick={()=>handleEdit(ele)}>Edit</button>
                      <button className='btn-delete' onClick={()=>handleDelete(ele._id)}>Delete</button>
                    </td>
                  </tr>
                  )
                )
            )}
           
          </tbody>
          </table>
        </div>
        )
      }
    </div>
  );
};



export default App;
