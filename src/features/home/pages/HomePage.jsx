// src/pages/HomePage.jsx

import React from 'react';
import { BookBlock } from '../../../shared/components/book-block/BookBlock';
import { BookList } from '../../../shared/components/3d-book/BookList';
import image1 from '../../../assets/resources/1.jpg'
import image2 from '../../../assets/resources/2.jpg'
import image3 from '../../../assets/resources/3.jpg'
import image4 from '../../../assets/resources/4.jpg'
import image5 from '../../../assets/resources/5.jpg'
const pages = [
  <a href="https://www.linkedin.com/in/kai-he-a52360a9/" name="红色大象"><img src={image1} alt="image01"/></a>,
  <a href="https://www.linkedin.com/in/kai-he-a52360a9/" name="灰色大象"><img src={image2} alt="image02"/></a>,
  <a href="https://www.linkedin.com/in/kai-he-a52360a9/" name="黄色老虎"><img src={image3} alt="image03"/></a>,
  <a href="https://www.linkedin.com/in/kai-he-a52360a9/" name="蓝色小鹿"><img src={image4} alt="image04"/></a>,
  <a href="https://www.linkedin.com/in/kai-he-a52360a9/" name="绿色叮当猫"><img src={image5} alt="image05"/></a>,
  <a href="https://www.linkedin.com/in/kai-he-a52360a9/" name="紫色独角兽"><img src={'https://res.cloudinary.com/dqmqakbd6/image/upload/v1755510388/user_uploads/azh2mwf4tcifcnihwpch.jpg'} alt="image06"/></a>
  // ...更多页
];

const booksData = [
  {
    id: 1,
    title: "A Catwork Orange",
    author: "Anthony Burghiss",
    coverBackText: "这是旋转背面内容", // bk-cover-back 的内容
    pages: [
      { id: 1, content: "Red snapper Kafue pike fangtooth..." },
      { id: 2, content: "Whale catfish leatherjacket deep sea..." },
      { id: 3, content: "Trahira giant wels cutlassfish snapper..." },
    ],
    backCoverSummary: "In this nightmare vision of cats in revolt...", // bk-back 的内容
    infoSummary: "Social prophecy? Black comedy? Study of freewill?...", // bk-info 的内容
  },
  {
    id: 2,
    title: "The Catfather",
    author: "Mario Purrzo",
    // ... 其他书籍数据
  },
  {
    id: 3,
    title: "The Catcher in the Rye",
    author: "J.C. Salinger",
    backCoverImage: "images/3.png", // bk-back 可能有图片
    // ... 其他书籍数据
  },
];
function HomePage() {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <BookBlock pages={pages} width={'100%'} height={'240px'} maxWidth='320px'/> 
      <BookList books={booksData} />
    </div>
  );
}

export default HomePage;