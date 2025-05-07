import React, { useContext, useState } from 'react';
import { BoardContext } from '../../context/BoardContext';
import { Task } from '../../context/types';
import Modal from '../Modal/Modal'
import CommentList from '../CommentList/CommentList';
import styles from './TaskDetailsModal.module.css';

interface Props {
    task: Task;
    onClose: () => void;
}

export default function TaskDetailsModal({ task, onClose }: Props) {
    const { dispatch } = useContext(BoardContext);
    const [title, setTitle] = useState(task?.title);
    const [description, setDescription] = useState(task?.description);

    const handeSave = () => {
        dispatch({
            type: 'EDIT_TASK',
            payload: {
                task: { ...task, title, description }
            }
        });

        onClose();
    }

    return (
        <Modal isOpen={true} onClose={onClose}>
            <h2>Edit Task</h2>
            <label className={styles.field}>
                Title
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                    />
            </label>
            <label className={styles.field}>
                Description
                <input 
                    type="text" 
                    value={description} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}/>
            </label>

            <CommentList taskId={task.id} comments={task.comments} />

            <div className={styles.buttonRow}>
                <button onClick={handeSave}>
                    Save
                </button>
                <button onClick={onClose}>
                    Cancel
                </button>
            </div> 
        </Modal>
    )
}