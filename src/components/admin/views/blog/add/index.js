import { useState } from "react";
import { Button } from "reactstrap";
import swal from 'sweetalert2';
import RichTextEditor from "../../RichTextEditor";
import { createBlog } from "../../../../services/blogService";

const AddBlog =()=>{

    const [arrInput,setArrProduct]=useState({
        name: '',photo:'',writer:'',slug:'', description: '',content:'',hidden:false,newBlog:false
    });
    const [urlPhoto,setUrlPhoto]=useState({
        imagePreview:''
    });

    const handleOnChange=(e)=>{
        const {name,value}= e.target;
        setArrProduct({...arrInput,[name]:value})
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
              setArrProduct(
                {
                    ...arrInput,[name]:file
              });
            };
            reader.readAsDataURL(file);
          }
       
    }
    const handleContentChange = contentHtml => {
        setArrProduct({...arrInput,content:contentHtml})
    };
    
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
        const {name,photo,writer,slug,description,content,hidden,newBlog}=arrInput;
        const formData = new FormData();
        formData.append('name',name)
        formData.append('photo',photo)
        formData.append('writer',writer)
        formData.append('slug',slug)
        formData.append('description',description)
        formData.append('content',content)
        formData.append('hidden',hidden)
        formData.append('newBlog',newBlog)
        if(formValid(arrInput)){
                swal.fire({
                    title: 'Are you sure?',
                    text: "You want to Add New Blog?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Add!'
                  }).then(async(result) => {
                    if (result.isConfirmed) {
                        let list = await createBlog(formData);
                        if(list.data && list.data.errCode !== 0 ){
                            swal.fire({
                                icon: 'error',
                                title: 'Oops...',
                                text: list.data.message,
                                })
                        }
                        if(list.data && list.data.errCode === 0 ){
                            
                                swal.fire(
                                    'Add blog!',
                                    'Your blog has been added.',
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
                <li className="breadcrumb-item"><a href="/admin/blog/create">Blog</a></li>
                <li className="breadcrumb-item active">Create A New Blog</li>
            </ol>
            <div className="row">
                <div className="text-end">
                    <Button style={{backgroundColor:"#5046e5"}} className="me-3 px-4" onClick={handleAddNewBlog}>Create</Button>
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
                                    value={arrInput.name}
                                    name="name" 
                                    className="form-control" 
                                    onChange={(event) => handleOnChange(event)} />
                            </div>
                           
                            <div className="col-12 mb-3">
                                <label className="form-label">Slug<b className="text-danger">*</b>:</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={arrInput.slug}
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
                                {urlPhoto.imagePreview &&
                                    <img src={urlPhoto.imagePreview} 
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
                                    value={arrInput.writer}
                                    name="writer" 
                                    className="form-control" 
                                    onChange={(event) => handleOnChange(event)} />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Description<b className="text-danger">*</b>:</label>
                                <textarea 
                                    type="text" 
                                    required 
                                    value={arrInput.description}
                                    name="description" 
                                    className="form-control" 
                                    onChange={(event) => handleOnChange(event)} />
                            </div>
                            
                            <div className="col-12 mb-3">
                                <label className="form-label">Blog Content<b className="text-danger">*</b>:</label>
                                <RichTextEditor 
                                    content={arrInput.content}
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
                                    <input className="form-check-input" type="checkbox" role="switch" id="hidden" name="hidden" checked={arrInput.hidden} 
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
                                    <input className="form-check-input" type="checkbox" role="switch" id="newBlog" name="newBlog" checked={arrInput.newBlog} 
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
export default AddBlog;