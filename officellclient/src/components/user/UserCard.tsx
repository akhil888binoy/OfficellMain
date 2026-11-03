import { MdLocationOn } from "react-icons/md";

export const UserCard = ({ username, location }: { username: string; location: string }) => {
  return (
    <div className="flex w-full items-center gap-4 bg-gray-950 px-5 py-4">
      {/* Avatar */}
      {/* <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-lg">
        {username[0]}
      </div> */}

      {/* Info */}
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-semibold text-gray-100">
          {username}
        </h3>
        {location && <div className="flex items-center text-sm text-gray-400">
          <MdLocationOn className="mr-1 text-gray-500" />
          <span>{location}</span>
        </div>}
      </div>
    </div>
  );
};
