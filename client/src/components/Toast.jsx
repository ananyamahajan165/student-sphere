import './Toast.css';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  return (
    <div className={`toast toast-${type}`} onClick={onClose}>
      <span>{message}</span>
      <button type="button" className="toast-close">×</button>
    </div>
  );
}
