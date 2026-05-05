import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SUBJECT_KEYS = [
  { key: 'iot', label: 'IoT' },
  { key: 'backendEngineering', label: 'Backend Engineering' },
  { key: 'dsoops', label: 'DSOOPS' },
  { key: 'computerNetworks', label: 'Computer Networks' },
  { key: 'discreteMathematics', label: 'Discrete Mathematics' },
];

const createEmptyStudent = () => ({
  name: '',
  enrollmentNumber: '',
  department: '',
  semester: '',
  year: '',
  phone: '',
});

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const [students, setStudents] = useState([]);
  const [ownStudent, setOwnStudent] = useState(null);
  const [circulars, setCirculars] = useState([]);
  const [form, setForm] = useState(createEmptyStudent());
  const [modalType, setModalType] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [markForm, setMarkForm] = useState({
    studentId: '',
    subject: SUBJECT_KEYS[0].key,
    marksObtained: '',
    maxMarks: '',
  });
  const [attendanceForm, setAttendanceForm] = useState({
    studentId: '',
    totalClasses: '',
    attendedClasses: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function loadData() {
    setIsLoading(true);
    await Promise.all([fetchStudents(), fetchCirculars()]);
    setIsLoading(false);
  }

  async function fetchStudents() {
    try {
      const res = await fetch('/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        if (res.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
        return;
      }
      const data = await res.json();
      if (user?.role === 'mentor') {
        setStudents(data);
      } else {
        setOwnStudent(data[0] || null);
      }
    } catch (err) {
      setError('Unable to load student data.');
    }
  }

  async function fetchCirculars() {
    try {
      const res = await fetch('/api/students/circulars', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCirculars(await res.json());
      }
    } catch (err) {
      setError('Unable to load circulars.');
    }
  }

  async function handleAddStudent(event) {
    event.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm(createEmptyStudent());
        setModalType('');
        fetchStudents();
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to add student.');
      }
    } catch (err) {
      setError('Unable to reach the server.');
    }
  }

  const openModal = (type, studentId = '') => {
    setError('');
    setModalType(type);
    setSelectedStudentId(studentId);
    if (type === 'marks') {
      setMarkForm((prev) => ({
        ...prev,
        studentId: studentId || prev.studentId,
        subject: SUBJECT_KEYS[0].key,
        marksObtained: '',
        maxMarks: '',
      }));
    }
    if (type === 'attendance') {
      setAttendanceForm({ studentId: studentId || '', totalClasses: '', attendedClasses: '' });
    }
  };

  const closeModal = () => {
    setModalType('');
    setSelectedStudentId('');
    setMarkForm({ studentId: '', subject: SUBJECT_KEYS[0].key, marksObtained: '', maxMarks: '' });
    setAttendanceForm({ studentId: '', totalClasses: '', attendedClasses: '' });
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  async function handleSaveMarks(event) {
    event.preventDefault();
    setError('');

    if (!markForm.studentId || !markForm.subject || markForm.marksObtained === '' || markForm.maxMarks === '') {
      setError('Please complete the marks form.');
      return;
    }

    try {
      const res = await fetch('/api/marks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: markForm.studentId,
          subject: markForm.subject,
          marksObtained: Number(markForm.marksObtained),
          maxMarks: Number(markForm.maxMarks),
        }),
      });

      if (res.ok) {
        closeModal();
        fetchStudents();
      } else {
        const data = await res.json();
        setError(data.message || 'Unable to save marks.');
      }
    } catch (err) {
      setError('Unable to save marks.');
    }
  }

  async function handleSaveAttendance(event) {
    event.preventDefault();
    setError('');

    if (!attendanceForm.studentId || attendanceForm.totalClasses === '' || attendanceForm.attendedClasses === '') {
      setError('Please complete the attendance form.');
      return;
    }

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: attendanceForm.studentId,
          totalClasses: Number(attendanceForm.totalClasses),
          attendedClasses: Number(attendanceForm.attendedClasses),
        }),
      });

      if (res.ok) {
        closeModal();
        fetchStudents();
      } else {
        const data = await res.json();
        setError(data.message || 'Unable to save attendance.');
      }
    } catch (err) {
      setError('Unable to save attendance.');
    }
  }

  async function deleteStudent(studentId) {
    if (!window.confirm('Delete this student?')) return;

    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchStudents();
      } else {
        setError('Unable to delete student.');
      }
    } catch (err) {
      setError('Unable to delete student.');
    }
  }

  function handleLogout() {
    localStorage.clear();
    navigate('/login');
  }

  const handleInput = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const renderAddStudentForm = () => (
      <form onSubmit={handleAddStudent} className="student-form">
        <div className="form-row">
          <label>Name</label>
          <input value={form.name} onChange={(event) => handleInput('name', event.target.value)} required />
        </div>
        <div className="form-row">
          <label>Enrollment #</label>
          <input value={form.enrollmentNumber} onChange={(event) => handleInput('enrollmentNumber', event.target.value)} required />
        </div>
        <div className="form-row">
          <label>Department</label>
          <input value={form.department} onChange={(event) => handleInput('department', event.target.value)} required />
        </div>
        <div className="form-row">
          <label>Semester</label>
          <input value={form.semester} onChange={(event) => handleInput('semester', event.target.value)} required />
        </div>
        <div className="form-row">
          <label>Year</label>
          <input value={form.year} onChange={(event) => handleInput('year', event.target.value)} required />
        </div>
        <div className="form-row">
          <label>Phone</label>
          <input value={form.phone} onChange={(event) => handleInput('phone', event.target.value)} required />
        </div>
        <button type="submit" className="primary">Save student</button>
      </form>
  );

  const renderActionPanel = () => {
    if (!modalType || user?.role !== 'mentor') return null;

    const title = modalType === 'addStudent'
      ? 'Add student'
      : modalType === 'marks'
      ? 'Add marks'
      : 'Add attendance';

    return (
      <div className="action-panel">
        {modalType === 'addStudent' ? (
          <div className="form-panel">
            <div className="panel-header">
              <h3>{title}</h3>
              <button type="button" className="ghost" onClick={closeModal}>Close</button>
            </div>
            {renderAddStudentForm()}
          </div>
        ) : (
          <div className="form-panel">
            <div className="panel-header">
              <h3>{title}</h3>
              <button type="button" className="ghost" onClick={closeModal}>Close</button>
            </div>
            {modalType === 'marks' && (
              <form onSubmit={handleSaveMarks} className="student-form">
                <div className="form-row">
                  <label>Select student</label>
                  <select
                    value={markForm.studentId || selectedStudentId}
                    onChange={(event) => setMarkForm((prev) => ({ ...prev, studentId: event.target.value }))}
                    required
                  >
                    <option value="">Choose a student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Subject</label>
                  <select
                    value={markForm.subject}
                    onChange={(event) => setMarkForm((prev) => ({ ...prev, subject: event.target.value }))}
                    required
                  >
                    {SUBJECT_KEYS.map((subject) => (
                      <option key={subject.key} value={subject.key}>{subject.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Marks obtained</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={markForm.marksObtained}
                    onChange={(event) => setMarkForm((prev) => ({ ...prev, marksObtained: event.target.value }))}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Max marks</label>
                  <input
                    type="number"
                    min="1"
                    value={markForm.maxMarks}
                    onChange={(event) => setMarkForm((prev) => ({ ...prev, maxMarks: event.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="primary">Save marks</button>
              </form>
            )}
            {modalType === 'attendance' && (
              <form onSubmit={handleSaveAttendance} className="student-form">
                <div className="form-row">
                  <label>Select student</label>
                  <select
                    value={attendanceForm.studentId || selectedStudentId}
                    onChange={(event) => setAttendanceForm((prev) => ({ ...prev, studentId: event.target.value }))}
                    required
                  >
                    <option value="">Choose a student</option>
                    {students.map((student) => (
                      <option key={student._id} value={student._id}>{student.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label>Total classes</label>
                  <input
                    type="number"
                    min="1"
                    value={attendanceForm.totalClasses}
                    onChange={(event) => setAttendanceForm((prev) => ({ ...prev, totalClasses: event.target.value }))}
                    required
                  />
                </div>
                <div className="form-row">
                  <label>Attended classes</label>
                  <input
                    type="number"
                    min="0"
                    value={attendanceForm.attendedClasses}
                    onChange={(event) => setAttendanceForm((prev) => ({ ...prev, attendedClasses: event.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="primary">Save attendance</button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderStudentTable = () => (
    <div className="students-panel">
      <div className="panel-header">
        <h3>Student performance</h3>
        <span>Total students: {students.length}</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Department</th>
              <th>Average Marks</th>
              <th>Average Attendance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => {
              const averageMarks = student.marks?.length
                ? Math.round(student.marks.reduce((sum, item) => sum + (item.percentage || 0), 0) / student.marks.length)
                : 0;
              const averageAttendance = student.attendance?.percentage || 0;
              return (
                <tr key={student._id}>
                  <td>{index + 1}</td>
                  <td>{student.name}</td>
                  <td>{student.personalDetails?.department || '—'}</td>
                  <td>{student.marks?.length ? `${averageMarks}%` : '—'}</td>
                  <td>{student.attendance?.percentage != null ? `${averageAttendance}%` : '—'}</td>
                  <td className="actions-cell">
                    <button type="button" className="ghost" onClick={() => openModal('marks', student._id)}>Add marks</button>
                    <button type="button" className="ghost" onClick={() => openModal('attendance', student._id)}>Attendance</button>
                    <button type="button" className="ghost danger" onClick={() => deleteStudent(student._id)}>Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
  const renderProfile = () => {
    if (user?.role === 'mentor') {
      return (
        <div className="profile-card">
          <div className="profile-banner">
            <div className="university-mark">SS</div>
            <div>
              <div className="profile-name">{user?.name}</div>
              <div className="profile-role">Mentor</div>
            </div>
          </div>
          <div className="profile-info">
            <div><strong>Email:</strong> {user?.email}</div>
            <div><strong>Role:</strong> Mentor</div>
          </div>
        </div>
      );
    }

    return (
      <div className="profile-card">
        <div className="profile-banner">
          <div className="university-mark">SS</div>
          <div>
            <div className="profile-name">{ownStudent?.name || user?.name}</div>
            <div className="profile-role">Student</div>
          </div>
        </div>
        <div className="profile-info">
          <div><strong>Roll No:</strong> {ownStudent?.personalDetails?.enrollmentNumber || 'Not set'}</div>
          <div><strong>Department:</strong> {ownStudent?.personalDetails?.department || 'Not set'}</div>
          <div><strong>Semester:</strong> {ownStudent?.personalDetails?.semester || 'Not set'}</div>
          <div><strong>Year:</strong> {ownStudent?.personalDetails?.year || 'Not set'}</div>
          <div><strong>Phone:</strong> {ownStudent?.personalDetails?.phone || 'Not set'}</div>
        </div>
      </div>
    );
  };


  const renderStudentSubjects = (student) => (
    <div className="subjects-grid">
      {SUBJECT_KEYS.map((subject) => {
        const record = student.marks?.find((item) => item.subject === subject.key) || { marksObtained: 0, maxMarks: 0, percentage: 0 };
        return (
          <div className="subject-card" key={subject.key}>
            <div className="subject-label">{subject.label}</div>
            <div className="subject-value">Score: {record.percentage}%</div>
            <div className="subject-value">{record.marksObtained}/{record.maxMarks} marks</div>
          </div>
        );
      })}
    </div>
  );

  const renderStudentDashboard = () => {
    if (!ownStudent) {
      return <div className="loading-message">Loading student dashboard…</div>;
    }

    const averageMarks = ownStudent.marks?.length
      ? Math.round(ownStudent.marks.reduce((sum, item) => sum + (item.percentage || 0), 0) / ownStudent.marks.length)
      : 0;
    const averageAttendance = ownStudent.attendance?.percentage || 0;

    return (
      <div className="student-dashboard-panel">
        <div className="panel-header">
          <div>
            <h3>Student dashboard</h3>
            <p className="subtle">Your academic summary, attendance and subjects at a glance.</p>
          </div>
          <div className="student-metrics">
            <div className="metric-card">
              <strong>{averageMarks}%</strong>
              <span>Avg marks</span>
            </div>
            <div className="metric-card">
              <strong>{averageAttendance}%</strong>
              <span>Avg attendance</span>
            </div>
          </div>
        </div>
        <div className="student-detail-grid">
          <div className="student-detail-card">
            <h4>Profile</h4>
            <div className="detail-row"><span>Full name</span><strong>{ownStudent.name || user?.name}</strong></div>
            <div className="detail-row"><span>Admission No.</span><strong>{ownStudent.personalDetails?.enrollmentNumber || 'N/A'}</strong></div>
            <div className="detail-row"><span>Grade / Class</span><strong>{ownStudent.personalDetails?.department || 'N/A'} - Sem {ownStudent.personalDetails?.semester || 'N/A'}</strong></div>
            <div className="detail-row"><span>Year</span><strong>{ownStudent.personalDetails?.year || 'N/A'}</strong></div>
          </div>
          <div className="student-detail-card">
            <h4>Contact</h4>
            <div className="detail-row"><span>Email</span><strong>{user?.email || 'N/A'}</strong></div>
            <div className="detail-row"><span>Phone</span><strong>{ownStudent.personalDetails?.phone || 'N/A'}</strong></div>
            <div className="detail-row"><span>Department</span><strong>{ownStudent.personalDetails?.department || 'N/A'}</strong></div>
            <div className="detail-row"><span>Status</span><strong>Active</strong></div>
          </div>
        </div>
        {renderStudentSubjects(ownStudent)}
        <div className="student-progress-grid">
          <div className="student-progress-card">
            <h4>Attendance record</h4>
            {ownStudent.attendance ? (
              <div>
                <div className="detail-row"><span>Total classes</span><strong>{ownStudent.attendance.totalClasses || '0'}</strong></div>
                <div className="detail-row"><span>Attended</span><strong>{ownStudent.attendance.attendedClasses || '0'}</strong></div>
                <div className="detail-row"><span>Attendance %</span><strong>{ownStudent.attendance.percentage != null ? `${ownStudent.attendance.percentage}%` : '0%'}</strong></div>
              </div>
            ) : (
              <p>No attendance has been uploaded yet.</p>
            )}
          </div>
          <div className="student-progress-card">
            <h4>Marks summary</h4>
            {ownStudent.marks?.length ? (
              <table className="student-record-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Score</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {ownStudent.marks.map((mark) => (
                    <tr key={mark.subject}>
                      <td>{SUBJECT_KEYS.find((sub) => sub.key === mark.subject)?.label || mark.subject}</td>
                      <td>{mark.marksObtained}/{mark.maxMarks}</td>
                      <td>{mark.percentage != null ? `${mark.percentage}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No marks have been uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderTimeline = () => (
    <div className="timeline-card">
      <div className="timeline-header">
        <div>
          <h3>Campus updates</h3>
          <p>Important announcements, circulars, and reminders.</p>
        </div>
      </div>
      <div className="timeline-list">
        {circulars.length === 0 ? (
          <div className="timeline-empty">No circulars available.</div>
        ) : (
          circulars.map((item, index) => (
            <div key={`${item.title}-${index}`} className="timeline-item">
              <div className="timeline-dot" />
              <div className="timeline-content">
                <div className="timeline-date">{item.date}</div>
                <h4>{item.title}</h4>
                <p>{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <main className="page-shell dashboard-page">
      <div className="topbar">
        <div className="topbar-left">
          <div className="topbar-title">Student Sphere</div>
          <div className="session-chip">
            <label>Session</label>
            <select defaultValue="JanJun2026">
              <option value="JanJun2026">JanJun2026</option>
              <option value="JulDec2026">JulDec2026</option>
            </select>
          </div>
        </div>
        <div className="topbar-right">
          <button type="button" className="ghost theme-toggle" onClick={toggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button className="ghost" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <section className="container dashboard-card">
        <div className="brand-head">
          <div className="brand-logo">SS</div>
          <div className="brand-meta">
            <h1>University Performance Dashboard</h1>
            <p>Track students, attendance, marks and campus circulars in one place.</p>
          </div>
        </div>
        <div className="profile-summary">
          <div className="profile-detail">
            <strong>{user?.name}</strong>
            <div>{user?.email}</div>
            <div>{user?.role === 'mentor' ? 'Mentor account' : 'Student account'}</div>
          </div>
          <div className="profile-quick">
            <div className="status-chip">Active</div>
            <div className="profile-id">Roll No: {ownStudent?.personalDetails?.enrollmentNumber || 'Not set'}</div>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="main-column">
          {user?.role === 'mentor' && (
            <div className="mentor-toolbar">
              <button className={modalType === 'addStudent' ? 'primary active-tab' : 'primary'} onClick={() => openModal('addStudent')}>Add student</button>
              <button className={modalType === 'marks' ? 'primary active-tab' : 'primary'} onClick={() => openModal('marks')}>Add marks</button>
              <button className={modalType === 'attendance' ? 'primary active-tab' : 'primary'} onClick={() => openModal('attendance')}>Add attendance</button>
            </div>
          )}
          {user?.role === 'mentor' && renderActionPanel()}
          {user?.role === 'mentor' && renderStudentTable()}
          {user?.role !== 'mentor' && renderStudentDashboard()}
          {isLoading ? <div className="loading-message">Loading dashboard...</div> : renderTimeline()}
          {error && <div className="error-banner">{error}</div>}
        </div>

        <aside className="side-column">
          {renderProfile()}
          <div className="quick-links">
            <h4>Campus links</h4>
            <a href="#">Hostel portal</a>
            <a href="#">Bus schedule</a>
            <a href="#">Library</a>
          </div>
        </aside>
      </section>

    </main>
  );
}
