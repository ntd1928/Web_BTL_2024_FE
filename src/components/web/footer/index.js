import { Link } from "react-router-dom";
import React, { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // Ngăn tải lại trang
    setIsSubmitted(true); // Đặt trạng thái thành công
    console.log("Email:", email, "Message:", message);
  };

  // Hàm cuộn trang lên đầu khi nhấn vào nút
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container footer-content px-5">
      <button
        id="myBtn"
        title="Go to top"
        style={{ display: "block" }}
        onClick={scrollToTop} // Gọi hàm khi nhấn nút
      >
        <i className="fa-solid fa-arrow-up"></i>
      </button>
      <div className="row my-3 py-4 justify-content-between">
        {/* Cột thông tin chính */}
        <div className="col-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
          <a href="#" className="logo justify-content-md-center">
            HOME's
          </a>
          <div className="row">
            <div className="col-12 pb-2">
              <b>Address:</b> Apartment 144 Xuan Thuy Street, Dich Vong Hau Ward, Cau Giay District, Hanoi, Vietnam
            </div>
            <div className="col-12 pb-2">
              <b>Hotline:</b> 1900 6777
            </div>
            <div className="col-12 pb-2">
              <b>Email:</b> homes@company.vn
            </div>
          </div>
          <h5 className="pt-3">Social Media</h5>
          <div className="is-divider small"></div>
          <div className="row ps-3 link-social">
            <a href="#" className="col-2">
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" className="col-2">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="#" className="col-2">
              <i className="fa-brands fa-twitter"></i>
            </a>
          </div>
        </div>

        {/* Cột About */}
        <div className="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
          <h5 className="pt-3">About</h5>
          <div className="about row ps-3">
            <div className="is-divider small"></div>
            <Link className="col-12" to="home">
              Home
            </Link>
            <Link className="col-12" to="about">
              About
            </Link>
            <Link className="col-12" to="product">
              Product
            </Link>
            <Link className="col-12" to="blog">
              Blog
            </Link>
          </div>
        </div>

        {/* Cột Categories */}
        <div className="col-12 col-sm-12 col-md-1 col-lg-1 col-xl-1">
          <h5 className="pt-3">Categories</h5>
          <div className="about row ps-3">
            <div className="is-divider small"></div>
            <Link className="col-12" to="home">
              Home
            </Link>
            <Link className="col-12" to="about">
              About
            </Link>
            <Link className="col-12" to="product">
              Product
            </Link>
            <Link className="col-12" to="blog">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
