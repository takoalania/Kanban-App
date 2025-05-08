import React, { useContext } from 'react';
import { Task } from '../../context/types';
import { BoardContext } from '../../context/BoardContext';
import styles from './TaskCard.module.css';

interface Props {
    task: Task;
    index: number;
    columnId: string;
    onDragStart: (
        e: React.DragEvent<HTMLDivElement>,
        srcColumnId: string,
        srcIndex: number
    ) => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function TaskCard({ 
    task,
    index,
    columnId,
    onDragStart,
    onEdit,
    onDelete,
 }: Props) {
    const { state, dispatch } = useContext(BoardContext);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    
        const cols = state.columns
        const currentColIndex = cols.findIndex(c => c.id === columnId)
        if (currentColIndex < 0) return
    
        const targetIndex = e.key === 'ArrowLeft'
          ? currentColIndex - 1
          : currentColIndex + 1
    
        if (targetIndex < 0 || targetIndex >= cols.length) return
    
        const targetColumnId = cols[targetIndex].id
    
        dispatch({
          type: 'MOVE_TASK',
          payload: {
            srcColumnId: columnId,
            destColumnId: targetColumnId,
            srcIndex: index,
            destIndex: cols[targetIndex].taskIds.length,
            taskId: task.id,
          }
        })
    
        setTimeout(() => {
          const selector = `[data-task-id="${task.id}"]`
          document.querySelector<HTMLDivElement>(selector)?.focus()
        }, 0)
    }

    return (
        <div 
            className={styles.taskCard}
            data-task-id={task.id}
            tabIndex={0} 
            onKeyDown={handleKeyDown}
            draggable
            onDragStart={e => onDragStart(e, columnId, index)}
        >
            <p>{task?.title}</p>
            <p>{task?.description}</p>
            <div className={styles.actions}>
                <button onClick={onEdit}>
                    Edit
                </button>
                <button onClick={onDelete}>
                    Delete
                </button>
            </div>
        </div>
    )
}