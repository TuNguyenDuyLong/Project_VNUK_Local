import React from 'react';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Trường Đại Học ABC</h3>
                    <p>Chúng tôi cung cấp các chương trình học chất lượng cao với đội ngũ giảng viên uy tín.</p>
                </div>
                <div className="footer-section">
                    <h3>Liên Hệ</h3>
                    <ul>
                        <li>Email: support@university.com</li>
                        <li>Phone: (123) 456-7890</li>
                        <li>Địa chỉ: Số 123, Đường ABC, TP. HCM</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Kết Nối</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook"></i>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-linkedin"></i>
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 Trường Đại Học ABC. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
