import React, {Component} from "react";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {deleteAll, deleteProduct, fetchProducts, updateFilter, updateOrder, updatePage, updateSearch} from "./actions";
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
import EditIcon from '@material-ui/icons/Edit';
import TablePagination from "@material-ui/core/TablePagination";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import api from "../../utils/api";
import {Link} from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Skeleton from "@material-ui/lab/Skeleton";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";


const headCells = [
    {id: 'sku', label: 'Sku', align: 'right'},
    {id: 'name', label: 'Name', align: 'right'},
    {id: 'description', label: 'Description', align: 'left'},
];

class Product extends Component {
    constructor(props) {
        super(props);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.createSortHandler = this.createSortHandler.bind(this);
        this.deleteAll = this.deleteAll.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {
            'open': false,
            'notification': ''
        }
    }

    componentDidMount() {
        this.props.fetchProducts();
    }

    handleChangePage = (e, newPage) => {
        this.props.updatePage(newPage + 1);
    }
    createSortHandler = (orderCol) => {
        this.props.updateOrder(orderCol);
    }
    deleteAll = () => {
        this.props.deleteAll();
        this.setState({
            ...this.state,
            notification: 'All Products Deleted Successfully',
            open: true
        });
    }
    deleteProduct = (productId) => {
        api
            .del(`/api/product/${productId}`)
            .then(_ => {
                this.props.fetchProducts();
                this.setState({
                    ...this.state,
                    notification: 'Product Deleted Successfully',
                    open: true
                });
            })
            .catch(err => console.log(err))
    }
    handleChange = (e) => {
        this.props.updateSearch(e.target.value);
    }
    handleFilterChange = (e) => {
        this.props.updateFilter(e.target.name, e.target.value)
    }

    loader = () => {
        return (
            [...Array(10).keys()].map(i => <TableRow key={i}>
                <TableCell><Skeleton animation="wave"/> </TableCell>
                <TableCell><Skeleton animation="wave"/></TableCell>
                <TableCell><Skeleton animation="wave"/></TableCell>
                <TableCell><Skeleton animation="wave"/></TableCell>
            </TableRow>)
        )
    }

    handleClose() {
        this.setState({...this.state, open: false});
    }

    render() {
        let {products, currentPage, totalProducts, orderCol, orderType, search, sku, description, name, loading} = this.props;
        let {handleChangePage, deleteAll, handleFilterChange, loader, handleClose} = this
        let {open, notification} = this.state
        return (
            <Base>
                <Grid container spacing={3}>
                    <Grid item xs={9}>
                        <TextField
                            fullWidth
                            id="search"
                            label="Search"
                            name="search"
                            autoComplete="search"
                            value={search}
                            onChange={this.handleChange}
                        />
                        <TableContainer component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        {headCells.map((headCell) => (
                                            <TableCell
                                                key={headCell.id}
                                                align={headCell.align}
                                                sortDirection={orderCol === headCell.id ? orderType : false}
                                            >
                                                <TableSortLabel
                                                    active={orderCol === headCell.id}
                                                    direction={orderCol === headCell.id ? orderType : 'asc'}
                                                    onClick={this.createSortHandler.bind(this, headCell.id)}
                                                >
                                                    {headCell.label}
                                                </TableSortLabel>
                                            </TableCell>
                                        ))}
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? loader() : products.map((row) => (
                                        <TableRow key={row.sku}>
                                            <TableCell align="right">{row.sku}</TableCell>
                                            <TableCell align="right">{row.name}</TableCell>
                                            <TableCell align="left">{row.description}</TableCell>
                                            <TableCell align="right">
                                                <Link to={`/singleproduct/${row.id}`}>
                                                    <IconButton aria-label="edit">
                                                        <EditIcon fontSize="small"/>
                                                    </IconButton>
                                                </Link>
                                                <IconButton aria-label="delete"
                                                            onClick={this.deleteProduct.bind(this, row.id)}>
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
                            count={totalProducts}
                            rowsPerPage={30}
                            page={currentPage - 1}
                            onChangePage={handleChangePage}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Grid item xs={12}>
                            Filters
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="sku"
                                label="Product Sku"
                                name="sku"
                                autoComplete="sku"
                                value={sku}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="name"
                                label="Product Name"
                                name="name"
                                autoComplete="name"
                                value={name}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <br/>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                id="description"
                                label="Product Description"
                                name="description"
                                autoComplete="description"
                                value={description}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <br/>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={deleteAll}
                            color="primary">
                            Delete All Records
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

const mapStateToProps = ({productReducer}) => {
    const {products, totalProducts, currentPage, loading, sku, description, name, orderCol, orderType, search} = productReducer;
    return {products, totalProducts, currentPage, loading, sku, description, name, orderCol, orderType, search};
}

Product.propTypes = {
    products: PropTypes.array,
    totalProducts: PropTypes.number,
    currentPage: PropTypes.number,
    loading: PropTypes.bool,
    filterCol: PropTypes.string,
    filterVal: PropTypes.string,
    orderCol: PropTypes.string,
    orderType: PropTypes.string,
    search: PropTypes.string,
    sku: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string
}

export default connect(mapStateToProps, {
    fetchProducts,
    updateOrder,
    updatePage,
    deleteProduct,
    updateSearch,
    updateFilter,
    deleteAll
})(Product)