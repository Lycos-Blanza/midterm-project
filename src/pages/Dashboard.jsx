import { useState } from "react";
import { useBookings } from "../contexts/BookingContext.jsx";
import Modal from "../components/Modal.jsx";

export default function Dashboard() {
  const { bookings, cancelBooking } = useBookings();
  const [toDelete, setToDelete] = useState(null);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-davy">You have no bookings yet.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b) => (
            <div key={b.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{b.spaceName}</h3>
                <p className="text-sm text-davy">
                  {b.date} • {b.timeSlot} • {b.hours} hour(s)
                </p>

                <p className="text-sm">
                  Total: <b>₱{b.total}</b>
                </p>
              </div>
              <button
                className="btn-secondary"
                onClick={() => setToDelete(b.id)}
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(toDelete)}
        title="Cancel booking?"
        description="This action cannot be undone."
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          cancelBooking(toDelete);
          setToDelete(null);
        }}
      />
    </div>
  );
}
