import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Auth = () => {
  const [otp, setOtp] = React.useState("");
  const Navigate = useNavigate();
  async function handleSubmit() {
    const response = await axios.get(
      "http://localhost:5000/api/v1/users/auth?otp=" + otp
    );
    console.log(response.status);
    if (response.status == 200) {
      Navigate("/dashboard");
    }
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-5 lg:px-8">
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {" "}
          Otp verification{" "}
        </h2>
        <div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Enter otp
          </label>
          <div className="mt-2">
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="block w-full rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
          <div>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex w-full justify-center rounded-md bg-indigo-600 mt-8 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Verify...
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
