// 父级控制器组件
import React, { useState } from 'react';
import {Modal} from '../../../shared/components/modal/Modal.jsx';
export function ModalController() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <h1>使用 react-transition-group (RTG)</h1>
            <button onClick={() => setShowModal(true)}>
                {showModal ? '隐藏' : '显示'} Modal
            </button>
            
            {/* 控制 Modal 的显示/隐藏 */}
            <Modal 
                show={showModal} 
                onClose={() => setShowModal(false)} 
            />
        </div>
    );
}