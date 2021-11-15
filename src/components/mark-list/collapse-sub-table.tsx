import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import LanguageIcon from '@mui/icons-material/Language';
import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { IMarkedThreadInfo } from '@/controls/mark-list';
import DataCell from '@/components/mark-list/data-cell';

interface IRowProps {
    domain: string;
    markTime: number;
    row: IMarkedThreadInfo;
    open: boolean;
    handleClick: (i: number) => void;
}

export default function CollapseSubTable(props: IRowProps) {
    const resource = [
        {
            icon: LocalOfferIcon,
            name: '出售贴',
            data: props.row.sell,
        },
        {
            icon: FormatUnderlinedIcon,
            name: '磁力',
            data: props.row.magnet,
        },
        {
            icon: FlashOnIcon,
            name: '秒传',
            data: props.row.miaochuan,
        },
        {
            icon: LanguageIcon,
            name: '超链接',
            data: props.row.hyperlink,
        },
    ];
    return (

        <Table sx={ { width: 'auto' } }>
            <TableBody>
                {
                    resource.map(r => {
                        return (
                            // 没有数据的行就不显示了
                            r.data.length
                                ? <TableRow key={ r.name }>

                                    {/* 注意这里是表格作表头, variant='head', 意味着表头在行的最左边, 表项在表头右边 */ }
                                    <TableCell variant={ 'head' } sx={ { fontSize: '0.9em', width: '5em', borderBottom: 'unset' } } align={ 'right' } size="small">
                                        { r.name }
                                    </TableCell>

                                    {/* 带链接的图标, 在上面的表头后面从左往右依次排列 */ }
                                    {
                                        r.data.map((v, i) => {
                                            return <DataCell key={ v.pid } domain={ props.domain } data={ v } icon={ r.icon }/>;
                                        })
                                    }
                                </TableRow>
                                : <React.Fragment key={ r.name }/>
                        );
                    }) }
            </TableBody>
        </Table>

    );


}