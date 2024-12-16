import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { getUserByEmail } from "../../../services/userService"
import { addFeedback, deleteFeedback, getAllFeedbacks, updateFeedback } from "../../../services/productService"
import User from "../blog/User";
import moment from "moment";
const Feedback = (props)=>{
    const [arrInput,setArrInput]=useState({
        content:''
    })
    const [arrInputEdit,setArrInputEdit]=useState({
        content:''
    })
    const [arrFeedback,setArrFeedback]=useState([])
    const [userId,setUserId]=useState('');
    const [currentId, setCurrentId] = useState('');
    const [isEdit,setIsEdit]=useState(false);


    const handleChange=(e)=>{
        const {name,value}=e.target
        setArrInput({...arrInput,[name]:value});
    }
    const handleChangeEdit=(e)=>{
        const {name,value}=e.target
        setArrInputEdit({...arrInput,[name]:value});
    }
    useEffect(()=>{
        
        getFeedbacksFromReact();
    },[])
    const getFeedbacksFromReact=async()=>{
        const res = await getAllFeedbacks('ALL');
        if(res && res.data.errCode===0){
            setArrFeedback(res.data.feedbacks);
        }
    } 
    useEffect(()=>{
        const getUser = async()=>{
            let email = localStorage.getItem('email');
            if (email) {
                let user = await getUserByEmail(email);
                if (user && user.data.errCode === 0) {
                    setUserId(user.data.user.id)
                }
            }
          }
          getUser();
    },[]);
    const handleAddFeedback = async()=>{
        const {content}=arrInput;
        const data = {content:content,userId:userId,productId:props.productId}
        console.log('modal reactjs:',data)
        if(data.userId === ''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please login or resgiter!',
              })
        }else if(data.content===''){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please check your input!',
                })
        }else{
            let add = await addFeedback(data);
            console.log(add);
            if(add && add.data.errCode === 0){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                  })
                  setArrInput({
                    content:''
                  });
                await getFeedbacksFromReact();
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: add.data.message,
                  })
            }
        }
    }
    const handleEditFeedback = (item)=>{
        setCurrentId(item.id);
        setIsEdit(!isEdit);
        setArrInputEdit({
            content:item.content
        })

    }
    const handleSaveFeedback = async(item)=>{
        try {
            const data = {id:item.id,content:arrInputEdit.content}
            const update = await updateFeedback(data);
            console.log(update);
            if(update && update.data.errCode===0){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                  })
                setIsEdit(false);
                await getFeedbacksFromReact();
                
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
              })
        }
    }
    const handleDeleteFeedback= (feedbackId)=>{
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(async(result) => {
            if (result.isConfirmed) {
                try {
                    let res = await deleteFeedback(feedbackId);
                    if(res && res.data.errCode === 0){
                        Swal.fire(
                            'Deleted!',
                            res.data.errMessage,
                            'success'
                        )
                        await getFeedbacksFromReact();
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: res.data.errMessage,
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error,
                    })
                }
                
            }
          })
        
    }
    return(
        <>
            <div class="bg-light rounded-3 px-3 py-4 mt-5 border">
            <p><b>Write Feedback ...</b><i class="fa-solid fa-pen"></i></p>
            <div>
                <textarea name="content" value={arrInput.content} class="form-control mb-1" rows="3" placeholder="Feedback about product..." onChange={(e)=>handleChange(e)}></textarea>
                    <button onClick={()=>{handleAddFeedback()}} class="btn btn-primary my-2">Post</button>
                </div>
            </div>
            <hr />
            <div>
                <h5>View Feedback</h5>
                {arrFeedback && arrFeedback.map(item => {
                    return item.productId === props.productId && (
                        <div class="border rounded-1 p-3 mb-3 row justify-content-between align-items-center">
                            <div className="col-md-10">
                                <User userId={item.userId} />
                                <span class="text-muted" style={{fontSize:"14px"}}>{moment(item.createdAt).format("YYYY.MM.DD hh:mm")}</span>
                                {currentId === item.id && isEdit ?
                                    <input type="text" value={arrInputEdit.content} name="content" onChange={handleChangeEdit} className="form-control"/>
                                :
                                <p class="me-2">{item.content}</p>
                                    }
                                
                            </div>
                            <div className="col-md-2">
                                {item.userId === userId && (
                                    <>
                                    {currentId === item.id && isEdit ?
                                    <button className="btn" onClick={()=>handleSaveFeedback(item)}><i class="fa-regular fa-floppy-disk text-success"></i></button>
                                    :
                                    <button className="btn" onClick={()=>handleEditFeedback(item)}><i class="fa-regular fa-pen-to-square text-success"></i></button>
                                    }
                                    <button className="btn" onClick={()=>handleDeleteFeedback(item.id)}><i class="fa-regular fa-trash-can text-danger"></i></button>
                                    </>
                                )}
                            </div>
                        </div>
                        
                    )
                })}
                
            </div>
        </>
    )
}

export default Feedback;