import {useState,useEffect} from 'react';
// import { FormattedMessage } from 'react-intl';
// import { connect } from 'react-redux';
import '../../../../styles/Login.css';
import { getAllColors,editColorService,deleteColorService,createNewColorService } from '../../../../services/productService';
import ModalColor from '../add';
import ModalEditColor from '../edit';
// import { emitter } from "../../../../utils/emitter";
import Swal from 'sweetalert2';
import {ThreeDots} from 'react-loader-spinner';
import Pagination from '../../../../pagination';

const ListColor = () => {
    const [arrColors,setArrColors]=useState([]);
    const [isOpenModalColor,setIsOpenModalColor]=useState(false);
    const [isOpenModalEditColor,setIsOpenModalEditColor]=useState(false);
    const [colorEdit,setColorEdit]=useState({})
      

   
    // const [pagColor,setPagColor]=useState([]);
    const [isloaded,setIsLoaded]=useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage]=useState(10);
    const [currentPage,setCurrentPage]=useState(0);
    const [pageCount,setPageCount]=useState(0);

    useEffect(()=>{
        getAllColorsFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[perPage,offset]);

    const getAllColorsFromReact = async()=>{
        setIsLoaded(false);
        const response = await getAllColors('ALL');
        if(response && response.data.errCode === 0){
            var tdata = response.data.colors;
            var slice = tdata.slice(offset, offset + perPage)
            setPageCount(Math.ceil(tdata.length / perPage));
            // setPagColor(tdata);
            setArrColors(slice);
            setIsLoaded(true);
        }
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;
        setCurrentPage(selectedPage);
        setOffset(offset);
        // loadMoreData();
    };

    const handleAddNewColor = () => {
        setIsOpenModalColor(true);
    }

    const toggleColorModal = () => {
        setIsOpenModalColor(!isOpenModalColor)

    }

    const toggleColorEditModal = ()=>{
        setIsOpenModalEditColor(!isOpenModalEditColor);

    }

    const createNewColor = async(data) => {
        try {
            console.log('list reactjs:',data)
            let response = await createNewColorService(data);
            if(response && response.data.errCode !== 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.errMessage,
                  })
            }else{
                await getAllColorsFromReact();
                setIsOpenModalColor(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                  })
                // setState({
                //     isOpenModalTypeProduct: false
                // })
                // emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error,
              })
        }
        
    }

    const handleDeleteColor= (color)=>{
        console.log('Delete!',color)
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
                    let res = await deleteColorService(color.id);
                    if(res && res.data.errCode === 0){
                        await getAllColorsFromReact();
                    }else{
                        alert(res.data.errMessage)
                    }
                } catch (error) {
                    console.log(error)
                }
                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            }
          })
        
    }

    const handleEditColor = async(color)=>{
        console.log('Edit:',color)
        setIsOpenModalEditColor(true);
        setColorEdit(color)
    }

    const doEditColor = async(color) => {
        console.log("do edit:",color)
        Swal.fire({
            title: 'Do you want to save the changes?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Save',
            denyButtonText: `Don't save`,
          }).then(async(result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                try {
                    let res = await editColorService(color);
                    console.log("do edit:",res);
                    if(res && res.data.errCode===0){
                        setIsOpenModalEditColor(false)
                        await getAllColorsFromReact()
                        Swal.fire('Saved!', '', 'success')
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
            } else if (result.isDenied) {
                Swal.fire('Changes are not saved', '', 'info')
            }
          })
        
    }

    return (
        <div className='list'>
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Product</h3>
                </div>
                {/* <div className="col-lg-5 col-md-3 col-lg-6 back-btn">
                    <Button variant="contained" onClick={(e) => this.handleBack()}><i className="fas fa-arrow-left" /> Back</Button>
                </div> */}
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item"><a href="/admin/product/create">Product</a></li>
                <li className="breadcrumb-item active">Color</li>
            </ol>
            <ModalColor 
                isOpen = {isOpenModalColor}
                createNewColor = {createNewColor}
                toggleFromParent = {toggleColorModal}
            />
            {isOpenModalEditColor&&
            <ModalEditColor
                isOpen = {isOpenModalEditColor}
                editColor = {doEditColor}
                toggleFromParent = {toggleColorEditModal}
                currentColor = {colorEdit}

            />
            }
            <div className='form-container mt-4'>
                <h3 className='text-center form-title'>List Of Colors</h3>
                <div className='form-body'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div className=''>
                            <button className='btn add-product' onClick={()=>handleAddNewColor()}><i class="fa-solid fa-plus me-2"></i>Add</button>
                        </div>
                        <div className='d-flex'>
                            {/* <form className="d-flex" onSubmit={searchData}>
                                <input
                                    className='form-control'
                                    type="text"
                                    placeholder="Search...."
                                    onChange={e=>setSearchInput(e.target.value)}
                                    value={searchInput} 
                                    />
                                <button type='submit' style={{whiteSpace:"nowrap"}} className='btn btn-primary'>Search</button>
                            </form> */}
                            
                        </div>
                    </div>
                    
                    <div className='table-responsive mt-5 mb-3'>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className='text-center align-middle form-title'>#</th>
                                    <th className='text-center align-middle form-title'>Id</th>
                                    <th className='text-center align-middle form-title'>Name</th>
                                    <th className='text-center align-middle form-title'>Code</th>
                                    <th className='text-center align-middle form-title'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isloaded ? arrColors &&arrColors.map((item,index)=>{
                                    return(
                                        <tr key={item.id}>
                                            <td className='text-center align-middle'>{index + 1}</td>
                                            <td className='text-center align-middle'>{item.id}</td>
                                            <td className='text-center align-middle'>{item.name}</td>
                                            <td className='text-center align-middle'><i class="fa-solid fa-circle" style={{ color:`${item.code}` }}></i> {item.code}</td>
                                            <td className='text-center align-middle'>
                                                <span onClick={()=>{handleEditColor(item)}} className="hover-icon text-success">
                                                    <i className="fa-solid fa-pen-to-square me-3"></i>
                                                </span>
                                                <span onClick={()=>{handleDeleteColor(item)}} className="hover-icon text-danger">
                                                    <i className="fa-solid fa-trash"></i>
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                    })
                                    : 
                                <ThreeDots 
                                    height="60" 
                                    width="60" 
                                    radius="9"
                                    color="#FF6600" 
                                    ariaLabel="three-dots-loading"
                                    wrapperStyle={{}}
                                    wrapperClassName=""
                                    visible={true}
                                    />
                                }
                            </tbody>
                        </table>
                    </div>
                    {isloaded &&
                        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} currentPage={currentPage} />
                    }
                </div>
            </div>
        </div>

    )

}
export default ListColor;

