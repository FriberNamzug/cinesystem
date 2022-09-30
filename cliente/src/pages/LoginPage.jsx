import Login from "../components/Login";

export default function LoginPage() {

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <div className="w-96 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-2xl duration-500  sm:p-6 lg:p-8 ">
          <Login />
        </div>
      </div>
    </div >
  )
}
