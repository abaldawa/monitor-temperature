
import React from 'react';
import Cell from './Cell';
import '../../../index.css';

function DataTable( props ) {
    const
        {headings = [], rows = []} = props;

    const thead = (
        <tr key="heading">
            {
                headings.map( headerText => {
                    return (
                        <Cell
                            content={headerText}
                            header={true}
                        />
                    );
                })
            }
        </tr>
    );

    const tbody = rows.map( (rowObj) => {
        let safeOrUnsafe = '';

        if( typeof rowObj.safe === "boolean" ) {
            safeOrUnsafe = rowObj.safe ? "safeRow" : "unsafeRow";
        }

        return (
            <tr className={`${safeOrUnsafe}`}>
                {
                    headings.map( headingKey => {
                        return (
                            <Cell
                                content={rowObj[headingKey]}
                            />
                        );
                    } )
                }
            </tr>
        );
    } );

    return (
        <table className="Table">
            <thead>{thead}</thead>
            <tbody>{tbody}</tbody>
        </table>
    );
}

export default DataTable;