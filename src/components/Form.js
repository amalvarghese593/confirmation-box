import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ComboBoxAutocomplete from "./autosuggestion-search/ComboBoxAutocomplete";
import locations from "data/locations.json";
import ConfirmationBox from "./ConfirmationBox";

export const Form = () => {
  const initialValues = {
    name: "",
    phone: "",
    availabilityZones: [],
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    availabilityZones: Yup.array().min(1, "At least one location required"),
  });
  const onSubmit = (values) => {
    console.log({ values });
  };
  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const onApply = (data) => {
    console.log({ data });
    formik.setFieldValue("availabilityZones", data);
  };
  const onCreateNewOption = (val) => {
    console.log({ val });
  };
  return (
    <div className="p-3">
      <form className="text-start p-3 shadow w-50">
        <div className="w-50 mb-3">
          <label htmlFor="name">Name</label>
          <input
            className="form-control"
            type="text"
            placeholder="Name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Error err={formik.touched.name && formik.errors.name} />
        </div>
        <div className="w-50 mb-3">
          <label htmlFor="phone">Phone</label>
          <input
            className="form-control"
            type="text"
            placeholder="Phone"
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Error err={formik.touched.phone && formik.errors.phone} />
        </div>
        <div className="w-50 mb-3">
          <label htmlFor="availabilityZones">Availability Zones</label>
          <ComboBoxAutocomplete
            options={locations.locations}
            inputPlaceholder="Select locations"
            placeholder="Select locations"
            virtualized={false}
            isSingleSelect={false}
            getValue={(o) => o.location}
            getLabel={(o) => o.location}
            components={{}}
            creatable={(newSkill) => newSkill}
            name="availabilityZones"
            value={formik.values.availabilityZones}
            onApply={onApply}
            onCreateNewOption={onCreateNewOption}
          />
          <Error
            err={
              formik.touched.availabilityZones &&
              formik.errors.availabilityZones
            }
          />
        </div>
        <ConfirmationBox onSubmitForm={formik.handleSubmit} />
      </form>
    </div>
  );
};
const Error = ({ err }) =>
  err ? (
    <div>
      <span className="text-danger">{err}</span>
    </div>
  ) : null;
