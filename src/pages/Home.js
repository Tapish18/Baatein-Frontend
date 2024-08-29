import React, { useState, useEffect } from "react";
import Input from "../customTags/Input";
import { FcGoogle } from "react-icons/fc";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { getAuthHeader, setToken, getToken } from "../helper/helperFunctions";
import { Navigate, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetUserState } from "../slices/userSlice";

const Home = () => {
  const [formDetails, setFormDetails] = useState({});
  const [isSignedUp, setIsSignedUp] = useState(false);
  const requiredMessage = "This is a required field.";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hitServer = async (val) => {
    console.log(process.env.REACT_APP_BASE_URL + "/auth");
    const data = await fetch(process.env.REACT_APP_BASE_URL + "/auth/signUp", {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(val),
    });
    const res = await data.json();
    console.log(res);
  };

  const hitServerForSignIn = async (val) => {
    console.log("hitServerForSignIn Called");
    const data = await fetch(process.env.REACT_APP_BASE_URL + "/auth/signIn", {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(val),
    });
    const json = await data.json();
    console.log(json);
    if (json.token) {
      setToken(json.token);
      navigate("/info");
    }
  };

  const signUpValidationSchema = Yup.object().shape({
    // fullName: Yup.string().required(requiredMessage),
    email: Yup.string().email("Invalid Email Id").required(requiredMessage),
    password: Yup.string().required(requiredMessage),
    ...(!isSignedUp
      ? { fullName: Yup.string().required(requiredMessage) }
      : {}),
  });

  const setInitialFormValues = () => {
    if (isSignedUp) {
      return {
        email: "",
        password: "",
      };
    } else {
      return {
        fullName: "",
        email: "",
        password: "",
      };
    }
  };
  useEffect(() => {
    if (getToken() != null) {
      navigate("/info");
    }
  });
  // console.log(formDetails);
  return (
    <div
      className="grid grid-cols-3 grid-rows-1 gap-x-10 overflow-scroll hide"
      style={{ msOverflowStyle: "none", scrollbarWidth: "none" }}
    >
      <div className="flex flex-shrink-1 col-span-2 rounded-lg border-2 border-white shadow-2xl overflow-hidden">
        <img
          className="h-full w-full object-cover"
          src="https://wallpapers.com/images/hd/communication-pictures-xg332y0w1a3srxhv.jpg"
          alt="Communication"
        />
      </div>
      <Formik
        initialValues={{ ...setInitialFormValues() }}
        validationSchema={signUpValidationSchema}
        onSubmit={(values, { resetForm }) => {
          console.log(isSignedUp);
          if (!isSignedUp) {
            console.log("Called from signUp");
            setFormDetails(values);
            hitServer(values);
            setIsSignedUp(true);
            resetForm();
          } else {
            console.log("Called from SignIn");
            hitServerForSignIn(values);
            console.log("API Call made");
            console.log(values);
          }
        }}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <Form className="flex flex-col max-h-[450px] min-w-[300px] bg-gradient-to-b from-purple-500 rounded-lg items-center p-4 shadow-sm border-2 border-white">
            <div className="font-bold text-2xl text-white italic my-4">
              {!isSignedUp
                ? "Get Started With baatein"
                : "Hooray!! Let's Sign In Now."}
            </div>
            {!isSignedUp && (
              <Input
                name="fullName"
                value={values?.fullName}
                inputType="text"
                handleChange={handleChange}
                error={errors?.fullName}
              >
                <div className="mr-2 font-semibold w-[40%] text-xl my-1 bg-transparent ">
                  Full Name
                </div>
              </Input>
            )}
            <Input
              name="email"
              value={values?.email}
              inputType="email"
              handleChange={handleChange}
              error={errors?.email}
            >
              <div className="mr-2 font-semibold w-[40%] text-xl my-1 bg-transparent ">
                Email
              </div>
            </Input>
            <Input
              name="password"
              value={values?.password}
              inputType="password"
              handleChange={handleChange}
              error={errors?.password}
            >
              <div className="mr-2 font-semibold w-[40%] text-xl my-1 bg-transparent ">
                Password
              </div>
            </Input>
            <button
              onClick={handleSubmit}
              type="submit"
              className="bg-[#fdce4b] p-2 w-full h-10 rounded-lg text-white font-semibold my-4"
            >
              {!isSignedUp ? "Sign Up" : "Sign In"}
            </button>
            {!isSignedUp && (
              <div className="my-2">
                <span className="mx-2 italic">Already a member?</span>
                <span
                  className="font-bold cursor-pointer"
                  onClick={() => {
                    console.log("isSignedUp  = True");
                    setIsSignedUp(true);
                  }}
                >
                  Sign In
                </span>
              </div>
            )}
            <button className="w-1/2 border-[.5px] border-black rounded-lg py-1 text-center mt-2">
              <FcGoogle className="h-5 w-5 inline-block" />
              <span className="ml-2 font-semibold">Google</span>
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Home;
