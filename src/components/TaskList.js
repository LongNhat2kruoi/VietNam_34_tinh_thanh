import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onEdit, onDelete, onToggleComplete }) {
  // Hiển thị thông báo nếu chưa có công việc nào
  if (!tasks.length) return <div className="alert alert-light">Chưa có công việc nào</div>;
  
  // Sắp xếp: công việc chưa hoàn thành lên trước, sau đó sắp xếp theo ngày hạn
  const sorted = [...tasks].sort((a, b) => a.completed - b.completed || (a.dueDate || '').localeCompare(b.dueDate || ''));
  
  return (
    <div className="task-list-container">
      {/* Header với tiêu đề và các nút filter */}
      <div className="task-list-header">
        <h5>📝 Danh sách công việc</h5>
        <div className="filter-buttons">
          {/* Các nút filter (chỉ giao diện, chưa có chức năng) */}
          <button className="filter-btn active">
            Tất cả
          </button>
          <button className="filter-btn">
            Đang thực hiện
          </button>
          <button className="filter-btn">
            Đã hoàn thành
          </button>
          <button className="filter-btn">
            Sắp đến hạn
          </button>
        </div>
      </div>
      
      {/* Danh sách các công việc */}
      <ul className="list-group shadow-sm">
        {sorted.map(task => 
          <TaskItem 
            key={task.id} 
            task={task} 
            onEdit={onEdit} 
            onDelete={onDelete} 
            onToggleComplete={onToggleComplete} 
          />
        )}
      </ul>
    </div>
  );
}
