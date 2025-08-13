import React from 'react';
// Hàm chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDate = date => date ? date.split('-').reverse().join('/') : '-';

export default function TaskItem({ task, onEdit, onDelete, onToggleComplete }) {
  return (
    <li className={`task-item-card ${task.completed ? 'completed' : ''}`}>
      {/* Phần nội dung chính của task */}
      <div className="task-content">
        {/* Checkbox để đánh dấu hoàn thành */}
        <div className="task-checkbox">
          <input 
            type="checkbox" 
            checked={task.completed} 
            onChange={() => onToggleComplete(task.id)}
            className="custom-checkbox"
          />
        </div>
        {/* Chi tiết thông tin task */}
        <div className="task-details">
          {/* Tiêu đề công việc */}
          <div className="task-title">{task.title}</div>
          {/* Mô tả (chỉ hiển thị nếu có) */}
          {task.description && (
            <div className="task-description">{task.description}</div>
          )}
          {/* Thông tin meta: ngày hạn và trạng thái */}
          <div className="task-meta">
            <span className="task-date">
              📅 {formatDate(task.dueDate)}
            </span>
            {/* Hiển thị badge trạng thái dựa trên completed */}
            {task.completed && (
              <span className="task-status completed">✅ Hoàn thành</span>
            )}
            {!task.completed && (
              <span className="task-status pending">⏳ Đang thực hiện</span>
            )}
          </div>
        </div>
      </div>
      {/* Các nút hành động */}
      <div className="task-actions">
        {/* Nút chỉnh sửa */}
        <button className="btn-action btn-edit" onClick={() => onEdit(task.id)} title="Chỉnh sửa">
          ✏️
        </button>
        {/* Nút xóa */}
        <button className="btn-action btn-delete" onClick={() => onDelete(task.id)} title="Xóa">
          🗑️
        </button>
      </div>
    </li>
  );
}