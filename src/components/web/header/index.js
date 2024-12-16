import { NavLink, useLocation, useNavigate } from 'react-router-dom';  // Thêm useNavigate
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Link } from 'react-router-dom';
import { getUserByEmail, isAuthenticate, logout } from '../../services/userService';
import { useEffect, useState } from 'react';
import { getCartByUserId } from '../../services/cartService';

const Header =()=> {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [qtyCart, setQtyCart] = useState(0);
  const [search, setSearch] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate(); // Dùng useNavigate thay cho useHistory
  
  useEffect(() => {
    getUser();
  }, []);
  
  const getUser = async () => {
    let cookies = await isAuthenticate();
    setToken(cookies);
    let email = localStorage.getItem('email');
    if (email) {
      let user = await getUserByEmail(email);
      if (user && user.data.errCode === 0) {
        setUsername(user.data.user.username);
        setUserId(user.data.user.id);
      }
    }
  };

  useEffect(() => {
    const getCart = async () => {
      const cart = await getCartByUserId(userId);
      if (cart && cart.data.errCode === 0) {
        setQtyCart(cart.data.carts.length);
      }
    };
    getCart();
  }, [userId]);

  const handleLogout = async () => {
    await logout();
  };

  const handleDeleteSearch = () => {
    setSearch('');
  };

  const handleSearchSubmit = (e) => {
    // Prevent form submission and reset URL when pressing Enter
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?search=${search}`);  // Thay đổi URL mà không làm mới trang
    }
  };

  return (
    <div className="header">        
      <Navbar key="lg" expand="lg" className="header-nav">
        <div className="container-fluid px-5">
          <Navbar.Brand href="/" className="logo">HOME's</Navbar.Brand>
          <Navbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
          <Navbar.Offcanvas
            id="offcanvasNavbar-expand-lg"
            aria-labelledby="offcanvasNavbarLabel-expand-lg"
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg" className="logo">
                HOME's
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-center flex-grow-1 py-3">
                <NavLink className={(navData) => navData.isActive ? "active" : "first after" } to="" end>HOME</NavLink>
                <NavLink className={(navData) => navData.isActive ? "active" : "first after" } to="about">ABOUT</NavLink>
                <NavLink className={(navData) => navData.isActive ? "active" : "first after" } to="product">PRODUCT</NavLink>
                <NavLink className={(navData) => navData.isActive ? "active" : "first after" } to="blog">BLOG</NavLink>
              </Nav>
              <div className="d-flex">
                <div className="header-search pe-4">
                  <Form className="d-flex form-search" onSubmit={handleSearchSubmit}> {/* Đổi form xử lý sự kiện submit */}
                    <Form.Control
                      type="text"
                      placeholder="Search Product"
                      className="me-2"
                      aria-label="Search"
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyPress={(e) => { // Thêm sự kiện onKeyPress
                        if (e.key === 'Enter') {
                          handleSearchSubmit(e); // Nhấn Enter thì gọi handleSearchSubmit
                        }
                      }}
                    />
                    {search ? (
                      <Button onClick={handleDeleteSearch}><i className="fa-solid fa-xmark"></i></Button>
                    ) : (
                      <Button><i className="fa-solid fa-magnifying-glass"></i></Button>
                    )}
                  </Form> 
                </div>
                <div className="header-auth d-flex align-items-center">
                  <span style={token ? { display: 'none' } : { display: 'block' }}>
                    <Link to="register" className="sign-up d-flex align-items-center">
                      <i className="fa-regular fa-user px-1" style={{ fontSize: "21px", color: "#e74c3c" }}></i>
                      <span className="pb-3 px-0">
                        <span style={{ color: "#888888", fontSize: "10px" }}>Register</span>
                        <p style={{ fontSize: "14px", margin: "0px", fontWeight: "500", lineHeight: "10px", color: "#e74c3c" }}>Account</p>
                      </span>
                    </Link>
                  </span>
                  <Dropdown style={token ? { display: 'block' } : { display: 'none' }}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                      {username}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Link to="account" className="dropdown-item"><i className="fa-regular fa-user pe-2"></i> Account</Link>
                      <Link to="account/address" className="dropdown-item"><i className="fa-regular fa-address-book pe-2"></i> My address</Link>
                      <Dropdown.Item href="#/action-3" onClick={handleLogout}><i className="fa-solid fa-arrow-right-from-bracket pe-2"></i> Log out</Dropdown.Item>
                    </Dropdown.Menu>    
                  </Dropdown>
                  <Link to="cart" className="header-cart pb-1">
                    <svg style={{ color: "#e74c3c" }} xmlns="http://www.w3.org/2000/svg" width="26" height="20" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    <span className="number">{qtyCart}</span>
                  </Link>
                </div>
              </div>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </div>
      </Navbar>
    </div>
  );
};

export default Header;
