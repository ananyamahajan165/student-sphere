export default function Modal({ title, children, onClose }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="ghost" onClick={onClose}>Close</button>
        </div>
        {children}
      </div>
    </div>
  );
}
