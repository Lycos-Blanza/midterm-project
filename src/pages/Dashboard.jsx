import { useState } from "react";
import { useBookings } from "../contexts/BookingContext.jsx";
import Modal from "../components/Modal.jsx";
import SPACES from "../data/spaces.json";

export default function Dashboard() {
  const { bookings, cancelBooking } = useBookings(); // get bookings state and cancel function
  const [toDelete, setToDelete] = useState(null); // track which booking is about to be deleted

  // Helper to get main image of a space by its name
  const getSpaceImage = (spaceName) => {
    const space = SPACES.find((s) => s.name === spaceName);
    return space ? space.main_image : "/assets/placeholder.jpg"; // fallback if not found
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-4">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="grid gap-6">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-4 bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition"
            >
              {/* Left image */}
              <img
                src={getSpaceImage(b.spaceName)}
                alt={b.spaceName}
                className="w-28 h-20 object-cover rounded-lg"
              />

              {/* Booking details */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{b.spaceName}</h3>
                <p className="text-sm text-gray-500">
                  {b.date} • {b.timeSlot}
                </p>
                <p className="text-sm mt-1">
                  Total: <b className="text-orange-600">₱{b.total}</b>
                </p>
              </div>

              {/* Cancel button */}
              <button
                className="px-4 py-2 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
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
