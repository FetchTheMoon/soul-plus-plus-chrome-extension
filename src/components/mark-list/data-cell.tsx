import { IPostInfo } from '@/controls/mark-list';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { Link, SvgIconTypeMap, TableCell } from '@mui/material';
import React from 'react';

export default function DataCell(props: { domain: string, data: IPostInfo, icon: OverridableComponent<SvgIconTypeMap> }) {
    return (
        <TableCell key={ props.data.pid } size={ 'small' } sx={ { width: '2em', borderBottom: 'unset', verticalAlign: 'middle' } }>
            <Link
                underline={ 'always' }
                href={ `https://${ props.domain }/read.php?tid=${ props.data.tid }&page=${ props.data.page }#${ props.data.pid }` }
                target={ '_blank' }
            >
                <props.icon/>
            </Link>
        </TableCell>
    );
}
