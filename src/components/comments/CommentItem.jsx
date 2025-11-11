import { useState } from "react";

export default function CommentItem({
  node,
  onReply,
  onEdit,
  onDelete,
  onReact,
  children,
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [text, setText] = useState("");

  const submitReply = () => {
    onReply?.(node.id, text);
    setText("");
    setReplyOpen(false);
  };
  const submitEdit = () => {
    onEdit?.(node.id, text);
    setText("");
    setEditOpen(false);
  };

  return (
    <div style={{ paddingTop: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <div
          style={{
            width: 32,
            height: 32,
            background: "#222",
            borderRadius: 16,
          }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <strong>{node.author?.username || "User"}</strong>
            <span style={{ color: "#8a8f98", fontSize: 12 }}>
              {new Date(node.createdAt).toLocaleString()}
            </span>
            {node.isEdited && (
              <span style={{ color: "#8a8f98", fontSize: 12 }}>(изменено)</span>
            )}
            {node.depth > 5 && (
              <span style={{ marginLeft: 6, fontSize: 11, color: "#8a8f98" }}>
                lvl {node.depth}
              </span>
            )}
          </div>

          {!node.isDeleted ? (
            <p style={{ marginTop: 4, whiteSpace: "pre-wrap" }}>{node.text}</p>
          ) : (
            <i style={{ color: "#8a8f98" }}>Комментарий удалён</i>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
            <button onClick={() => onReact?.(node.id, "like")}>
              👍 {node.likes || 0}
            </button>
            <button onClick={() => onReact?.(node.id, "dislike")}>
              👎 {node.dislikes || 0}
            </button>
            <button onClick={() => setReplyOpen((v) => !v)}>Ответить</button>
            <button onClick={() => setEditOpen((v) => !v)}>Редактировать</button>
            <button onClick={() => onDelete?.(node.id)}>Удалить</button>
          </div>

          {replyOpen && (
            <div style={{ marginTop: 6 }}>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <button onClick={submitReply} disabled={!text.trim()}>
                  Отправить
                </button>
                <button
                  onClick={() => {
                    setReplyOpen(false);
                    setText("");
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {editOpen && (
            <div style={{ marginTop: 6 }}>
              <textarea
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ width: "100%" }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <button onClick={submitEdit} disabled={!text.trim()}>
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setEditOpen(false);
                    setText("");
                  }}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
