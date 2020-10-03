import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {fetchWebhooks, updateForm, updatePage} from "./actions";
import Base from "../../layout/base";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableCell from "@material-ui/core/TableCell";
import Paper from "@material-ui/core/Paper";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from '@material-ui/icons/Delete';
import TablePagination from "@material-ui/core/TablePagination";
import api from "../../utils/api";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Skeleton from "@material-ui/lab/Skeleton";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


const headCells = [
    {id: 'event', label: 'Event', align: 'center'},
    {id: 'target', label: 'Target', align: 'center'}
];

class Webhook extends Component {
    constructor(props) {
        super(props);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            'open': false,
            'notification': ''
        }
    }

    componentDidMount() {
        this.props.fetchWebhooks();
    }

    handleChangePage = (e, newPage) => {
        this.props.updatePage(newPage + 1);
    }
    addWebhook = () => {
        let {event, target} = this.props;
        api
            .post(`/api/webhook`, {event, target})
            .then(_ => {
                this.props.fetchWebhooks();
                this.setState({
                    ...this.state,
                    notification: 'Webhook Added Successfully',
                    open: true
                })
            })
            .catch(err => console.log(err))
    }
    deleteHook = (hookId) => {
        api
            .del(`/api/webhook/${hookId}`)
            .then(_ => {
                this.props.fetchWebhooks();
                this.setState({
                    ...this.state,
                    notification: 'Webhook Deleted Successfully',
                    open: true
                });
            })
            .catch(err => console.log(err))
    }

    loader = () => {
        return (
            [...Array(10).keys()].map(i => <TableRow key={i}>
                <TableCell><Skeleton animation="wave"/> </TableCell>
                <TableCell><Skeleton animation="wave"/></TableCell>
                <TableCell><Skeleton animation="wave"/></TableCell>
            </TableRow>)
        )
    }

    handleFieldChange = (e) => {
        this.props.updateForm(e.target.name, e.target.value)
    }

    handleClose() {
        this.setState({...this.state, open: false});
    }

    render() {
        let {webhooks, totalWebhooks, currentPage, loading, event, target} = this.props;
        let {handleChangePage, handleFieldChange, loader, handleClose, addWebhook} = this
        let {open, notification} = this.state
        return (
            <Base>
                <Grid container spacing={3}>
                    <Grid item xs={9}>
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {headCells.map((headCell) => (
                                            <TableCell
                                                key={headCell.id}
                                                align={headCell.align}
                                            >
                                                {headCell.label}
                                            </TableCell>
                                        ))}
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? loader() : webhooks.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell align="right">{row.event}</TableCell>
                                            <TableCell align="right">{row.target}</TableCell>
                                            <TableCell align="right">
                                                <IconButton aria-label="delete"
                                                            onClick={this.deleteHook.bind(this, row.id)}>
                                                    <DeleteIcon fontSize="small"/>
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[30]}
                            component="div"
                            count={totalWebhooks}
                            rowsPerPage={30}
                            page={currentPage - 1}
                            onChangePage={handleChangePage}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Grid item xs={12}>
                            Add New Webhook
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id="demo-simple-select-label">Event</InputLabel>
                            <Select
                                fullWidth
                                labelId="demo-simple-select-label"
                                id="event"
                                name="event"
                                value={event}
                                onChange={handleFieldChange}
                            >
                                <MenuItem value='product.added'>Product.Add</MenuItem>
                                <MenuItem value='product.updated'>Product.Edit</MenuItem>
                            </Select>
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="target"
                                label="Target"
                                name="target"
                                autoComplete="target"
                                value={target}
                                onChange={handleFieldChange}
                            />
                        </Grid>
                        <br/>
                        <br/>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={addWebhook}
                            color="primary">
                            Add Webhook
                        </Button>
                    </Grid>
                </Grid>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info">
                        {notification}
                    </Alert>
                </Snackbar>
            </Base>
        )
    }
}

const mapStateToProps = ({webhookReducer}) => {
    const {webhooks, totalWebhooks, currentPage, loading, event, target} = webhookReducer;
    return {webhooks, totalWebhooks, currentPage, loading, event, target};
}

Webhook.propTypes = {
    webhooks: PropTypes.array,
    totalWebhooks: PropTypes.number,
    currentPage: PropTypes.number,
    loading: PropTypes.bool,
    event: PropTypes.string,
    target: PropTypes.string
}

export default connect(mapStateToProps, {
    fetchWebhooks,
    updatePage,
    updateForm
})(Webhook)