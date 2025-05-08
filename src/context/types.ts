export interface Comment {
    id: string;
    text: string;
    children: Comment[];
}

export interface Task {
    id: string;
    title: string;
    description: string;
    comments: Comment[];
}

export interface Column {
    id: string;
    title: string;
    taskIds: string[];
}

export interface BoardData {
    columns: Column[];
    tasks: Record<string, Task> 
}