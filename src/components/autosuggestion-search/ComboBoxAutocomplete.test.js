import { render, screen, within } from "@testing-library/react";
import ComboBoxAutocomplete from "./ComboBoxAutocomplete";
import userEvent from "@testing-library/user-event";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useRef } from "react";

describe("Combobox component", () => {
  test("renders list", () => {
    // const initialValues = {
    //   degree: [],
    // };
    // const validationSchema = Yup.object({
    //   degree: Yup.array().of(Yup.string()),
    // });
    // const onSubmit = (values) => {
    //   alert("submitted");
    //   console.log({ values });
    // };
    // const formik = useFormik({
    //   enableReinitialize: true,
    //   initialValues,
    //   validationSchema,
    //   onSubmit,
    // });
    const numArr = Array.from({ length: 50 }, (el, idx) => ({
      item: `item${idx}`,
    }));
    const onApply = (data) => {
      console.log({ data });
      //   formik.setFieldValue("degree", data);
    };
    render(
      <ComboBoxAutocomplete
        options={numArr}
        virtualized={false}
        isSingleSelect={false}
        getValue={(o) => o.item}
        getLabel={(o) => o.item}
        creatable={(newSkill) => newSkill}
        name="degree"
        value={"btech"}
        onApply={onApply}
        inputPlaceholder="Select skills"
      />
    );
    const input = screen.getByTestId("comboinput");
    userEvent.click(input);
    const selectedList = screen.getByRole("list", {
      name: "selected-list",
    });
    const { getAllByRole } = within(selectedList);
    const selectedListItems = getAllByRole("listitem");
    expect(selectedListItems.length).not.toBe(0);
  });
});
