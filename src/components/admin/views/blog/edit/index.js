import { useEffect, useState } from "react";
import { Button } from "reactstrap";
import swal from 'sweetalert2';
import RichTextEditor from "../../RichTextEditor";
import { useParams } from "react-router-dom";
import { IMG_URL } from "../../../../config/imgUrl";
import { getAllBlogs, updateBlog } from "../../../../services/blogService";
const EditBlog =()=>{

    const {id} = useParams();


    const [arrEditBlog,setArrEditBlog]=useState({
        id:'',name: '',photo:'',writer:'',slug:'',description:'',content:'',hidden:'',newBlog:''
    });
    const [urlPhoto,setUrlPhoto]=useState({
        imagePreview:''
    });
    const handleOnChange=(e)=>{
        const {name,value}= e.target;
        setArrEditBlog({...arrEditBlog,[name]:value})
    }
    const handleChangeImage = (e)=>{
        const name = e.target.name;
        if (e.target.files && e.target.files[0]) {
            let reader = new FileReader();
            let file = e.target.files[0];
            reader.onloadend = () => {
              setUrlPhoto(
                {
                    ...urlPhoto,imagePreview: reader.result,
              });
              setArrEditBlog(
                {
                    ...arrEditBlog,[name]:file
              });
            };
            reader.readAsDataURL(file);
          }
       
    }
    const handleContentChange = contentHtml => {
        setArrEditBlog({...arrEditBlog,content:contentHtml})
    };
    
    useEffect(()=>{
        getBlogByIdFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id])
   

    const getBlogByIdFromReact =async()=>{
        const blog =  await getAllBlogs(id);
        if( (blog && blog.data.errCode === 0)){
            setArrEditBlog(blog.data.blogs);
        }
    }
    console.log(arrEditBlog);
    
    const formValid = ({...rest }) => {
        console.log(rest);
        let valid = true;
        // validate the form was filled out
        Object.values(rest).forEach(val => {
            val === '' && (valid = false);
        });
        return valid;
    };
    
    const handleAddNewBlog = ()=>{
        const {id,name,photo,writer,slug,description,content,hidden,newBlog}=arrEditBlog;
        
        const formData = new FormData();
        formData.append('id',id)
        formData.append('name',name)
        formData.append('photo',photo)
        formData.append('writer',writer)
        formData.append('slug',slug)
        formData.append('description',description)
        formData.append('content',content)
        formData.append('hidden',hidden)
        formData.append('new',newBlog)
        if(formValid(arrEditBlog)){
            swal.fire({
                title: 'Are you sure?',
                text: "You want to Edit Blog?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Save!'
              }).then(async(result) => {
                if (result.isConfirmed) {
                    console.log(arrEditBlog);
                    let list = await updateBlog(formData);
                    console.log(list);
                    if(list.data && list.data.errCode !== 0 ){
                        swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: list.data.message,
                            })
                    }
                    if(list.data && list.data.errCode === 0 ){
                        
                            swal.fire(
                                'Edit blog!',
                                'Your blog has been updated.',
                                'success'
                            )
                            window.location.href = "/admin/list-blog"
                    }
                }
              })
        
    }else{
        swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please check your input!',
          })
    }

    }
    
    // const handleSaveUser =()=>{
        
    //     let isValid = this.checkValidateInput();
    //     if(isValid === true){
    //         // call api edit user modal
    //         this.props.editUser(this.state);
    //     }
    // }

   


    return(
        <div className="mb-4">
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Blog</h3>
                </div>
                {/* <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
                    <Button variant="contained" onClick={(e) => this.handleBack()}><i className="fas fa-arrow-left" /> Back</Button>
                </div> */}
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item"><a href="/admin/blog">Blog</a></li>
                <li className="breadcrumb-item active">Edit Blog</li>
            </ol>
            <div className="row">
                <div className="text-end">
                    <Button style={{backgroundColor:"#5046e5"}} className="me-3 px-4" onClick={handleAddNewBlog}>Save</Button>
                    </div>
                <div className="col-md-8">
                    <div className="form-container mt-4">
                        <h5 className="form-title">Basic information</h5>
                        <div className="row form-body" >
                            <div className="col-12 mb-3">
                                <label className="form-label">Name<b className="text-danger">*</b>:</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={arrEditBlog.name}
                                    name="name" 
                                    className="form-control" 
                                    onChange={(event) => handleOnChange(event)} />
                            </div>
                           
                            <div className="col-12 mb-3">
                                <label className="form-label">Slug<b className="text-danger">*</b>:</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={arrEditBlog.slug}
                                    name="slug" 
                                    className="form-control" 
                                    onChange={(event) => handleOnChange(event)} />
                            </div>
                        

                            <div class="col-12 mb-3">
                                <label className="form-label">Photo<b className="text-danger">*</b>:</label>
                                <input 
                                    className="form-control" 
                                    type="file" 
                                    name="photo"
                                    onChange={(event)=> handleChangeImage(event)}
                                    />
                                {urlPhoto.imagePreview ?
                                    <img src={urlPhoto.imagePreview} 
                                        alt="photos" 
                                        className="img-fluid" 
                                        style={{
                                            margin: "10px",
                                            // width: "200px",
                                            // height: "200px"
                                            }}/>
                                    :
                                    <img src={`${IMG_URL}/${arrEditBlog.photo}`} 
                                        alt="photos" 
                                        className="img-fluid" 
                                        style={{
                                            margin: "10px",
                                            // width: "200px",
                                            // height: "200px"
                                            }}/>
                                }
                                
                                
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Writer<b className="text-danger">*</b>:</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={arrEditBlog.writer}
                                    name="writer" 
                                    className="form-control" 
                                    onChange={(event) => handleOnChange(event)} />
                            </div>
                            
                            <div className="col-12 mb-3">
                                <label className="form-label">Blog Content<b className="text-danger">*</b>:</label>
                                <RichTextEditor 
                                    content={arrEditBlog.content}
                                    handleContentChange={handleContentChange}
                                    placeholder="..."                            
                                    // boolean={readOnlyEditor}
                                />
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                <div className="col-md-4">
                <div className="form-container mt-4">
                        <h5 className="form-title">Visible Blog and New Blog</h5>
                        <div className="row form-body">
                            <div className="col-12 mb-3">
                                <label className="form-label">Hidden:</label>
                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="hidden" name="hidden" checked={arrEditBlog.hidden} 
                                        onChange={(e) => {
                                            handleOnChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.checked,
                                            },
                                            });
                                        }} 

                                        />
                                    <label className="form-check-label" htmlFor="hidden">Hidden</label>
                                </div>
                            </div>
                            <div className="col-12">
                                <label className="form-label">New Blog:</label>
                                <div class="form-check form-switch">
                                    <input className="form-check-input" type="checkbox" role="switch" id="newBlog" name="newBlog" checked={arrEditBlog.newBlog} 
                                        onChange={(e) => {
                                            handleOnChange({
                                            target: {
                                                name: e.target.name,
                                                value: e.target.checked,
                                            },
                                            });
                                        }} 
                                    />
                                    <label className="form-check-label" htmlFor="newArrival">New Arrival</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default EditBlog;