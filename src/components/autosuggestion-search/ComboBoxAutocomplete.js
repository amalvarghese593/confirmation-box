import React, {
  useEffect,
  Fragment,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { Combobox } from "@headlessui/react";
import "./index.css";
// import axios from "axios";
import ComboboxVirtualization from "./VirtualList";
import { lower } from "utils/lower";
import { isStr } from "utils/isString";
import { separateStringByComma } from "utils/separateStringByComma";
import { useChangeDropdownPosition } from "hooks/useChangeDropdownPosition";

const ComboBoxAutocomplete = ({
  virtualized,
  isSingleSelect,
  getLabel,
  getValue,
  transformResponse,
  apiCallInfo,
  inputPlaceholder,
  creatable,
  options,
  components,
  onSelect,
  getData,
  onApply,
  hideChips,
  placeholder,
  isLoading: loading,
  type,
  onCreateNewOption,
  ...rest
}) => {
  const { value } = rest;
  const [selectedItems, setSelectedItems] = useState([]);
  const [query, setQuery] = useState("");
  const addListItemRef = useRef();
  const [data, setData] = useState(options || []);
  /*eslint-disable  no-unused-vars*/
  const [isLoading] = useState(loading || false);
  const timeout = useRef();
  const inputContainerRef = useRef();
  const { isReverse } = useChangeDropdownPosition(inputContainerRef);
  const dropdownOpenButtonRef = useRef();

  useEffect(() => {
    if (value?.length) setSelectedItems(value);
  }, [value]);

  useEffect(() => setData(options), [options]);
  const valueHandler = (e) => {
    clearTimeout(timeout.current);
    const typedValue = e.target.value;
    setQuery(typedValue);
  };

  const transformedLabel = useCallback(
    (ele) => (isStr(ele) ? ele : getLabel(ele)),
    [getLabel]
  );

  const transformedValue = useCallback(
    (option) => {
      return isStr(option)
        ? option?.toLowerCase()
        : getValue(option)?.toLowerCase();
    },
    [getValue]
  );

  const filteredData = useMemo(
    () =>
      apiCallInfo || getData || query === ""
        ? data
        : data.filter((option) =>
            lower(transformedLabel(option)).includes(lower(query))
          ),
    /* eslint-disable  react-hooks/exhaustive-deps*/
    [query, data, apiCallInfo, transformedLabel]
  );

  const isObjectValue = useMemo(() => type === "object", [type]);
  const isSelected = useCallback(
    (currentItem) => {
      return !isSingleSelect
        ? selectedItems.some(
            (item) => transformedValue(item) === transformedValue(currentItem)
          )
        : isObjectValue
        ? getValue(selectedItems) === currentItem
        : selectedItems === currentItem;
    },
    [selectedItems, transformedValue]
  );

  const onSelection = (items) => {
    const isItemsArray = Array.isArray(items);
    if (isItemsArray) {
      const itemsArray = items.map((item) => transformedValue(item));
      const separatedItemsArray = [];

      const trueBlockFn = (value) => {
        value.length && separatedItemsArray.push(value.replace(/\.$/, ""));
      };
      const falseBlockFn = (el) => separatedItemsArray.push(el);

      itemsArray.forEach((el) => {
        separateStringByComma(el, trueBlockFn, falseBlockFn);
      });
      const uniqueItemsArray = [...new Set(separatedItemsArray)];

      const caseSensitiveArray = uniqueItemsArray.filter(
        (el, idx, array) =>
          !array.some(
            (item, index) =>
              item.toLowerCase() === el.toLowerCase() && idx > index
          )
      );
      setSelectedItems(caseSensitiveArray);
    } else {
      setSelectedItems(isObjectValue ? items : transformedValue(items));
    }
  };

  const removeItem = (item) => {
    const index = selectedItems.indexOf(item);
    const removableItems = [...selectedItems];
    removableItems.splice(index, 1);
    setSelectedItems(removableItems);
    onApply(removableItems);
  };

  const captureOnKeyDown = (e, activeOption) => {
    if (
      e.key === "Enter" &&
      filteredData.length !== 0 &&
      isSelected(activeOption)
    ) {
      setSelectedItems(
        selectedItems.filter(
          (item) => transformedValue(activeOption) !== transformedValue(item)
        )
      );
      e.stopPropagation();
    }
  };

  const handleCreateNewOption = () => {
    setQuery("");
    if (isSingleSelect) {
      onCreateNewOption(query);
      setSelectedItems(query);
    } else {
      setSelectedItems((prev) => {
        let arr = [...prev];
        query.replace(/\s+|\?|\$/, "");
        const trueBlockFn = (value) => {
          if (!arr.includes(value) && value.length) {
            arr.push(creatable(value));
            onCreateNewOption(creatable(value));
          }
        };
        const falseBlockFn = (str) => {
          if (!arr.includes(query)) {
            arr.push(creatable(query));
            onCreateNewOption(creatable(query));
          }
        };
        separateStringByComma(query, trueBlockFn, falseBlockFn);

        return arr;
      });
    }
  };
  const hasInputControl = useMemo(
    () => (components?.hasOwnProperty("InputControl") ? true : false),
    [components]
  );
  const additionalProps = {};
  if (!hasInputControl) {
    additionalProps.className =
      "rounded py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0";
  }
  const isMountedRef = useRef(false);
  useEffect(() => {
    if (isMountedRef.current) {
      if (onApply && isSingleSelect) {
        onApply(selectedItems);
      }
    } else {
      isMountedRef.current = true;
    }
  }, [selectedItems]);

  const addNewItemHandler = (e) => {
    if (filteredData.length === 0 && query.length >= 2 && e.key === "Enter") {
      //eslint-disable no-unused-expressions
      addListItemRef?.current?.click();
    }
  };

  const onApplyClick = () => {
    onApply(selectedItems);
    dropdownOpenButtonRef?.current?.click();
  };
  const onClear = () => {
    if (onApply) onApply([]);
    else onSelect([]);
    setSelectedItems([]);
    dropdownOpenButtonRef?.current?.click();
  };
  const comboboxBtnHandler = () => {
    addListItemRef?.current?.click();
    setQuery("");
  };
  const onClickControl = (open) => {
    if (!open) dropdownOpenButtonRef?.current?.click();
  };
  const AddNewOption = useMemo(
    () =>
      !isLoading &&
      filteredData?.length === 0 &&
      query.length >= 2 && (
        <div
          className="relative cursor-default select-none py-2 px-4 text-gray-700"
          ref={addListItemRef}
          onClick={handleCreateNewOption}
        >
          Add {query}
        </div>
      ),
    [isLoading, filteredData, query, handleCreateNewOption]
  );
  const EnterMinTwoCharacters = useMemo(
    () =>
      filteredData?.length === 0 &&
      query.length < 2 &&
      !isLoading &&
      apiCallInfo && <span>Please enter at least 2 characters</span>,
    [filteredData, query, isLoading, apiCallInfo]
  );
  return (
    <div className="combo-wrapper" style={{ width: "100%" }}>
      <div>
        <Combobox
          value={selectedItems}
          onChange={onSelection}
          multiple={!isSingleSelect}
        >
          {({ open, activeIndex, activeOption }) => {
            return (
              <>
                <div className="relative d-flex justify-content-start">
                  <div
                    ref={inputContainerRef}
                    className="w-100 relative mt-3 cursor-default overflow-hidden bg-white text-left sm:text-sm"
                  >
                    <ComboboxInput
                      data-testid="comboinput"
                      additionalProps={additionalProps}
                      valueHandler={valueHandler}
                      addNewItemHandler={addNewItemHandler}
                      onClick={() => onClickControl(open)}
                      onKeyDownCapture={(e) =>
                        captureOnKeyDown(e, activeOption)
                      }
                      placeholder={placeholder}
                      hasInputControl={hasInputControl}
                      {...rest}
                    />
                    <ComboboxBtn
                      ref={dropdownOpenButtonRef}
                      isLoading={isLoading}
                      filteredData={filteredData}
                      query={query}
                      onClick={comboboxBtnHandler}
                    />
                  </div>
                  <Combobox.Options
                    style={{
                      maxHeight: "320px",
                      width: "320px",
                      maxWidth: "100%",
                    }}
                    className={`combobox-list absolute ${
                      isReverse ? "reverse-position" : ""
                    } px-0 radius:8 flex  flex-column mt-5 max-h-60 w-100 overflow-auto bg-white py-1 text-base shadow-lg focus:outline-none sm:text-sm`}
                  >
                    {EnterMinTwoCharacters}
                    {isLoading && <Loader />}
                    {AddNewOption}
                    {!isLoading &&
                      (virtualized ? (
                        <ComboboxVirtualization
                          items={filteredData}
                          getValue={getValue}
                          getLabel={getLabel}
                          isSelected={isSelected}
                          isSingleSelect={isSingleSelect}
                        />
                      ) : (
                        filteredData?.map((item, idx) => (
                          <Combobox.Option
                            key={idx}
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-2 pl-5 pr-4 ${
                                active ? "bg-light text-dark" : "text-gray-900"
                              }`
                            }
                            value={getValue(item)}
                          >
                            {getLabel(item)}
                          </Combobox.Option>
                        ))
                      ))}
                    {!isSingleSelect && (
                      <ApplyClearBtn
                        onApplyClick={onApplyClick}
                        onClear={onClear}
                      />
                    )}
                  </Combobox.Options>
                </div>
                {!hideChips && !!selectedItems.length && !isSingleSelect && (
                  <SelectedChips
                    {...{ selectedItems, transformedLabel, removeItem }}
                  />
                )}
              </>
            );
          }}
        </Combobox>
      </div>
    </div>
  );
};
export default ComboBoxAutocomplete;

const SelectedChips = ({ selectedItems, transformedLabel, removeItem }) => (
  <ul aria-labelledby="selected-list" className="flex flex-wrap ml-0 pl-0 mt-2">
    {selectedItems.map((el, idx) => (
      <Fragment key={idx}>
        <li className="chip  mr-1 mb-1">
          {transformedLabel(el)}
          <span className="ml-1 hover:light" onClick={() => removeItem(el)}>
            &times;
          </span>
        </li>
      </Fragment>
    ))}
  </ul>
);

const ComboboxInput = ({
  valueHandler,
  addNewItemHandler,
  additionalProps,
  inputPlaceholder,
  onKeyDownCapture,
  hasInputControl,
  placeholder,
  ...rest
}) => (
  <Combobox.Input
    as={Fragment}
    autoComplete="off"
    onChange={valueHandler}
    onKeyDownCapture={onKeyDownCapture}
    onKeyDown={addNewItemHandler}
    placeholder={inputPlaceholder}
    {...additionalProps}
    {...rest}
  >
    {hasInputControl ? (
      <components.InputControl
        placeholder={placeholder || `Select ${placeholder} `}
      />
    ) : (
      <input style={{ border: "1px solid #000" }} />
    )}
  </Combobox.Input>
);

const ComboboxBtn = React.forwardRef(
  ({ isLoading, filteredData, query, onClick }, ref) => (
    <Combobox.Button
      ref={ref}
      className="absolute combobox-arrow inset-y-0 right-0 flex items-center pr-2 bg-transparent"
    >
      {!isLoading && filteredData?.length === 0 && query.length >= 2 ? (
        <span style={{ fontSize: "25px" }} onClick={onClick}>
          &#43;
        </span>
      ) : (
        <i
          className="fa-solid fa-caret-down fs-17 ml-2"
          style={{ color: "#71b783" }}
        ></i>
      )}
    </Combobox.Button>
  )
);

const ApplyClearBtn = ({ onClear, onApplyClick }) => (
  <div className="d-flex align-items-center">
    <div className="ms-auto">
      <button className="btn btn-light me-2 border-0" onClick={onClear}>
        Clear
      </button>
      <button className="btn btn-primary border-0" onClick={onApplyClick}>
        Apply
      </button>
    </div>
  </div>
);

const Loader = () => (
  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
    <span>Loading...</span>
  </div>
);
