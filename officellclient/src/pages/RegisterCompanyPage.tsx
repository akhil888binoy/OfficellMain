import { Sidebar } from "../components/common/Sidebar";
import { UserCard } from "../components/user/UserCard";
import CompanyRegister from "../components/company/CompanyRegister";
import useUserStore from "../store/userStore";

const RegisterCompanyPage = () => {
  const location = useUserStore((state) => state.location);
  const user = useUserStore((state) => state.user);
  

    return (
    <div className="w-screen h-screen flex bg-gray-950">
      {/* Sidebar */}
      <div className="h-screen border-r-1 border-gray-700  " >
      <Sidebar/>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-row transition-all duration-300 sm:ml-64">
        {/* Feeds */}
        <div className="flex-1 bg-gray-950 overflow-y-scroll " >
        <CompanyRegister></CompanyRegister>
        </div>
        {/* Filters & Categories (desktop only) */}
        <div className="bg-gray-950 w-80 h-screen hidden border-l border-gray-700 lg:block p-4 ">
          <UserCard username={user.username} location={location.city} />
        </div>
      </div>
    </div>
    )
}

export default RegisterCompanyPage