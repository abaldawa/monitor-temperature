import React from "react";

function Cell( props ) {
    const
        {header, content} = props;

    const cellElem = header ? (
        <th className="Cell Cell-header">
            {content}
        </th>
    ) : (
        <td className="Cell">
            {content}
        </td>
    );

    return cellElem;
}

export default Cell;