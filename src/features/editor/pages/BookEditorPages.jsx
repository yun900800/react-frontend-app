import React from "react";
import { BookReviewEditor } from "../components/BookReviewEditor";  
import styles from  './BookEditorPages.module.css'

const BookEditorPages = () => {
    return (
        <div className={styles['full-page']}>
            <div className={styles['full-main']}>
                <BookReviewEditor/>
            </div>
        </div>
    );
};
export default BookEditorPages;