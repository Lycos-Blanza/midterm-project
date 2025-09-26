export default function SpaceDetailCard({ space, navigate }) {
  return (
    <div className="card">
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Go back"
        className="mb-3 inline-flex items-center gap-2 px-3 py-1 text-sm bg-orange-100 hover:bg-orange-200 rounded-md transition"
      >
        ← Back to Home
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
      <p className="mt-2 leading-relaxed text-gray-700">{space.description}</p>

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
  );
}
