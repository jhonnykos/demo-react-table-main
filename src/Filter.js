import { React, useMemo, useState } from "react";
import { useAsyncDebounce } from "react-table";
// import { Label, Input } from "reactstrap";


// Component for Default Column Filter
export function DefaultFilterForColumn({
                                           column: {
                                                   filterValue,
                                                   preFilteredRows: { length },
                                                   setFilter,
                                               },
                                       }) {
    return (
        <input
            value={filterValue || ""}
            onChange={(e) => {
                // Set undefined to remove the filter entirely

                setFilter(e.target.value || undefined);
            }}
            placeholder={`Search ${length} records..`}
            style={{marginTop: "10px"}}
        />
    );
}