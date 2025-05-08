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
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleAdd = () => {
    if (!newText.trim()) return;
    dispatch({
      type: 'ADD_COMMENT',
      payload: {
        taskId,
        comment: { id: `c-${Date.now()}`, text: newText.trim(), children: [] },
      },
    });
    setNewText('');
  };

  const handleEdit = (id: string) => {
    const existingComment = comments.find(c => c.id === id);
    const existingText = existingComment?.text ?? '';
    const text = prompt('Edit comment', existingText);
    if (existingComment && text != null) {
      dispatch({
        type: 'EDIT_COMMENT',
        payload: {
          taskId,
          comment: {
            id,
            text,
            children: existingComment.children
          },
        },
      });
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete comment?')) {
      dispatch({ type: 'DELETE_COMMENT', payload: { taskId, commentId: id } });
    }
  };

  const handleReply = (parentId: string) => {
    if (!replyText.trim()) return;
    dispatch({
      type: 'ADD_REPLY',
      payload: {
        taskId,
        parentId,
        comment: { id: `c-${Date.now()}`, text: replyText.trim(), children: [] },
      },
    });
    setReplyText('');
    setReplyingTo(null);
  };

  const renderComments = (list: Comment[], level = 0) =>
    list.map(c => (
      <div key={c.id} style={{ marginLeft: level * 16 }}>
        <div className={styles.comment}>
          <span className={styles.text}>{c.text}</span>
          <button className={styles.link} onClick={() => handleEdit(c.id)}>Edit</button>
          <button className={styles.link} onClick={() => handleDelete(c.id)}>Delete</button>
          <button
            className={styles.link}
            onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
          >
            {replyingTo === c.id ? 'Cancel' : 'Reply'}
          </button>
        </div>

        {replyingTo === c.id && (
          <div className={styles.replyRow}>
            <input
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Reply..."
              className={styles.replyInput}
            />
            <button className={styles.addBtn} onClick={() => handleReply(c.id)}>
              Post
            </button>
          </div>
        )}

        {Array.isArray(c.children) && c.children.length > 0 && renderComments(c.children, level + 1)}
      </div>
  ));

  return (
    <div className={styles.commentList}>
      <h3 className={styles.heading}>Comments</h3>

      {renderComments(comments)}

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
