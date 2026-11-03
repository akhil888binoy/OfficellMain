import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-5 text-center text-white">
      <p className="text-sm text-gray-500">404</p><h1 className="mt-3 text-2xl font-medium text-gray-100">Page not found</h1>
      <Link to="/feed" className="mt-6 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-gray-950">Go to feed</Link>
    </div>
  )
}

export default NotFoundPage
