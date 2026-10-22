import React, { useCallback, useEffect, useReducer, useState } from "react";
import GridStyles from './BookList.module.css';
import shelfStyles from './BookList-Shelf.module.css';
import { Book } from "./Book.jsx";

const initialShelfState = {
  openId: null,
  phase: 'closed', // closed | opening | open | closing
  pendingOpenId: null,
};

function shelfReducer(state, action) {
  switch (action.type) {
    case 'OPEN': {
      // Ignore new requests while an animation is in flight. This is the
      // simplest way to keep the 3D transforms and z-index deterministic.
      if (state.phase === 'opening' || state.phase === 'closing') return state;

      if (state.phase === 'open') {
        if (state.openId === action.id) return state;
        return { ...state, phase: 'closing', pendingOpenId: action.id };
      }

      return { openId: action.id, phase: 'opening', pendingOpenId: null };
    }

    case 'CLOSE': {
      if (state.phase !== 'open' || state.openId !== action.id) return state;
      return { ...state, phase: 'closing', pendingOpenId: null };
    }

    case 'ANIMATION_END': {
      if (action.id != null && action.id !== state.openId) return state;

      if (state.phase === 'opening') {
        return { ...state, phase: 'open' };
      }

      if (state.phase === 'closing') {
        if (state.pendingOpenId != null) {
          return {
            openId: state.pendingOpenId,
            phase: 'opening',
            pendingOpenId: null,
          };
        }
        return initialShelfState;
      }

      return state;
    }

    default:
      return state;
  }
}

export const BookList = ({ books, viewMode='grid' }) => {
  // Grid mode keeps its original two-state model.
  const [openedBookId, setOpenedBookId] = useState(null);
  const [flippedBookId, setFlippedBookId] = useState(null);

  // Shelf mode uses one explicit phase instead of a chain of transitionend
  // handlers. This prevents stale classes when a user clicks quickly.
  const [shelf, dispatchShelf] = useReducer(shelfReducer, initialShelfState);

  const handleOpenBook = (id, isCurrentlyOpen) => {
    if (isCurrentlyOpen) {
      setOpenedBookId(null);
    } else {
      setOpenedBookId(id);
      setFlippedBookId(null);
    }
  };

  const handleFlip = (id) => {
    setOpenedBookId(null);
    setFlippedBookId((prevId) => (prevId === id ? null : id));
  };

  const handleShelfClick = useCallback((id) => {
    dispatchShelf({
      type: shelf.openId === id ? 'CLOSE' : 'OPEN',
      id,
    });
  }, [shelf.openId]);

  const handleShelfTransitionEnd = useCallback((id) => {
    dispatchShelf({ type: 'ANIMATION_END', id });
  }, []);

  // transitionend can be skipped when a transition is interrupted; this
  // timeout keeps the state machine moving in that case.
  useEffect(() => {
    if (shelf.phase !== 'opening' && shelf.phase !== 'closing') return undefined;

    const timer = window.setTimeout(() => {
      dispatchShelf({ type: 'ANIMATION_END' });
    }, 750);

    return () => window.clearTimeout(timer);
  }, [shelf.phase, shelf.openId]);

  // Escape closes the book once the opening animation has settled.
  useEffect(() => {
    if (shelf.phase !== 'open' || shelf.openId == null) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        dispatchShelf({ type: 'CLOSE', id: shelf.openId });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shelf.phase, shelf.openId]);

  const booksCount = books.length;
  const styles = viewMode === 'shelf' ? shelfStyles : GridStyles;

  return (
    <>
      <ul id="bk-list" className={`${styles['bk-list']} clearfix`}>
        {books.map((book, index) => (
          <Book
            key={`${book.id}-${index}`}
            data={book}
            index={index}
            booksCount={booksCount}
            viewMode={viewMode}

            // Shelf mode
            isShelfOpened={
              shelf.openId === book.id &&
              (shelf.phase === 'opening' || shelf.phase === 'open')
            }
            isShelfActive={shelf.openId === book.id}
            isShelfReady={shelf.openId === book.id && shelf.phase === 'open'}
            isShelfLocked={shelf.openId != null && shelf.openId !== book.id}
            onShelfClick={handleShelfClick}
            onTransitionEnd={handleShelfTransitionEnd}

            // Grid mode
            isOpenedGlobally={openedBookId === book.id}
            isFlippedGlobally={flippedBookId === book.id}
            onOpen={handleOpenBook}
            onFlip={handleFlip}
          />
        ))}
      </ul>
      {viewMode === 'shelf' && <div className={shelfStyles['book-shelf']}></div>}
    </>
  );
};
