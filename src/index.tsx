import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BoardProvider } from './context/BoardContext';
import KanbanBoard from './pages/KanbanBoard/KanbanBoard';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <BoardProvider>
    <KanbanBoard />
  </BoardProvider>
);