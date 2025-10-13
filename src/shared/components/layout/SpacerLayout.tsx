import React from 'react';

// 定义组件的 Props 接口
interface SpacerLayoutProps extends React.HTMLAttributes<HTMLElement> {
  /** 子元素之间的间距，默认为 '16px' */
  gap?: string | number;
  /** * 可以在子元素上使用的推开类名。
   * 对应原始 CSS 中的 .marginLeft
   */
  spacerClassName?: string; 
}

// 基础 CSS，可以直接内嵌在组件中或放在单独的 CSS 文件里
const baseLayoutStyles: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center'
};

const spacerStyle: React.CSSProperties = {
  marginLeft: 'auto',
};

// 抽象出 .layout 和 .marginLeft 功能的组件
const SpacerLayout: React.FC<SpacerLayoutProps> = ({ 
  children, 
  gap = '16px', 
  className = '', 
  spacerClassName = 'spacer-auto', // 提供一个默认的推开类名
  ...rest 
}) => {

  // 为了简单起见，这里将 .marginLeft 的功能作为一个 prop 传入组件，
  // 这样你可以自己决定在哪个子元素上应用推开效果。

  return (
    // 使用 section 标签，并应用基础布局样式
    <section 
      className={`layout ${className}`} 
      style={{ ...baseLayoutStyles, gap: gap }}
      {...rest}
    >
      {/* 渲染子元素 */}
      {children}
    </section>
  );
};

// **额外：如果你想让组件自动处理推开样式，可以这样导出一个帮助类：**
// 注意：实际项目中你可能需要将这个样式放在全局 CSS 中。
// 这里的做法是为了让你看到如何将样式与组件名称关联起来。
export const AutoMargin = () => <style>{`
  .${SpacerLayout.displayName || 'SpacerLayout'}-auto {
    margin-left: auto;
  }
`}</style>

// 为了展示方便，我们将推开样式直接写在这里
// 在实际项目中，建议将这个类定义在你的全局 CSS/CSS Modules 文件中
export const AutoMarginClassName = 'spacer-auto';

export default SpacerLayout;