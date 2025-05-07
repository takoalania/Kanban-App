import React, { useContext, useState } from 'react';
import { BoardContext } from '../../context/BoardContext';
import Column from '../../components/Column/Column';
import TaskDetailsModal from '../../components/TaskDetailsModal/TaskDetailsModal';
import { Column as ColumnType } from '../../context/types';
import styles from './KanbanBoard.module.css';

export default function KanbanBoard() {
    const { state, dispatch } = useContext(BoardContext);
    const [openTaskId, setOpenTaskId] = useState<string | null>(null);

    const [dragInfo, setDragInfo] = useState<{
        srcColumnId: string;
        srcIndex: number;
        taskId: string;
      } | null>(null);

    const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    srcColumnId: string,
    srcIndex: number
    ) => {
    const taskId = state.columns
        .find(c => c.id === srcColumnId)!
        .taskIds[srcIndex];
    setDragInfo({ srcColumnId, srcIndex, taskId });
    e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
      };

      const handleDrop = (
        e: React.DragEvent<HTMLDivElement>,
        destColumnId: string
      ) => {
        e.preventDefault();
        if (!dragInfo) return;
        const destColumn = state.columns.find(c => c.id === destColumnId)!;
        const destIndex = destColumn.taskIds.length;
    
        dispatch({
          type: 'MOVE_TASK',
          payload: {
            srcColumnId: dragInfo.srcColumnId,
            destColumnId,
            srcIndex: dragInfo.srcIndex,
            destIndex,
            taskId: dragInfo.taskId,
          },
        });
        setDragInfo(null);
      };

    const handleAddColumn = () => {
        const title = prompt('New column name');

        if (title) {
            dispatch({ type: "ADD_COLUMN", payload: { title } });
        }
    }

    const handleAddTask = (columnId: string) => {
        const title = prompt('New task title');

        if (!title) return;

        const description = prompt('New task description') || '';

        if (title) {
            dispatch({
                type: "ADD_TASK",
                payload: {
                    columnId, 
                    task: { id: `task-${Date.now()}`, title, description, comments: [] }
                },  
            });
        }
    }

    const handleEditTask = (taskId: string) => {
        setOpenTaskId(taskId);
    }

    const handleDeleteTask = (columnId: string, taskId: string) => {
        if (window.confirm("Delete this task?")) {
            dispatch({ type: "DELETE_TASK", payload: { columnId, taskId } });
        }
    }

    console.log('BOARD STATE:', state);

    return (
        <>
            <div className={styles.board}>
                {state.columns.map((col: ColumnType) => (
                    <Column 
                        key={col?.id}
                        column={col}
                        tasks={state.tasks}
                        onAddTask={handleAddTask}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragStart={handleDragStart}
                    />
                ))}

                <button className={styles.addColumn} onClick={handleAddColumn}>
                    Add Column
                </button>
            </div>
            {openTaskId && (
                <TaskDetailsModal
                    task={state.tasks[openTaskId]}
                    onClose={() => setOpenTaskId(null)}
                />
            )}
        </>
    )
}