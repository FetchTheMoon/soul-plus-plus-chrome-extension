import React, { useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import MarkListManager, { IMarkList } from '@/controls/mark-list';
import { useRequest } from 'ahooks';
import CollapseRow from '@/components/mark-list/collapse-row';

interface ITableProps {
    domain: string;
}


export default function (props: ITableProps) {
    const { data } = useRequest(MarkListManager.getMarkList, {
        initialData: {},
        pollingInterval: 1000,
    });

    // 手风琴互斥, 一次只能开一个
    const [expandedId, setExpandedId] = useState(0);
    const handleClick = (i: number) => setExpandedId(i);


    if (!data) return <></>;
    return (
        <Paper sx={ { width: '100%', overflow: 'hidden' } }>
            <TableContainer component={ Paper }>
                <Table
                    sx={ {
                        minWidth: 650,
                        borderRadius: 0,
                    } }
                    size={ 'small' }
                    stickyHeader
                >
                    <TableHead>
                        <TableRow>
                            <TableCell> </TableCell>
                            <TableCell>标题</TableCell>
                            <TableCell align={ 'center' }>页数</TableCell>
                            <TableCell>上次检查</TableCell>
                            <TableCell align={ 'center' }>悬赏状态</TableCell>
                            <TableCell>MARK时间</TableCell>
                            <TableCell> </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { Object.values(data as IMarkList).reverse().map((v, i) => {
                            return <CollapseRow
                                open={ expandedId === v.markTime }
                                row={ v }
                                key={ v.markTime }
                                markTime={ v.markTime }
                                domain={ props.domain }
                                handleClick={ handleClick }
                            />;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}