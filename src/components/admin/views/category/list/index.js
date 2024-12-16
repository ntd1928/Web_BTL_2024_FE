import {useState,useEffect} from 'react';
import '../../../../styles/Login.css';
import { createNewCategoryService,deleteCategoryService,updateCategoryService, getAllCategories } from '../../../../services/categoryService';
import ModalCategory from '../add';
import ModalEditCategory from '../edit';
import Swal from 'sweetalert2';
import {ThreeDots} from 'react-loader-spinner';
import Pagination from '../../../../pagination';

const ListCategory = () => {
    const [arrCategory,setArrCategory]=useState([]);
    const [categoryData,setCategoryData]=useState([]);
    const [isOpenModalCategory,setIsOpenModalCategory]=useState(false);
    const [isOpenModalEditCategory,setIsOpenModalEditCategory]=useState(false);
    const [categoryEdit,setCategoryEdit]=useState({})
    
    // const [pagColor,setPagColor]=useState([]);
    const [isloaded,setIsLoaded]=useState(false);
    const [offset, setOffset] = useState(0);
    const [perPage]=useState(10);
    const [currentPage,setCurrentPage]=useState(0);
    const [pageCount,setPageCount]=useState(0);

    useEffect(()=>{
        getAllCategoriesFromReact();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[perPage,offset]);

    const getAllCategoriesFromReact = async()=>{
        setIsLoaded(false);
        const response = await getAllCategories('ALL');
        if(response && response.data.errCode === 0){
            setCategoryData(response.data.categories);
            pagination(response.data.categories);
            
            
        }
    }
    const pagination = (tdata)=>{
        var slice = tdata.slice(offset, offset + perPage)
        setPageCount(Math.ceil(tdata.length / perPage));
        // setPagColor(tdata);
        setArrCategory(slice);
        setIsLoaded(true);
    }
    const handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * perPage;
        setCurrentPage(selectedPage);
        setOffset(offset);
        // loadMoreData();
    };
    
    const handleAddNewCategory = () => {
        setIsOpenModalCategory(true);
    }

    const toggleCategoryModal = () => {
        setIsOpenModalCategory(!isOpenModalCategory)

    }

    const toggleCategoryEditModal = ()=>{
        setIsOpenModalEditCategory(!isOpenModalEditCategory);

    }

    const createNewCategory = async(data) => {
        try {
            let response = await createNewCategoryService(data);
            if(response && response.data.errCode !== 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.data.errMessage,
                  })
            }else{
                await getAllCategoriesFromReact();
                setIsOpenModalCategory(false)
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Your work has been saved',
                    showConfirmButton: false,
                    timer: 1500
                  })
                // setState({
                //     isOpenModalCategory: false
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

    const handleDeleteCategory= (category)=>{
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
                    let res = await deleteCategoryService(category.id);
                    if(res && res.data.errCode === 0){
                        await getAllCategoriesFromReact();
                        Swal.fire(
                            'Deleted!',
                            'Your category has been deleted.',
                            'success'
                        )
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

    const handleEditCategory = async(category)=>{
        setIsOpenModalEditCategory(true);
        setCategoryEdit(category)
    }

    const doEditCategory = async(category) => {
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
                    let res = await updateCategoryService(category);
                    console.log("do edit:",res);
                    if(res && res.data.errCode===0){
                        setIsOpenModalEditCategory(false)
                        await getAllCategoriesFromReact()
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
    const [filterParam, setFilterParam] = useState('');

    const handleFilter = async(e)=>{
        setFilterParam(e.target.value);
        if(e.target.value ===''){
            setArrCategory(categoryData);
        }else{
            const search = categoryData.filter(item => (item.name.toLowerCase().includes(e.target.value.toLowerCase())|| item.description.toLowerCase().includes(e.target.value.toLowerCase())));
            setArrCategory(search)
        }
        

    }
    return (
        <div className='list'>
            <div className="row">
                <div className="col-lg-5 col-md-9 col-lg-6">
                    <h3 className="mt-30 page-title">Type Product</h3>
                </div>
                
            </div>
            <ol className="breadcrumb mb-30">
                <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                <li className="breadcrumb-item active">Type Product</li>
            </ol>
            <ModalCategory 
                isOpen = {isOpenModalCategory}
                createNewCategory = {createNewCategory}
                toggleFromParent = {toggleCategoryModal}
            />
            {isOpenModalEditCategory&&
            <ModalEditCategory
                isOpen = {isOpenModalEditCategory}
                editCategory = {doEditCategory}
                toggleFromParent = {toggleCategoryEditModal}
                currentCategory = {categoryEdit}
            />
            }
           <div className='form-container mt-4'>
                <h4 className='text-center form-title'>List Of Type Products</h4>
                <div className='form-body'>
                    <div className='d-flex justify-content-between align-items-center'>
                        <div class="search">
                            <i class="fa-solid fa-magnifying-glass"></i>
                            <input className="form-control" type="text" placeholder="Search name, description..." 
                                value={filterParam}
                                onChange={(e) => handleFilter(e)}

                            />
                        </div>
                        <div className=''>
                            <button className='btn add-product' onClick={()=>handleAddNewCategory()}><i class="fa-solid fa-plus me-2"></i>Add</button>
                        </div>
                       
                    </div>
                    
                    <div className='table-responsive mt-5 mb-3'>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th className='text-center align-middle form-title'>#</th>
                                    <th className='text-center align-middle form-title'>Id</th>
                                    <th className='text-center align-middle form-title'>Name</th>
                                    <th className='text-center align-middle form-title'>Description</th>
                                    <th className='text-center align-middle form-title'>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isloaded ? arrCategory && arrCategory.map((item,index)=>{
                                    return(
                                        <tr key={item.id}>
                                            <td className='text-center align-middle'>{index + 1}</td>
                                            <td className='text-center align-middle'>{item.id}</td>
                                            <td className='text-center align-middle'>{item.name}</td>
                                            <td className='text-center align-middle'>{item.description}</td>
                                            <td className='text-center align-middle'>
                                                <span onClick={()=>{handleEditCategory(item)}} className="hover-icon text-success">
                                                    <i className="fa-solid fa-pen-to-square me-3"></i>
                                                </span>
                                                <span onClick={()=>{handleDeleteCategory(item)}} className="hover-icon text-danger">
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
export default ListCategory;

