import { MdLocationOn } from "react-icons/md";

export const UserCard = ({ username, location }: { username: string; location: string }) => {
  return (
    <div className="w-full  bg-gray-950  p-6 flex items-center gap-5  border-gray-700 transition">
      {/* Avatar */}
      {/* <div className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-lg">
        {username[0]}
      </div> */}

      {/* Info */}
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-semibold tracking-[1px] font-dmsans text-gray-900 dark:text-gray-100">
          {username}
        </h3>
        <div className="flex font-dmsans items-center text-sm text-gray-600 dark:text-gray-400">
          <MdLocationOn className="mr-1 text-red-400" />
          <span>{location}</span>
        </div>
      </div>
    </div>
  );
};
