import { Link } from "react-router-dom";

export default function SpaceCard({ space }) {
  return (
    <div
      className="card flex flex-col transition-transform duration-300 hover:shadow-lg hover:-translate-y-1"
    >
      {/* Image */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={space.main_image}
          alt={space.name}
          className="h-40 w-full object-cover rounded-xl hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mt-3 hover:text-pumpkin transition-colors duration-200">
          {space.name}
        </h3>
        <p className="text-sm text-davy">{space.location}</p>

        <div className="mt-2 text-sm flex items-center gap-3">
          <span className="font-medium">₱{space.price}</span>
        </div>

        {/* Amenities section */}
        <div className="mt-3 mb-5 flex flex-wrap gap-2 text-xs text-davy">
          {space.amenities.slice(0, 4).map((a) => (
            <span
              key={a}
              className="px-2 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              {a}
            </span>
          ))}
          {space.amenities.length > 4 && (
            <span className="px-2 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
              +{space.amenities.length - 4} more
            </span>
          )}
        </div>

        {/* Button */}
        <Link
          to={`/space/${space.id}`}
          className="btn-primary mt-auto text-center hover:brightness-110 transition duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
