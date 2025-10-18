// src/pages/HomePage.jsx

import React from 'react';
import { BookBlock } from '../../../shared/components/book-block/BookBlock';
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
function HomePage() {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
      <BookBlock pages={pages} width={'100%'} height={'240px'} maxWidth='320px'/> 
    </div>
  );
}

export default HomePage;