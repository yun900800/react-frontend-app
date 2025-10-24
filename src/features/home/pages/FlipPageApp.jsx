// import React from "react";
// import HTMLFlipBook  from "react-pageflip";
// import styles from "./FlipPageApp.module.css";

// const PageCover = React.forwardRef(({ children }, ref) => (
//   <div className={`${styles.page} ${styles["page-cover"]}`} ref={ref} data-density="hard">
//     <div className={styles["page-content"]}>
//       <h2>{children}</h2>
//     </div>
//   </div>
// ));

// const Page = React.forwardRef(({ number, children }, ref) => (
//   <div className={styles.page} ref={ref}>
//     <div className={styles["page-content"]}>
//       <h2 className={styles["page-header"]}>Page header - {number}</h2>
//       <div className={styles["page-image"]}></div>
//       <div className={styles["page-text"]}>{children}</div>
//       <div className={styles["page-footer"]}>Page {number}</div>
//     </div>
//   </div>
// ));

// class FlipBook extends React.Component {
//   constructor(props) {
//     super(props);
//     this.flipBook = React.createRef();
//     this.state = { page: 0, totalPage: 0 };
//   }

//   nextButtonClick = () => {
//     this.flipBook.current.pageFlip().flipNext();
//   };

//   prevButtonClick = () => {
//     this.flipBook.current.pageFlip().flipPrev();
//   };

//   onPage = (e) => {
//     this.setState({ page: e.data });
//   };

//   componentDidMount() {
//     // 延迟确保实例创建完成
//     setTimeout(() => {
//       const flip = this.flipBook.current?.pageFlip?.();
//       if (flip) {
//         this.setState({ totalPage: flip.getPageCount() });
//       }
//     }, 0);
//   }

//   render() {
//     return (
//       <div className={styles.container}>
//         <HTMLFlipBook
//           width={550}
//           height={733}
//           size="stretch"
//           minWidth={315}
//           maxWidth={1000}
//           minHeight={400}
//           maxHeight={1533}
//           className={styles["demo-book"]}
//           ref={this.flipBook}
//           onFlip={this.onPage}
//         >
//           <PageCover>BOOK TITLE</PageCover>
//           <Page number={1}>Lorem ipsum dolor sit amet...</Page>
//           <Page number={2}>Page 2: Consectetur adipiscing elit.</Page>
//           <Page number={3}>Page 3: Sed do eiusmod tempor incididunt.</Page>
//           <Page number={4}>Page 4: Ut labore et dolore magna aliqua.</Page>
//           <PageCover>THE END</PageCover>
//         </HTMLFlipBook>

//         <div className={styles.controls}>
//           <button onClick={this.prevButtonClick}>◀ Prev</button>
//           <span>
//             {this.state.page + 1} / {this.state.totalPage}
//           </span>
//           <button onClick={this.nextButtonClick}>Next ▶</button>
//         </div>
//       </div>
//     );
//   }
// }

// export const FlipPageApp = () => (
//   <div className={styles["full-page"]}>
//     <div className={styles["full-main"]}>
//       <FlipBook />
//     </div>
//   </div>
// );

// FlipPageApp.jsx
import React from "react";
import { FlipBook } from "../components/FlipBook";
import styles from "./FlipPageApp.module.css";

export const FlipPageApp = () => {
  const sampleText = `
    Chapter 1. The Beginning.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
    Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
    Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
    Chapter 2. The Journey.
    Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
    Donec in est vitae sem pretium fermentum.
    Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
    Chapter 3. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 4. The Beginning.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
    Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
    Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
    
    Chapter 5. The Journey.
    Aenean mattis diam eget velit consequat, in luctus velit rhoncus.
    Donec in est vitae sem pretium fermentum.
    Suspendisse potenti. Mauris varius tincidunt sapien, eget dapibus justo gravida non.
    
    Chapter 6. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 7. The End.
    Sed dignissim sapien in enim pretium cursus. Phasellus pretium tincidunt lorem at tincidunt.

    Chapter 8. The Beginning.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus posuere felis at nisi imperdiet, eget ullamcorper massa cursus.
    Nulla facilisi. Suspendisse potenti. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;
    Curabitur ut nisi quis sapien cursus tincidunt eget sit amet lorem. 
    Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
    Donec tincidunt, nunc sed laoreet sodales, nisl lectus luctus purus, id pulvinar metus leo sed odio.
  `;

  return (
    <div className={styles["full-page"]}>
      <div className={styles["full-main"]}>
        <FlipBook content={sampleText} />
      </div>
    </div>
  );
};
