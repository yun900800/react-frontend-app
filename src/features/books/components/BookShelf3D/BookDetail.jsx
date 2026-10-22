import React from 'react';
import { BookPageContent } from "./BookPageContent.jsx";
import gridStyles from './Book.module.css';
import shelfStyles from './Book-Shelf.module.css';
import imageDefault from '../../../../assets/resources/3d-book-images/1.png';

const THEME_FALLBACKS = {
    1: '#ff924a',
    2: '#222222',
    3: '#a4c19e',
    default: '#6b4f3a',
};

const DEFAULT_COVER_COLORS = [
    '#6b4f3a',
    '#4f5b66',
    '#6f5560',
    '#56634f',
    '#5f5870',
    '#7a6046',
];

const LIGHT_TEXT = '#f7f3e8';
const DARK_TEXT = '#1f1a14';

function relativeLuminance(hex) {
    let value = String(hex || '').replace('#', '');
    if (/^[0-9a-f]{3}$/i.test(value)) {
        value = value.split('').map((char) => char + char).join('');
    }
    if (!/^[0-9a-f]{6}$/i.test(value)) return null;

    const channel = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const r = channel(parseInt(value.slice(0, 2), 16) / 255);
    const g = channel(parseInt(value.slice(2, 4), 16) / 255);
    const b = channel(parseInt(value.slice(4, 6), 16) / 255);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(background, foreground) {
    const a = relativeLuminance(background);
    const b = relativeLuminance(foreground);
    if (a == null || b == null) return 0;

    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function getContrastColor(hex) {
    const luminance = relativeLuminance(hex);
    if (luminance == null) return LIGHT_TEXT;

    // Pick whichever candidate has the stronger WCAG contrast. A simple
    // luminance threshold makes light greens and oranges unreadable.
    return contrastRatio(hex, LIGHT_TEXT) >= contrastRatio(hex, DARK_TEXT)
        ? LIGHT_TEXT
        : DARK_TEXT;
}

export const BookDetail = ({
    data,
    isOpen,
    isFlipped,
    currentPageIndex,
    handlePageChange,
    viewMode = 'grid',
    openX = 0,
    bookIndex = 0,
    isReady = true,
    onClose,
    onTransitionEnd,
}) => {
    const styles = viewMode === 'grid' ? gridStyles : shelfStyles;

    const numericId = Number(data.id);
    const themeId = Number.isFinite(numericId) && numericId >= 1 && numericId <= 3
        ? numericId
        : 'default';

    const fallbackColor = themeId === 'default'
        ? DEFAULT_COVER_COLORS[Math.abs(bookIndex) % DEFAULT_COVER_COLORS.length]
        : THEME_FALLBACKS[themeId];
    const coverColor = data.coverColor || fallbackColor;
    const coverImage = data.coverImage || imageDefault;
    const preferredFontColor = data.font_color;
    const fontColor = preferredFontColor && contrastRatio(coverColor, preferredFontColor) >= 4.5
        ? preferredFontColor
        : getContrastColor(coverColor);

    let bookClasses = `${styles['bk-book']} ${styles[`book-${themeId}`]}`;

    if (viewMode === 'grid' && !isOpen && !isFlipped) {
        bookClasses += ` ${styles['bk-bookdefault']}`;
    }
    if (isFlipped) {
        bookClasses += ` ${styles['bk-viewback']}`;
    }
    if (isOpen) {
        bookClasses += ` ${styles['bk-viewinside']}`;
    }

    const pages = data.pages || [];
    const totalPages = pages.length;

    const handleBookTransitionEnd = (event) => {
        if (event.target !== event.currentTarget) return;
        if (event.propertyName && event.propertyName !== 'transform') return;
        if (onTransitionEnd) onTransitionEnd(data.id);
    };

    const handlePageClick = (event) => {
        event.stopPropagation();
    };

    const handleClose = (event) => {
        event.stopPropagation();
        if (onClose) onClose();
    };

    const handlePageNav = (event, direction) => {
        event.stopPropagation();
        handlePageChange(direction);
    };

    return (
        <div
            className={bookClasses}
            onTransitionEnd={viewMode === 'shelf' ? handleBookTransitionEnd : undefined}
            style={{
                '--open-x': `${openX}px`,
                '--bk-cover-color': coverColor,
                '--cover-image': `url(${coverImage})`,
                '--book-color': fontColor,
            }}
        >
            {/* 封面 bk-front */}
            <div className={styles['bk-front']}>
                <div className={styles['bk-cover-back']}>
                    {data.coverBackText || data.front_cover_back_text || ''}
                </div>
                <div className={styles['bk-cover']}>
                    <h2>
                        <span>{data.author}</span>
                        <span>{data.title}</span>
                    </h2>
                </div>
            </div>

            {/* 书页 bk-page */}
            <div className={styles['bk-page']} onClick={handlePageClick}>
                {pages.map((page, index) => (
                    <BookPageContent
                        key={page.id ?? index}
                        content={page.content}
                        isCurrent={index === currentPageIndex}
                    />
                ))}

                {isOpen && isReady && onClose ? (
                    <button
                        type="button"
                        className={styles['bk-close']}
                        onClick={handleClose}
                        aria-label="收起书本"
                    >
                        ×
                    </button>
                ) : null}

                {totalPages > 1 && isOpen && isReady ? (
                    <nav onClick={handlePageClick}>
                        <button
                            type="button"
                            className={styles['bk-page-prev']}
                            onClick={(event) => handlePageNav(event, -1)}
                            aria-label="上一页"
                            disabled={currentPageIndex <= 0}
                        >
                            ‹
                        </button>
                        <span className={styles['bk-page-count']} aria-live="polite">
                            {currentPageIndex + 1} / {totalPages}
                        </span>
                        <button
                            type="button"
                            className={styles['bk-page-next']}
                            onClick={(event) => handlePageNav(event, 1)}
                            aria-label="下一页"
                            disabled={currentPageIndex >= totalPages - 1}
                        >
                            ›
                        </button>
                    </nav>
                ) : null}
            </div>

            {/* 书背 bk-back */}
            <div className={styles['bk-back']}>
                {data.backCoverImage ? (
                    <img src={data.backCoverImage} alt={data.title || '书背'} />
                ) : null}
                <p>{data.backCoverSummary}</p>
            </div>

            {/* 侧面 */}
            <div className={styles['bk-right']}></div>
            <div className={styles['bk-left']}>
                <h2>
                    <span>{data.author}</span>
                    <span>{data.title}</span>
                </h2>
            </div>
            <div className={styles['bk-top']}></div>
            <div className={styles['bk-bottom']}></div>
        </div>
    );
};
