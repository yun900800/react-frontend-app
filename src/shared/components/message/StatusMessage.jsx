// shared/components/StatusMessage.jsx

// 假设 styles 已经全局可访问或通过 prop 传入
// 示例中我们使用 props.styles
const StatusMessage = ({ type, message, styles }) => {
    const messageStyles = {
        loading: styles.loadingMessage,
        error: styles.errorMessage,
        empty: styles.emptyMessage,
    };
    return <div className={messageStyles[type]}>{message}</div>;
};
export default StatusMessage;