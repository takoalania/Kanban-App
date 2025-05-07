import React, { ReactNode } from 'react';
import styles from './Modal.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: Props) {

    if (!isOpen) return null;

    return (
        <div 
            className={styles.modalOverlay}
            onClick={onClose}>
           <div className={styles.modalContent} onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                {children}
           </div>
        </div>
    )
}