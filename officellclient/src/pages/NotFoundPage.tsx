import FuzzyText from "../styles/FuzzyText"

const NotFoundPage = () => {
  return (
    <div className="h-screen w-screen bg-gray-950 flex  justify-center items-center">
            <FuzzyText baseIntensity={0.2}>
                404
                Page Not Found
            </FuzzyText>
    </div>
  )
}

export default NotFoundPage