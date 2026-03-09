import { RiBuilding2Line } from 'react-icons/ri'

const AddCompany = () => {
  return (
    <a href="/companies/register">
    <div 
        className="mt-3 p-3 bg-gray-900 rounded-lg border border-dashed border-gray-700 
hover:border-blue-500 hover:bg-gray-800 transition cursor-pointer text-sm">
                    <div className="flex items-center justify-center">
                        <div className="text-center">
                            <div className="flex justify-center mb-2">
                                <RiBuilding2Line className="text-base  sm:text-lg w-6 h-6 text-gray-500" />
                                <svg className="w-6 h-6 -ml-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <h3 className="text-base font-medium text-gray-200 group-hover:text-white">
                                Can't Find Your Company?
                            </h3>
                            <p className=" mt-1 text-xs text-gray-400  group-hover:text-gray-300">
                                Click here to register your company
                            </p>
                            <div className="mt-2 inline-flex items-center px-3 py-1 text-sm font-medium text-center text-blue-500 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
                                Add Company
                                <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
    </a>
  )
}

export default AddCompany