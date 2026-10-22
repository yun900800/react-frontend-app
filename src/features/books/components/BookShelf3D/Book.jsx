import React, { useEffect, useState } from "react";
import { BookDetail } from "./BookDetail";
import { BookInfo } from "./BookInfo";

export const Book = ({
    data,
    index,
    booksCount,
    isOpenedGlobally,
    isFlippedGlobally,
    onOpen,
    onFlip,
    viewMode = 'grid',

    // Shelf mode
    isShelfOpened,
    isShelfActive,
    isShelfReady,
    isShelfLocked,
    onShelfClick,
    onTransitionEnd,
}) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(data.currentPage ?? 0);

    // Reset to the book's configured first page whenever it is taken from
    // the shelf. This makes `currentPage` in the data contract meaningful.
    useEffect(() => {
        if (viewMode === 'shelf' && isShelfOpened) {
            setCurrentPageIndex(data.currentPage ?? 0);
        }
    }, [viewMode, isShelfOpened, data.currentPage]);

    const handlePageChange = (direction) => {
        const totalPages = data.pages ? data.pages.length : 0;
        setCurrentPageIndex((current) => {
            const next = current + direction;
            return next >= 0 && next < totalPages ? next : current;
        });
    };

    const handleViewClick = () => {
        onOpen(data.id, isOpenedGlobally);

        if (isOpenedGlobally) {
            setCurrentPageIndex(0);
        }
    };

    let stackVal = 0;
    if (viewMode === 'shelf') {
        if (index < booksCount / 2) {
            stackVal = index;
        } else {
            stackVal = booksCount - 1 - index;
        }
    }

    const finalZIndex = isShelfActive ? booksCount : stackVal;

    // Move the spine to the middle of the shelf while the book is open.
    // One spine slot is 40px wide plus a 1px gap.
    const shelfStep = 41;
    const openX = ((booksCount - 1) / 2 - index) * shelfStep;

    const isClosedShelfBook = viewMode === 'shelf' && !isShelfOpened && !isShelfLocked;

    const clickHandler = viewMode === 'shelf'
        ? () => onShelfClick(data.id)
        : undefined;

    const closeHandler = viewMode === 'shelf'
        ? () => onShelfClick(data.id)
        : undefined;

    const handleKeyDown = (event) => {
        if (!isClosedShelfBook) return;
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onShelfClick(data.id);
        }
    };

    return (
        <li
            style={{
                zIndex: finalZIndex,
                pointerEvents: isShelfLocked ? 'none' : undefined,
            }}
            onClick={clickHandler}
            onKeyDown={isClosedShelfBook ? handleKeyDown : undefined}
            tabIndex={isClosedShelfBook ? 0 : undefined}
            role={isClosedShelfBook ? 'button' : undefined}
            aria-expanded={isClosedShelfBook ? false : undefined}
            aria-label={isClosedShelfBook ? `打开《${data.title || '未命名'}》` : undefined}
        >
            <BookDetail
                data={data}
                isOpen={viewMode === 'shelf' ? isShelfOpened : isOpenedGlobally}
                isFlipped={isFlippedGlobally}
                currentPageIndex={currentPageIndex}
                handlePageChange={handlePageChange}
                viewMode={viewMode}
                openX={viewMode === 'shelf' ? openX : 0}
                bookIndex={index}
                isReady={viewMode === 'shelf' ? isShelfReady : true}
                onClose={isShelfReady || viewMode !== 'shelf' ? closeHandler : undefined}
                onTransitionEnd={viewMode === 'shelf' ? onTransitionEnd : undefined}
            />

            {viewMode === 'grid' && (
                <BookInfo
                    data={data}
                    onFlip={onFlip}
                    onOpen={handleViewClick}
                    isOpenedGlobally={isOpenedGlobally}
                />
            )}
        </li>
    );
};
