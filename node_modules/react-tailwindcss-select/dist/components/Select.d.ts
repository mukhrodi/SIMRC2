import React from "react";
import { GroupOption, Option, Options as ListOption } from "./type";
interface SelectProps {
    options: ListOption;
    value: Option | Option[] | null;
    onChange: (value?: Option | Option[] | null) => void;
    placeholder?: string;
    isMultiple?: boolean;
    isClearable?: boolean;
    isSearchable?: boolean;
    isDisabled?: boolean;
    loading?: boolean;
    menuIsOpen?: boolean;
    searchInputPlaceholder?: string;
    noOptionsMessage?: string;
    primaryColor: string;
    formatGroupLabel?: ((data: GroupOption) => JSX.Element) | null;
    formatOptionLabel?: ((data: Option) => JSX.Element) | null;
    classNames?: {
        menuButton?: ({ isDisabled }: {
            isDisabled: boolean;
        }) => string;
        menu?: string;
        tagItem?: ({ isDisabled }: {
            isDisabled: boolean;
        }) => string;
        tagItemText?: string;
        tagItemIconContainer?: string;
        tagItemIcon?: string;
        list?: string;
        listGroupLabel?: string;
        listItem?: ({ isSelected }: {
            isSelected: boolean;
        }) => string;
        listDisabledItem?: string;
        ChevronIcon?: ({ open }: {
            open: boolean;
        }) => string;
        searchContainer?: string;
        searchBox?: string;
        searchIcon?: string;
        closeIcon?: string;
    };
}
declare const Select: React.FC<SelectProps>;
export default Select;
