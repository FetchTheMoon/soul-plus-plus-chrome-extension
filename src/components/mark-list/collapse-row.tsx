import { Button, Collapse, IconButton, Link, TableCell, TableRow } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import TimeAgo from '@/utilities/time-ago';
import MarkListManager, { IMarkedThreadInfo, OFFER_STAGE } from '@/controls/mark-list';
import React from 'react';
import CollapseSubTable from '@/components/mark-list/collapse-sub-table';

interface IRowProps {
    domain: string;
    markTime: number;
    row: IMarkedThreadInfo;
    open: boolean;
    handleClick: (i: number) => void;
}

export default function CollapseRow(props: IRowProps) {

    return (
        <>
            {/* 概览数据行(下面还有一个折叠的子表格行) */ }
            <TableRow
                sx={ { '& > *': { borderBottom: 'unset' } } }
            >
                {/* 是否有资源, 有则是+号, 没有则是-号 */ }
                <TableCell sx={ { width: '0.5em' } }>

                    <IconButton
                        size="small"
                        onClick={ () => props.handleClick(props.open ? 0 : props.markTime) }

                    >
                        {
                            (props.row.hyperlink.length + props.row.sell.length + props.row.magnet.length + props.row.miaochuan.length) === 0
                                ? <></>
                                : props.open
                                    ? <RemoveIcon/>
                                    : <AddIcon/>
                        }

                    </IconButton>
                </TableCell>

                {/* 标题 */ }
                <TableCell align="left" onClick={ () => props.handleClick(props.open ? 0 : props.markTime) } sx={ { cursor: 'pointer' } }>
                    <Link href={ props.row.url }
                          target={ '_blank' }
                          underline="none"
                    >
                        { props.row.title.slice(0, 20) }
                        { props.row.title.length > 20 ? '...' : '' }

                    </Link>
                </TableCell>

                {/* 页数 */ }
                <TableCell align={ 'center' }>{ `${ props.row.lastCheckPage ?? 0 }/${ props.row.maxPage }` }</TableCell>

                {/* 上次检查时间 */ }
                <TableCell>{ props.row.lastCheckTime ? TimeAgo(props.row.lastCheckTime) : '无' }</TableCell>

                {/* 悬赏状态 */ }
                <TableCell align={ 'center' }>
                    {
                        props.row.offerStage === OFFER_STAGE.OFFERING
                            ? `剩余 ${ props.row.offerRemainingHours } 小时`
                            : props.row.offerStage === OFFER_STAGE.FINISHED
                                ? <Link href={ props.row.url } target={ '_blank' } underline={ 'none' }><Button color={ 'success' }>{ '已结帖' }</Button></Link>
                                : props.row.offerStage === OFFER_STAGE.EXPIRED
                                    ? <Link href={ props.row.url } target={ '_blank' } underline={ 'none' }><Button color={ 'warning' }>{ '已过期' }</Button></Link>
                                    : props.row.offerStage
                    }
                </TableCell>

                {/* MARK时间 */ }
                <TableCell>{ TimeAgo(props.row.markTime) }</TableCell>

                {/* 删除按钮 */ }
                <TableCell>
                    <Button color={ 'error' } onClick={ () => {
                        if (confirm('确认要删除吗?')) MarkListManager.removeThreadMark(props.row.tid);
                    } }>删除</Button>
                </TableCell>
            </TableRow>


            {/* 这一行是用于显示具体有哪些资源的, 折叠的子表格 */ }
            <TableRow>
                <TableCell style={ { paddingBottom: 0, paddingTop: 0 } } colSpan={ 7 }>
                    <Collapse in={ props.open } timeout="auto" unmountOnExit>
                        <CollapseSubTable   { ...props }/>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}