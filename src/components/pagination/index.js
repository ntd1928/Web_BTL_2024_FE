import ReactPaginate from 'react-paginate';
import './pagination.css';
const Pagination = (props)=>{
    return(
        <nav aria-label="Page navigation comments" className="mt-4">
            <ReactPaginate
                    previousLabel="<"
                    nextLabel=">"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    pageCount={props.pageCount}
                    pageRangeDisplayed={4}
                    marginPagesDisplayed={2}
                    onPageChange={props.handlePageClick}
                    containerClassName="pagination justify-content-center"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    activeClassName="active"
                    // eslint-disable-next-line no-unused-vars
                    hrefBuilder={(page, pageCount, selected) =>
                    page >= 1 && page <= pageCount ? `/page/${page}` : '#'
                    }
                    hrefAllControls
                    forcePage={props.currentPage}

            />
        </nav>
    )
}
export default Pagination;