import { useAuth } from "../contexts/AuthContext.jsx";

export default function BookingForm({
  space,
  date,
  setDate,
  dateError,
  setDateError,
  minDate,
  today,
  timeSlot,
  setTimeSlot,
  chosenDateIsTodayInManila,
  slotEndIsPastInManila,
  user,
  navigate,
  spaceId,
  handleSubmit,
}) {
  const { login } = useAuth();

  const handleGuestLogin = (e) => {
    e.preventDefault();
    login("guest");
  };

  return (
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
          max="2026-12-31"
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
              if (y < today.getFullYear() || y > 2026) {
                setDateError(`Year must be ${today.getFullYear()} or 2026`);
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
        {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
      </div>

      {/* Time slot */}
      <div>
        <label className="block text-sm mb-1">Time Slot</label>
        <div className="relative">
          <select
            className="input shadow-sm focus:ring-2 focus:ring-pumpkin appearance-none pr-10 w-full"
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

          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-1000 pointer-events-none">
            ⤵︎
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="p-3 bg-orange-50 rounded-md text-sm">
        Estimated Total: <b className="text-pumpkin">₱{space.price}</b>
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
          onClick={handleGuestLogin}
          className="w-full px-4 py-2 rounded-xl font-medium transition bg-orange-300 text-white hover:bg-orange-400 hover:scale-[1.02]"
        >
          Login to Book (Guest)
        </button>
      )}
    </form>
  );
}
