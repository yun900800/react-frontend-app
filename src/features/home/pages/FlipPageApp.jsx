import React from "react";
import HTMLFlipBook  from "react-pageflip";
import styles from "./FlipPageApp.module.css";

const PageCover = React.forwardRef(({ children }, ref) => (
  <div className={`${styles.page} ${styles["page-cover"]}`} ref={ref} data-density="hard">
    <div className={styles["page-content"]}>
      <h2>{children}</h2>
    </div>
  </div>
));

const Page = React.forwardRef(({ number, children }, ref) => (
  <div className={styles.page} ref={ref}>
    <div className={styles["page-content"]}>
      <h2 className={styles["page-header"]}>Page header - {number}</h2>
      <div className={styles["page-image"]}></div>
      <div className={styles["page-text"]}>{children}</div>
      <div className={styles["page-footer"]}>Page {number}</div>
    </div>
  </div>
));

class FlipBook extends React.Component {
  constructor(props) {
    super(props);
    this.flipBook = React.createRef();
    this.state = { page: 0, totalPage: 0 };
  }

  nextButtonClick = () => {
    this.flipBook.current.pageFlip().flipNext();
  };

  prevButtonClick = () => {
    this.flipBook.current.pageFlip().flipPrev();
  };

  onPage = (e) => {
    this.setState({ page: e.data });
  };

  componentDidMount() {
    // 延迟确保实例创建完成
    setTimeout(() => {
      const flip = this.flipBook.current?.pageFlip?.();
      if (flip) {
        this.setState({ totalPage: flip.getPageCount() });
      }
    }, 0);
  }

  render() {
    return (
      <div className={styles.container}>
        <HTMLFlipBook
          width={550}
          height={733}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          className={styles["demo-book"]}
          ref={this.flipBook}
          onFlip={this.onPage}
        >
          <PageCover>BOOK TITLE</PageCover>
          <Page number={1}>Lorem ipsum dolor sit amet...</Page>
          <Page number={2}>Page 2: Consectetur adipiscing elit.</Page>
          <Page number={3}>Page 3: Sed do eiusmod tempor incididunt.</Page>
          <Page number={4}>Page 4: Ut labore et dolore magna aliqua.</Page>
          <PageCover>THE END</PageCover>
        </HTMLFlipBook>

        <div className={styles.controls}>
          <button onClick={this.prevButtonClick}>◀ Prev</button>
          <span>
            {this.state.page + 1} / {this.state.totalPage}
          </span>
          <button onClick={this.nextButtonClick}>Next ▶</button>
        </div>
      </div>
    );
  }
}

export const FlipPageApp = () => (
  <div className={styles["full-page"]}>
    <div className={styles["full-main"]}>
      <FlipBook />
    </div>
  </div>
);