import React from "react";
import { Field } from "formik";
const Input = ({
  name,
  value,
  error,
  handleChange,
  inputType = "test",
  children,
}) => {
  return (
    <div className="flex flex-row text-white m-2">
      {children}

      <div className="my-1 w-[60%]">
        <Field
          className="pr-2 outline-none bg-transparent border-b-2 border-white w-[100%] -mt-2 text-lg font-semibold"
          name={name}
          type={
            inputType == "text"
              ? "text"
              : inputType == "password"
              ? "password"
              : inputType == "email"
              ? "email"
              : null
          }
          value={value}
          onChange={handleChange}
        />
        {error && <p className="text-red-500 -my-0 text-sm">{error}</p>}
      </div>
    </div>
  );
};

export default Input;
