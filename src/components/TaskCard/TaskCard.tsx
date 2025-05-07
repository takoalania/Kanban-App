import { Task } from '../../context/types';
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
    return (
        <div className={styles.taskCard}
            draggable
            onDragStart={e => onDragStart(e, columnId, index)}
            onClick={onEdit}
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