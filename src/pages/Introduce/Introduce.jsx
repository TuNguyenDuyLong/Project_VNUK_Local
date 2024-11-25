import React from 'react';
import './Introduce.scss';

const Introduce = () => {
    return (
        <div className="introduce-container">
            <section className="intro-header">
                <div className="intro-header-content">
                    <h1>Chào Mừng Đến Với Trường Đại Học XYZ</h1>
                    <p>
                        Trường Đại Học XYZ luôn đi đầu trong việc cung cấp một nền giáo dục chất lượng, giúp sinh viên phát triển
                        toàn diện cả về kiến thức và kỹ năng.
                    </p>
                </div>
            </section>

            <section className="intro-history">
                <div className="section-title">
                    <h2>Lịch Sử Hình Thành</h2>
                </div>
                <p>
                    Trường Đại Học XYZ được thành lập vào năm 1990 với mục tiêu nâng cao chất lượng đào tạo và nghiên cứu
                    khoa học. Sau hơn 30 năm phát triển, trường đã khẳng định vị thế của mình trong hệ thống giáo dục quốc gia.
                </p>
            </section>

            <section className="intro-mission">
                <div className="section-title">
                    <h2>Sứ Mệnh và Tầm Nhìn</h2>
                </div>
                <p>
                    Với sứ mệnh cung cấp nền giáo dục toàn diện, chúng tôi cam kết đào tạo thế hệ sinh viên xuất sắc, không
                    chỉ giỏi về lý thuyết mà còn thành thạo các kỹ năng nghề nghiệp thực tiễn.
                </p>
            </section>

            <section className="intro-achievements">
                <div className="section-title">
                    <h2>Thành Tựu Nổi Bật</h2>
                </div>
                <ul>
                    <li>Top 10 trường đại học hàng đầu về đào tạo và nghiên cứu (2023)</li>
                    <li>Cộng tác với các trường đại học hàng đầu trên thế giới</li>
                    <li>Hơn 50.000 sinh viên tốt nghiệp đang làm việc tại các công ty lớn trong và ngoài nước</li>
                </ul>
            </section>

            <section className="intro-footer">
                <p>Gia nhập cộng đồng sinh viên Trường Đại Học XYZ ngay hôm nay để cùng nhau xây dựng tương lai sáng lạn!</p>
            </section>
        </div>
    );
};

export default Introduce;
