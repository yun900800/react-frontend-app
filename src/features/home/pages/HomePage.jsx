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
          book.backCoverImage = imageBack;
          book.pages = [
            { id: 1, content: "他比我本人还更像我。无论我们的灵魂是什么做的，他和我的都是一样的。" },
            { id: 2, content: "我就是希斯克利夫！他永远在我心里，永远在我心里：不是作为一种快乐，正如我也不是我自己的快乐，而是作为我的存在本身。" },
            { id: 3, content: "我对林惇的爱，如同林中枝叶，我清楚地知道，时光会把它改变，正如冬天会把树木改变。我对希斯克利夫的爱，像是**地下永久的岩石 ：它给人的快乐不多，却是 **不可或缺的 。" },
            { id: 4, content: "要永远和我在一起——以任何形式——把我逼疯！只是不要把我留在 **这片找不到你的深渊 里！" },
            { id: 5, content: "我没有伤你的心——你伤了它；而且，你 **在伤了它的同时，也伤了我的心 。" },
            { id: 6, content: "我不能没有我的 **生命 ！我不能没有我的 **灵魂 ！**地下永久的岩石 ：它给人的快乐不多，却是 **不可或缺的 。" },
            { id: 7, content: "艾米莉比夏洛蒂（《简·爱》作者）更是一位伟大的诗人... 她放眼于一个裂成巨大混乱的世界，并在内心感到一种力量，能在一本书中将其统一起来。"},
            { id: 8, content: "这是一部充满 **粗俗的堕落和不自然的恐怖 的作品。"},
            { id: 9, content: "它是一部 **哥特式的爱情悲剧 ，将 **荒野的狂暴 与 **人类的激情 完美地结合在一起。"},
          ]
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
    return <ContentWrapper>📚 正在加载书籍中...</ContentWrapper>;
  }

  if (error) {
    return <ContentWrapper>❌ 出错啦：{error}</ContentWrapper>;
  }


  return (
    <ContentWrapper 
      style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '5px',
      }}
    >
      <BookBlock pages={pageInfos} width={'90%'} height={'200px'} maxWidth={'320px'}/>
      <BookBlock pages={pageInfos} width={'90%'} height={'200px'} maxWidth={'320px'} direction="rtl"/>    
      <BookList books={books || booksData} />
    </ContentWrapper>
  );
}

export default HomePage;