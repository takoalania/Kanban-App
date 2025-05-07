import { BoardData, Column, Task, Comment  } from './types';

// Every action Kanban board should do

export type BoardAction = 
    | {type: 'ADD_COLUMN'; payload: { title: string }}
    | {type: 'RENAME_COLUMN'; payload: { columnId: string; title: string }}
    | {type: 'DELETE_COLUMN'; payload: { columnId: string }}
    | {type: 'ADD_TASK'; payload: { columnId: string; task: Task }}
    | {type: 'EDIT_TASK'; payload: { task: Task }}
    | {type: 'DELETE_TASK'; payload: { columnId: string; taskId: string }}
    | {type: 'ADD_COMMENT'; payload: { taskId: string; comment: Comment }}
    | {type: 'EDIT_COMMENT'; payload: { taskId: string; comment: Comment }}
    | {type: 'DELETE_COMMENT'; payload: { taskId: string; commentId: string }}
    | {type: 'MOVE_TASK'; payload: {
        srcColumnId: string;
        destColumnId: string;
        srcIndex: number;
        destIndex: number;
        taskId: string;
    }}

export function boardReducer(state: BoardData, action: BoardAction): BoardData {
    switch(action.type) {
        case 'ADD_COLUMN': {
            const newColumn: Column = {
                id: `col-${Date.now()}`,
                title: action.payload.title,
                taskIds: [],
            };

            return { ...state, columns: [...state.columns, newColumn] }
        }

        case 'RENAME_COLUMN': {
            const { columnId, title } = action.payload;

            return {
                ...state, 
                columns: state.columns.map((col: Column) => {
                    return col.id === columnId ? { ...col, title } : col
                }),
            };
        }

        case 'DELETE_COLUMN': {
            const { columnId } = action.payload;
            const columns = state.columns.filter((col: Column) => col.id !== columnId);
            const toRemove = state.columns.find((col: Column) => col.id === columnId)?.taskIds || [];
            const tasks = { ...state.tasks };
            toRemove.forEach((id: string) => delete tasks[id]);

            return { columns, tasks };
        }

        case 'ADD_TASK': {
            const { columnId, task } = action.payload;
            
            return {
                ...state, 
                tasks: { ...state.tasks, [task.id]: task },
                columns: state.columns.map((col: Column) => {
                    return col.id === columnId ? { ...col, taskIds: [...col.taskIds, task.id] } : col
                }),
            };
        }

        case 'EDIT_TASK': {
            const { task } = action.payload;

            return {
                ...state, 
                tasks: { ...state.tasks, [task.id]: task },
            };
        }

        case 'DELETE_TASK': {
            const { taskId } = action.payload;
            const tasks = { ...state.tasks };
            delete tasks[taskId];
            const columns = state.columns.map((col: Column) => ({
                ...col,
                taskIds: col.taskIds.filter((id: string) => id !== taskId),
            }));

            return { ...state, tasks, columns };
        }

        case 'ADD_COMMENT': {
            const { taskId, comment } = action.payload;
            const task = state.tasks[taskId];
            const updatedTask = { ...task, comments: [...task.comments, comment] };
            
            return {
                ...state, 
                tasks: { ...state.tasks, [taskId]: updatedTask },
            };
        }

        case 'EDIT_COMMENT': {
            const { taskId, comment } = action.payload;
            const task = state.tasks[taskId];
            const updatedComments = task.comments.map((c: Comment) => {
                return c.id === comment.id ? comment: c
            });
            const updatedTask = { ...task, comments: updatedComments };
            
            return {
                ...state, 
                tasks: { ...state.tasks, [taskId]: updatedTask },
            };
        }

        case 'DELETE_COMMENT': {
            const { taskId, commentId } = action.payload;
            const task = state.tasks[taskId];
            const updatedTask = { 
                ...task, 
                comments: task.comments.filter((c: Comment) => c.id !== commentId),
            };
            
            return {
                ...state, 
                tasks: { ...state.tasks, [taskId]: updatedTask },
            };
        }

        case 'MOVE_TASK': {
            const { srcColumnId, destColumnId, srcIndex, destIndex, taskId } = action.payload;

            // remove from source
            let columns = state.columns.map((col: Column) => {
                if (col.id === srcColumnId) {
                    const ids = [...col.taskIds];
                    ids.splice(srcIndex, 1);
                    return { ...col, taskIds: ids };
                }

                return col;
            });

            // insert into destination
            columns = columns.map((col: Column) => {
                if (col.id === destColumnId) {
                    const ids = [...col.taskIds];
                    ids.splice(destIndex, 0, taskId);
                    return { ...col, taskIds: ids };
                }

                return col;
            });

            return { ...state, columns };
        }

        default: 
            return state;
    }
}

