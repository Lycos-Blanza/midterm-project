import { useParams, useNavigate, useLocation } from "react-router-dom";
import SPACES from "../data/spaces.json";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useBookings } from "../contexts/BookingContext.jsx";
import { useState, useMemo } from "react";
import SpaceDetailCard from "../components/SpaceDetailsCard.jsx";
import BookingForm from "../components/BookingForm.jsx";

export default function SpaceDetail() {
  const { spaceId } = useParams(); // get spaceId from route
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addBooking } = useBookings();

  // Find the space by ID (memoized for performance)
  const space = useMemo(
    () => SPACES.find((s) => s.id === String(spaceId)),
    [spaceId]
  );

  // Form state
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [dateError, setDateError] = useState("");

  // Helper to format Date object to YYYY-MM-DD string
  function getLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // Minimum date allowed is today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = getLocalDateString(today);

  if (!space) return <p>Space not found.</p>; // fallback if space ID invalid

  const location = useLocation();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Redirect to login if not authenticated
    if (!user) {
      navigate("/login", { state: { from: `/space/${spaceId}` } });
      return;
    }
    if (!date) return alert("Please select a date");
    if (!timeSlot) return alert("Please select a time slot");

    const total = space.price; // 1-hour fixed booking
    addBooking({
      spaceId: space.id,
      spaceName: space.name,
      date,
      timeSlot,
      pricePerHour: space.price,
      total,
    });
    alert("Booking confirmed!");
    navigate("/dashboard/my-bookings");
  };

  // Convert 12-hour format string (e.g., "2:30 PM") to 24-hour {h, m} object
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

  // Check if the end of the selected time slot is already past in Manila time
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

    // If slot ends before it starts, treat it as next day
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
      endTime.h - 8, // Manila is UTC+8
      endTime.m,
      0
    );

    const nowUTCms = Date.now();
    return slotEndUTCms <= nowUTCms;
  };

  // Check if the chosen date is today in Manila timezone
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

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <SpaceDetailCard space={space} navigate={navigate} />
      <BookingForm
        space={space}
        date={date}
        setDate={setDate}
        dateError={dateError}
        setDateError={setDateError}
        minDate={minDate}
        today={today}
        timeSlot={timeSlot}
        setTimeSlot={setTimeSlot}
        chosenDateIsTodayInManila={chosenDateIsTodayInManila}
        slotEndIsPastInManila={slotEndIsPastInManila}
        user={user}
        navigate={navigate}
        spaceId={spaceId}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}
