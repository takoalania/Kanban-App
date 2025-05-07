import { useState, useContext } from 'react';
import { Comment } from '../../context/types';
import { BoardContext } from '../../context/BoardContext';
import styles from './CommentList.module.css';

interface Props {
  taskId: string;
  comments: Comment[];
}

export default function CommentList({ taskId, comments }: Props) {
  const { dispatch } = useContext(BoardContext);
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    if (!newText.trim()) return;
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        taskId,
        comment: { id: `c-${Date.now()}`, text: newText.trim() },
      },
    });
    setNewText('');
  };

  const handleEdit = (id: string) => {
    const existing = comments.find((c: Comment) => c.id === id)?.text || '';
    const text = prompt('Edit comment', existing);
    if (text != null) {
      dispatch({ type: 'EDIT_COMMENT', payload: { taskId, comment: { id, text } } });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete comment?')) {
      dispatch({ type: 'DELETE_COMMENT', payload: { taskId, commentId: id } });
    }
  };

  return (
    <div className={styles.commentList}>
      <h3 className={styles.heading}>Comments</h3>

      {comments.map((c: Comment) => (
        <div key={c?.id} className={styles.comment}>
          <span className={styles.text}>{c?.text}</span>
          <button className={styles.link} onClick={() => handleEdit(c.id)}>Edit</button>
          <button className={styles.link} onClick={() => handleDelete(c.id)}>Delete</button>
        </div>
      ))}

      <div className={styles.newRow}>
        <label htmlFor={`new-comment-${taskId}`} className={styles.newLabel}>
          <span className="sr-only">New comment</span>
        </label>
        <input
          id={`new-comment-${taskId}`}
          value={newText}
          onChange={e => setNewText(e.target.value)}
          placeholder="New comment…"
          className={styles.newInput}
        />
        <button className={styles.addBtn} onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}
