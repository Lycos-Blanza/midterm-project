import { useParams, useNavigate } from "react-router-dom";
import { SPACES } from "../data/spaces.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useBookings } from "../contexts/BookingContext.jsx";
import { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";

export default function SpaceDetail() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking } = useBookings();
  
  const space = useMemo(
    () => SPACES.find((s) => s.id === String(spaceId)),
    [spaceId]
  );

  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [hours, setHours] = useState(2);
  const [dateError, setDateError] = useState("");
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today.toISOString().split("T")[0];

  if (!space) return <p>Space not found.</p>;

  const location = useLocation();
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login", { state: { from: `/space/${spaceId}` } });
      return;
    }
    if (!date) return alert("Please select a date");
    if (!timeSlot) return alert("Please select a time slot");

    const total = space.price * Number(hours);
    addBooking({
      spaceId: space.id,
      spaceName: space.name,
      date,
      timeSlot,
      hours: Number(hours),
      pricePerHour: space.price,
      total,
    });
    alert("Booking confirmed!");
    navigate("/dashboard/my-bookings");
  };

  const parseTimeTo24 = (t) => {
    if (!t) return null;
    const m = t
      .trim()
      .toLowerCase()
      .match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
    if (!m) return null;
    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2] || "0", 10);
    const mer = m[3].toLowerCase();
    if (mer === "pm" && hh !== 12) hh += 12;
    if (mer === "am" && hh === 12) hh = 0;
    return { h: hh, m: mm };
  };

  const slotEndIsPastInManila = (dateStr, slot) => {
    if (!dateStr) return false;

    const parts = slot.split(/\s*-\s*/);
    if (parts.length === 0) return false;

    let endPart = parts.length > 1 ? parts[1] : parts[0];
    const endMatch = endPart.match(/(\d{1,2}(?::\d{2})?\s*(am|pm))/i);
    if (!endMatch) return false;
    const endTime = parseTimeTo24(endMatch[0]);
    if (!endTime) return false;

    let startPart = parts[0];
    const startMatch = startPart.match(/(\d{1,2}(?::\d{2})?\s*(am|pm))/i);
    const startTime = startMatch ? parseTimeTo24(startMatch[0]) : null;
    let endDayOffset = 0;
    if (startTime && endTime) {
      if (
        endTime.h < startTime.h ||
        (endTime.h === startTime.h && endTime.m <= startTime.m)
      ) {
        endDayOffset = 1;
      }
    }

    const [y, m, d] = dateStr.split("-").map(Number);
    const slotEndUTCms = Date.UTC(
      y,
      m - 1,
      d + endDayOffset,
      endTime.h - 8,
      endTime.m,
      0
    );

    const nowUTCms = Date.now();
    return slotEndUTCms <= nowUTCms;
  };

  const chosenDateIsTodayInManila = (() => {
    if (!date) return false;
    const nowManila = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
    );
    const [y, mo, da] = date.split("-").map(Number);
    return (
      nowManila.getFullYear() === y &&
      nowManila.getMonth() + 1 === mo &&
      nowManila.getDate() === da
    );
  })();

  const visibleSlots = useMemo(() => {
    if (!date) return space.time_slots ?? [];
    if (!chosenDateIsTodayInManila) return space.time_slots ?? [];

    return (space.time_slots ?? []).filter((slot) => {
      try {
        return !slotEndIsPastInManila(date, slot);
      } catch (err) {
        return true;
      }
    });
  }, [date, space.time_slots, chosenDateIsTodayInManila]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Left Side: Details */}
      <div className="card">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="mb-3 inline-flex items-center gap-2 px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 rounded-md transition"
        >
          ← Go Back
        </button>

        <div className="overflow-hidden rounded-xl">
          <img
            src={space.main_image}
            alt={space.name}
            className="w-full h-64 object-cover rounded-xl transition-transform duration-500 hover:scale-105"
          />
        </div>

        <h2 className="text-3xl font-bold mt-4">{space.name}</h2>
        <p className="text-gray-600">{space.location}</p>
        <p className="mt-2 leading-relaxed text-gray-700">
          {space.description}
        </p>

        {space.images?.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2">
            {space.images.map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-md">
                <img
                  src={img}
                  alt={`${space.name}-${idx}`}
                  className="rounded-md w-full h-32 object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {space.amenities.map((a) => (
            <span
              key={a}
              className="px-3 py-1 border border-gray-200 rounded-full text-xs text-gray-600 hover:bg-gray-100 transition"
            >
              {a}
            </span>
          ))}
        </div>

        <div className="mt-6 p-3 bg-gray-50 rounded-md text-sm">
          <p>
            Rate: <b className="text-black">₱{space.price}/hr</b>
          </p>
          <p className="text-gray-600">Available hours: {space.hours}</p>
        </div>
      </div>

      {/* Right Side: Booking Form */}
      <form
        onSubmit={handleSubmit}
        className="card space-y-4 border border-gray-100 shadow-sm hover:shadow-md transition"
      >
        <h3 className="text-lg font-semibold border-b pb-2">Book this space</h3>

        {/* Date */}
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            className="input shadow-sm focus:ring-2 focus:ring-pumpkin"
            value={date}
            min={minDate}
            max="2027-12-31"
            onChange={(e) => {
              const inputValue = e.target.value;
              setDateError("");
              setTimeSlot("");
              if (!inputValue) {
                setDate("");
                return;
              }
              const [y, mo, da] = inputValue.split("-").map(Number);
              if (y && y.toString().length === 4) {
                if (y < today.getFullYear() || y > 2027) {
                  setDateError(
                    `Year must be between ${today.getFullYear()} and 2027`
                  );
                  return;
                }
                const chosenDate = new Date(inputValue);
                chosenDate.setHours(0, 0, 0, 0);
                if (chosenDate < today) {
                  setDateError("Date cannot be before today");
                  return;
                }
              }
              setDate(inputValue);
            }}
          />
          {dateError && (
            <p className="text-red-500 text-xs mt-1">{dateError}</p>
          )}
        </div>

        {/* Time slot */}
        <div>
          <label className="block text-sm mb-1">Time Slot</label>
          <select
            className="input shadow-sm focus:ring-2 focus:ring-pumpkin"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            disabled={!date}
          >
            <option value="">
              {date ? "Select a slot" : "Please select a date first"}
            </option>

            {date &&
              (space.time_slots ?? []).map((slot) => {
                let unavailable = false;
                if (chosenDateIsTodayInManila) {
                  unavailable = slotEndIsPastInManila(date, slot);
                }

                return (
                  <option key={slot} value={slot} disabled={unavailable}>
                    {slot} {unavailable ? "(Unavailable)" : ""}
                  </option>
                );
              })}
          </select>
        </div>

        {/* Total */}
        <div className="p-3 bg-orange-50 rounded-md text-sm">
          Estimated Total:{" "}
          <b className="text-pumpkin">₱{space.price * Number(hours)}</b>
        </div>

        {user ? (
          <button
            className="btn-primary w-full hover:scale-[1.02] transition-transform duration-200"
            type="submit"
          >
            Confirm Booking
          </button>
        ) : (
          <button
            type="button"
            onClick={() =>
              navigate("/login", { state: { from: `/space/${spaceId}` } })
            }
            className="w-full px-4 py-2 rounded-xl font-medium transition bg-orange-300 text-white hover:bg-orange-400 hover:scale-[1.02]"
          >
            Login to Book
          </button>
        )}
      </form>
    </div>
  );
}
