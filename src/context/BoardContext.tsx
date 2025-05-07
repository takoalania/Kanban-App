import React, { createContext, useReducer, ReactNode, useEffect } from 'react';
import { BoardData } from './types';
import { boardReducer, BoardAction } from './boardReducer';
import { loadState, saveState } from '../utils/localStorage'

const DEFAULT_COLUMNS = [
    { id: 'col-1', title: 'To Do', taskIds: [] },
    { id: 'col-2', title: 'In Progress', taskIds: [] },
    { id: 'col-3', title: 'Done', taskIds: [] },
];

const initialState: BoardData = {
    columns: DEFAULT_COLUMNS,
    tasks: {},
}

export const BoardContext = createContext<{
    state: BoardData;
    dispatch: React.Dispatch<BoardAction>;
}>({
    state: initialState,
    dispatch: () => null,
});

export function BoardProvider({ children }: { children: ReactNode}) {
    const [state, dispatch] = useReducer(
        boardReducer,
        initialState,
        () => loadState<BoardData>() ?? initialState
    );

    useEffect(() => {
        saveState<BoardData>(state)
    }, [state]);

    return (
        <BoardContext.Provider value={{ state, dispatch }}>
            {children}
        </BoardContext.Provider>
    );
}
