import React, { useEffect, useMemo, useState } from 'react';
import './slyles.css'; // Import file CSS để styling giao diện
import TaskForm from './components/TaskForm'; // Component form thêm/sửa công việc
import TaskList from './components/TaskList'; // Component hiển thị danh sách công việc

export default function App() {
  // State lưu trữ danh sách tất cả công việc
  const [tasks, setTasks] = useState([]);
  // State lưu ID của công việc đang được chỉnh sửa (null nếu không có)
  const [editingId, setEditingId] = useState(null);

  // useEffect: Lưu danh sách công việc vào localStorage mỗi khi tasks thay đổi
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // useMemo: Tìm công việc đang được chỉnh sửa dựa trên editingId
  const currentTask = useMemo(() => tasks.find(t => t.id === editingId) || null, [tasks, editingId]);

  // Hàm thêm công việc mới vào đầu danh sách
  const addTask = t => setTasks(prev => [t, ...prev]);
  // Hàm cập nhật công việc và thoát chế độ chỉnh sửa
  const updateTask = t => { setTasks(prev => prev.map(p => p.id === t.id ? t : p)); setEditingId(null); };
  // Hàm xóa công việc (có xác nhận trước khi xóa)
  const deleteTask = id => { if (window.confirm('Xóa công việc này?')) setTasks(prev => prev.filter(p => p.id !== id)); };
  // Hàm đánh dấu hoàn thành/chưa hoàn thành công việc
  const toggleComplete = id => setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));

  // Tính toán các thống kê hiển thị trên dashboard
  const totalTasks = tasks.length; // Tổng số công việc
  const completedTasks = tasks.filter(t => t.completed).length; // Số công việc đã hoàn thành
  const pendingTasks = tasks.filter(t => !t.completed).length; // Số công việc đang thực hiện
  // Số công việc sắp đến hạn (trong vòng 7 ngày tới)
  const upcomingTasks = tasks.filter(t => {
    if (!t.dueDate || t.completed) return false;
    const today = new Date().toISOString().split('T')[0];
    const dueDate = t.dueDate;
    return dueDate >= today && dueDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }).length;

  return (
    <div className="app-container">
      {/* Header - Tiêu đề ứng dụng */}
      <div className="app-header">
        <h1 className="app-title">
          <span className="app-icon">📋</span>
          Task Manager
        </h1>
      </div>

      {/* Statistics Cards - Các thẻ thống kê */}
      <div className="stats-container">
        <div className="stat-card stat-total">
          <div className="stat-number">{totalTasks}</div>
          <div className="stat-label">Tổng công việc</div>
        </div>
        <div className="stat-card stat-completed">
          <div className="stat-number">{completedTasks}</div>
          <div className="stat-label">Đã hoàn thành</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-number">{pendingTasks}</div>
          <div className="stat-label">Đang thực hiện</div>
        </div>
        <div className="stat-card stat-upcoming">
          <div className="stat-number">{upcomingTasks}</div>
          <div className="stat-label">Sắp đến hạn</div>
        </div>
      </div>

      {/* Main Content - Nội dung chính */}
      <div className="main-content">
        <div className="content-row">
          {/* Form Section - Phần form thêm/sửa công việc */}
          <div className="form-section">
            <TaskForm 
              initialData={currentTask || undefined} 
              onSubmit={editingId ? updateTask : addTask} 
              onCancel={() => setEditingId(null)} 
            />
          </div>
          {/* List Section - Phần hiển thị danh sách công việc */}
          <div className="list-section">
            <TaskList 
              tasks={tasks} 
              onEdit={setEditingId} 
              onDelete={deleteTask} 
              onToggleComplete={toggleComplete} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
