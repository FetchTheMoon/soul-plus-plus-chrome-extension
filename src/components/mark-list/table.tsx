import React from 'react';
import {
    Box,
    Button,
    Collapse,
    IconButton,
    Link,
    List,
    ListSubheader,
    Paper,
    SvgIconTypeMap,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import MarkListManager, { IMarkedThreadInfo, IMarkList, OFFER_STAGE } from '@/controls/mark-list';
import { useRequest } from 'ahooks';
import TimeAgo from '@/utilities/time-ago';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import LanguageIcon from '@mui/icons-material/Language';

interface ITableProps {
    domain: string;
}

interface IRowProps {
    domain: string;
    key: number;
    row: IMarkedThreadInfo;
}

function ResourceCell(props: { icon: OverridableComponent<SvgIconTypeMap>, name: string, domain: string, resource: any[] }) {

    return (
        <List
            subheader={
                <ListSubheader component={ 'div' } sx={ {
                    background: 'transparent',
                } }>
                    { props.name }
                </ListSubheader>
            }
            sx={ {
                justifySelf: 'center',
            } }
        >

            { props.resource.map(v => {
                return (
                    <li key={ v.pid } style={ { display: 'flex', justifyContent: 'center' } }>
                        <Link
                            href={ `https://${ props.domain }/read.php?tid=${ v.tid }&page=${ v.page }#${ v.pid }` }
                            target={ '_blank' }
                            underline={ 'none' }
                        >
                            <Button>
                                <props.icon/>
                            </Button>
                        </Link>
                    </li>
                );
            }) }
        </List>
    );
}


function CollapseSubTable(props: IRowProps) {

    return (
        <Box sx={ { display: 'grid', gridTemplateColumns: '25% 25% 25% 25%' } }>
            <ResourceCell icon={ LocalOfferIcon } name={ '出售帖' } domain={ props.domain } resource={ props.row.sell }/>
            <ResourceCell icon={ FormatUnderlinedIcon } name={ '磁力' } domain={ props.domain } resource={ props.row.magnet }/>
            <ResourceCell icon={ FlashOnIcon } name={ '秒传' } domain={ props.domain } resource={ props.row.miaochuan }/>
            <ResourceCell icon={ LanguageIcon } name={ '超链接' } domain={ props.domain } resource={ props.row.hyperlink }/>
        </Box>
    );


}

function CollapseRow(props: IRowProps) {
    const [open, setOpen] = React.useState(false);
    return (
        <>
            <TableRow
                sx={ { '& > *': { borderBottom: 'unset' } } }
            >
                <TableCell sx={ { width: '0.5em' } }>
                    <IconButton
                        size="small"
                        onClick={ () => setOpen(!open) }

                    >
                        {
                            (props.row.hyperlink.length + props.row.sell.length + props.row.magnet.length + props.row.miaochuan.length) === 0
                                ? <></>
                                : open
                                    ? <RemoveIcon/>
                                    : <AddIcon/>
                        }

                    </IconButton>
                </TableCell>
                <TableCell align="left" onClick={ () => setOpen(!open) } sx={ { cursor: 'pointer' } }>
                    <Link href={ props.row.url }
                          target={ '_blank' }
                          underline="none"
                    >
                        { props.row.title.slice(0, 20) }
                        { props.row.title.length > 20 ? '...' : '' }

                    </Link>
                </TableCell>
                <TableCell align={ 'center' }>{ `${ props.row.lastCheckPage ?? 0 }/${ props.row.maxPage }` }</TableCell>
                <TableCell>{ props.row.lastCheckTime ? TimeAgo(props.row.lastCheckTime) : '无' }</TableCell>
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
                <TableCell>{ TimeAgo(props.row.markTime) }</TableCell>
                <TableCell>
                    <Button color={ 'error' } onClick={ () => {
                        if (confirm('确认要删除吗?')) MarkListManager.removeThreadMark(props.row.tid);
                    } }>删除</Button>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={ { paddingBottom: 0, paddingTop: 0 } } colSpan={ 7 }>
                    <Collapse in={ open } timeout="auto" unmountOnExit>
                        <CollapseSubTable   { ...props }/>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function (props: ITableProps) {
    const { data } = useRequest(MarkListManager.getMarkList, {
        initialData: {},
        pollingInterval: 1000,
    });
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
                            return <CollapseRow row={ v } key={ v.markTime } domain={ props.domain }/>;
                        }) }
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}