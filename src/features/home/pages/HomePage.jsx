// src/pages/HomePage.jsx

import React from 'react';
import { BookBlock } from '../../../shared/components/book-block/BookBlock';
import { BookList } from '../../../shared/components/3d-book/BookList';
import ContentWrapper from '../../../shared/components/layout/ContentWrapper';
import image1 from '../../../assets/resources/1.jpg'
import image2 from '../../../assets/resources/2.jpg'
import image3 from '../../../assets/resources/3.jpg'
import image4 from '../../../assets/resources/4.jpg'
import image5 from '../../../assets/resources/5.jpg'
import imageBack from '../../../assets/resources/3d-book-images/3.png'
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
      { id: 1, content: "Whale catfish leatherjacket deep sea anglerfish grenadier sawfish pompano dolphinfish carp large-eye bream, squeaker amago. Sandroller; rough scad, tiger shovelnose catfish snubnose parasitic eel? Black bass soldierfish duckbill--Rattail Atlantic saury Blind shark California halibut; false trevally warty angler!" },
      { id: 2, content: "Trahira giant wels cutlassfish snapper koi blackchin mummichog mustard eel rock bass whiff murray cod. Bigmouth buffalo ling cod giant wels, sauger pink salmon. Clingfish luderick treefish flatfish Cherubfish oldwife Indian mul gizzard shad hagfish zebra danio. Butterfly ray lizardfish ponyfish muskellunge Long-finned sand diver mullet swordfish limia ghost carp filefish." },
      { id: 3, content: "Red snapper Kafue pike fangtooth humums's slipmouth, salmon cutlassfish; swallower European perch mola mola sunfish, threadfin bream. Billfish hog sucker trout-perch lenok orbicular velvetfish. Delta smelt striped bass, medusafish dragon goby starry flounder cuchia round whitefish northern anchovy spadefish merluccid hake cat shark Black pickerel. Pacific cod." },
    ],
    backCoverSummary: "Tyrant, blackmailer, racketeer, murderer - his influence reaches every level of American society. Meet Cat Corleone, a friendly cat, a just cat, a reasonable cat. The deadliest lord of the Cata Nostra. The Catfather.", // bk-back 的内容
    infoSummary: "A modern masterpiece,The Godfather is a searing portrayal of the 1940s criminal underworld. It is also the intimate story of the Corleone family, at once drawn together and ripped apart by its unique position at the core of the American Mafia.", // bk-info 的内容
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
    backCoverImage: imageBack,
    // ... 其他书籍数据
  },
];
function HomePage() {
  return (
    // <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '5px' }}>
    //   <BookBlock pages={pages} width={'90%'} height={'200px'} maxWidth={'320px'}/>  
    //   <BookList books={booksData} />
    // </div>
    <ContentWrapper 
      style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '5px',
      }}
    >
      <BookBlock pages={pages} width={'90%'} height={'200px'} maxWidth={'320px'}/>  
      <BookList books={booksData} />
    </ContentWrapper>
  );
}

export default HomePage;