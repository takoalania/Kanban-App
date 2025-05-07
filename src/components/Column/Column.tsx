import React from 'react';
import { Column as ColumnType, Task } from '../../context/types';
import TaskCard from '../TaskCard/TaskCard';
import styles from './Column.module.css';

interface Props {
    column: ColumnType;
    tasks: Record<string, Task>;
    onAddTask: (columnId: string) => void;
    onEditTask: (taskId: string) => void;
    onDeleteTask: (columnId: string, taskId: string) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, destColumnId: string) => void;
    onDragStart: (
    e: React.DragEvent<HTMLDivElement>,
    srcColumnId: string,
    srcIndex: number
  ) => void;
}

export default function Column({ 
    column, 
    tasks, 
    onAddTask, 
    onEditTask, 
    onDeleteTask, 
    onDragOver, 
    onDrop,
    onDragStart,
}: Props) {

    return (
        <div className={styles.column} onDragOver={onDragOver} onDrop={e => onDrop(e, column.id)}>
            <h2>{column?.title}</h2>

            {column?.taskIds?.map((id: string, idx: number) => (
                <TaskCard 
                    key={id} 
                    task={tasks[id]} 
                    index={idx}
                    columnId={column.id}
                    onDragStart={onDragStart}
                    onEdit={() => onEditTask(id)}
                    onDelete={() => onDeleteTask(column?.id, id)}
                    />
            ))}

            <button className={styles.addTask} onClick={() => onAddTask(column?.id)}>
                Add Task
            </button>
        </div>
    )
}