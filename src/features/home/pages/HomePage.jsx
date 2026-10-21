import React , { useEffect, useState }from 'react';
import { BookBlock } from '../../../shared/components/book-block/BookBlock';
import { BookList } from '../../../shared/components/3d-book/BookList';
import { booksApi } from '../api';
import ContentWrapper from '../../../shared/components/layout/ContentWrapper';
import image1 from '../../../assets/resources/1.jpg'
import image2 from '../../../assets/resources/2.jpg'
import image3 from '../../../assets/resources/3.jpg'
import image4 from '../../../assets/resources/4.jpg'
import image5 from '../../../assets/resources/5.jpg'
import imageBack from '../../../assets/resources/3d-book-images/3.png'
const pageInfos = [
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
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 分页参数（如果你的后端支持分页）
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    let isMounted = true; // 防止组件卸载后设置状态

    async function loadBooks() {
      try {
        setLoading(true);
        const res = await booksApi.getBooks(currentPage, limit);
        if (!isMounted) return;

        // 假设后端返回的数据结构为：
        // { data: [ { id, title, author, coverImage, backCoverImage, pages: [...], ... } ] }
        const fetchedBooks = res.data?.data || res.data || [];
        fetchedBooks.map(book=>{
          book.backCoverImage = book.back_cover_url || imageBack;
          book.infoSummary = book.preface;
          book.pages = book.reviews;
          return book;
        });
        setBooks(fetchedBooks);
      } catch (err) {
        console.error('加载图书失败:', err);
        setError(err.message || '加载失败');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadBooks();
    return () => {
      isMounted = false;
    };
  }, [currentPage]);

  if (loading) {
    return (
      <ContentWrapper style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--lux-gold)', fontSize: '1.2rem', marginBottom: '10px' }}>✦ 正在加载尊享门户内容...</div>
        <div style={{ color: 'var(--lux-text-muted)', fontSize: '0.9rem' }}>正在同步最新高端数据</div>
      </ContentWrapper>
    );
  }

  if (error) {
    return (
      <ContentWrapper style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ color: '#e74c3c', fontSize: '1.2rem', marginBottom: '10px' }}>✦ 加载遇到阻碍</div>
        <div style={{ color: 'var(--lux-text-muted)', fontSize: '0.9rem' }}>{error}</div>
      </ContentWrapper>
    );
  }


  return (
    <ContentWrapper 
      style={{ 
        padding: '30px', 
        background: 'var(--lux-surface)',
        border: '1px solid var(--lux-border)', 
        borderRadius: '12px',
        boxShadow: 'var(--lux-shadow)',
        margin: '20px auto',
        maxWidth: '1400px'
      }}
    >
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: 'var(--lux-gold)', fontWeight: 400, letterSpacing: '2px', marginBottom: '8px' }}>EXQUISITE PORTAL</h1>
        <p style={{ color: 'var(--lux-text-muted)', fontSize: 'var(--font-size-0)' }}>探索极致美学与尊贵体验</p>
      </div>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
        <BookBlock pages={pageInfos} width={'90%'} height={'200px'} maxWidth={'320px'}/>
        <BookBlock pages={pageInfos} width={'90%'} height={'200px'} maxWidth={'320px'} direction="rtl"/>    
      </div>
      <BookList books={books && books.length > 0 ? books : booksData} />
    </ContentWrapper>
  );
}

export default HomePage;