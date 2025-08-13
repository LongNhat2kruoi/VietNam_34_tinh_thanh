import React, { useMemo, useState } from 'react';

// Hàm tạo ID ngẫu nhiên cho công việc mới
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
// Hàm lấy ngày hiện tại dưới dạng chuỗi YYYY-MM-DD
const todayStr = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  // Kiểm tra có phải đang ở chế độ chỉnh sửa không
  const isEdit = Boolean(initialData);
  // State lưu trữ giá trị của các input
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate ?? '');
  // State lưu trữ các lỗi validation
  const [errors, setErrors] = useState({});
  // Ngày tối thiểu cho input date (ngày hiện tại)
  const minDate = useMemo(() => todayStr(), []);

  // Hàm validation kiểm tra dữ liệu đầu vào
  function validate() {
    const errs = {};
    if (!title.trim()) errs.title = 'Tiêu đề không được để trống.';
    else if (title.trim().length > 50) errs.title = 'Tiêu đề tối đa 50 ký tự.';
    if (!dueDate) errs.dueDate = 'Ngày hạn không được để trống.';
    else if (dueDate < minDate) errs.dueDate = 'Ngày hạn không được nhỏ hơn ngày hiện tại.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Hàm xử lý khi submit form
  function handleSubmit(e) {
    e.preventDefault(); // Ngăn reload trang
    if (!validate()) return; // Dừng nếu validation thất bại
    
    // Tạo object công việc để gửi lên parent component
    const payload = {
      id: initialData ? initialData.id : genId(), // Giữ ID cũ nếu edit, tạo mới nếu add
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate,
      completed: initialData ? initialData.completed : false, // Giữ trạng thái completed nếu edit
    };
    onSubmit?.(payload);
    
    // Reset form chỉ khi thêm mới (không phải edit)
    if (!isEdit) {
      setTitle(''); setDescription(''); setDueDate(''); setErrors({});
    }
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5>
          {isEdit ? '✏️ Chỉnh sửa công việc' : '➕ Thêm công việc mới'}
        </h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Tiêu đề công việc *</label>
            <input type="text" className={`form-control ${errors.title ? 'is-invalid' : ''}`} value={title} onChange={e => setTitle(e.target.value)} />
            {errors.title && <div className="text-danger">{errors.title}</div>}
          </div>
          <div className="mb-3">
            <label>Mô tả công việc</label>
            <textarea className="form-control" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả chi tiết công việc (tùy chọn)" />
          </div>
          <div className="mb-3">
            <label>Ngày hạn *</label>
            <input type="date" className={`form-control ${errors.dueDate ? 'is-invalid' : ''}`} value={dueDate} onChange={e => setDueDate(e.target.value)} min={minDate} />
            {errors.dueDate && <div className="text-danger">{errors.dueDate}</div>}
          </div>
          <div className="mb-4">
            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                ➕ {isEdit ? 'Cập nhật' : 'Thêm công việc'}
              </button>
              {isEdit && <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>Hủy</button>}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
