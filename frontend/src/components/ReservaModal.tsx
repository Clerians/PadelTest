// src/components/ReservaModal.tsx
import "../styles/ReservaModal.css";

interface ReservaModalProps {
  onClose: () => void;
}

const ReservaModal = ({ onClose }: ReservaModalProps) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>Nueva Reserva</h2>
        {/* Puedes agregar aquí los campos de fecha, hora, cancha, etc. */}
        <p>Crea una nueva reserva.</p>

        <button onClick={onClose} className="modal-close-btn">Cerrar</button>
      </div>
    </div>
  );
};

export default ReservaModal;