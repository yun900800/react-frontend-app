import FullBleedContainerLayout from "../../../shared/components/layout/FullBleedContainer";
import styles from '../../../shared/components/layout/FullBleedContainer.module.css';
import GlobalWrapper from "../components/GlobalWrapper";

const FullBleed = ({ children, as: Tag = 'div', ...rest }) => {
  return (
    <Tag className={styles["full-bleed"]} {...rest}>
      {children}
    </Tag>
  );
};
export const FullBleedPage = () => {
  return (
        <GlobalWrapper maxWidth="1200px">
        <FullBleedContainerLayout maxWidth={'65ch'}>
        <h1>我的文章标题</h1>
        <p>这是常规段落内容，宽度被限制在 {65} 个字符以内，以提高可读性。</p>

        {/* 使用 FullBleed 组件包裹需要全宽显示的元素 */}
        <FullBleed as="figure">
            <img src="https://res.cloudinary.com/dqmqakbd6/image/upload/v1755510388/user_uploads/azh2mwf4tcifcnihwpch.jpg" alt="全屏显示的图表" />
            <figcaption>这是全出血的图表说明。</figcaption>
        </FullBleed>

        <p>这是后续的常规段落内容。</p>
        </FullBleedContainerLayout>
        </GlobalWrapper>
  );
};