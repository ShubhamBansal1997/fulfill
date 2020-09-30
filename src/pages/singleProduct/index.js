import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import {makeStyles, withStyles} from '@material-ui/core/styles';
import {withRouter} from "react-router-dom";
import MuiAlert from '@material-ui/lab/Alert';
import Base from "../../layout/base";
import api from "../../utils/api";
import Snackbar from "@material-ui/core/Snackbar";


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class SingleProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            'id': '',
            'sku': '',
            'name': '',
            'description': '',
            'notification': '',
            'open': false,
            'edit': false

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.addEditProduct = this.addEditProduct.bind(this);
    }

    componentDidMount() {
        let {id} = this.props.match.params;
        if (id) {
            api
                .get(`/api/product/${id}`)
                .then((response) => {
                    let {sku, name, description} = response;
                    this.setState({
                        ...this.state,
                        id: id,
                        sku: sku,
                        description: description,
                        name: name,
                        edit: true
                    });
                })
                .catch(_ => {
                    this.setState({
                        ...this.state,
                        id: id,
                        notification: 'Unable to fetch Product details',
                        open: true
                    });
                })
        }
    }

    handleChange(e) {
        let state = {};
        state[e.target.name] = e.target.value;
        this.setState(state);
    }

    addEditProduct(e) {
        e.preventDefault();
        let {sku, name, description, edit, id} = this.state;
        if (edit) {
            api
                .put(`/api/product/${id}`, {sku, name, description})
                .then(_ => {
                    this.setState({
                        ...this.state,
                        notification: 'Product Updated Successfully',
                        open: true
                    });
                })
                .catch(_ => {
                    this.setState({
                        ...this.state,
                        notification: 'Product Not Updated Successfully',
                        open: true
                    })
                })
        } else {
            api
                .post('/api/product', {sku, name, description})
                .then(_ => {
                    this.setState({
                        ...this.state,
                        sku: '',
                        description: '',
                        name: '',
                        notification: 'Product Added Successfully',
                        open: true
                    });
                })
                .catch(_ => {
                    this.setState({
                        ...this.state,
                        notification: 'Product Not Added Successfully',
                        open: true
                    });
                })
        }
    }

    handleClose() {
        this.setState({...this.state, open: false});
    }

    render() {
        let {classes} = this.props;
        let {sku, name, description, notification, open, edit} = this.state;
        let {handleChange, handleClose, addEditProduct} = this;
        return (
            <Base component="main" maxWidth="xs">
                <CssBaseline/>
                <div className={classes.paper}>
                    <form className={classes.form} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="sku"
                                    label="Product Sku"
                                    name="sku"
                                    autoComplete="sku"
                                    value={sku}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Product Name"
                                    name="name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="description"
                                    label="Product Description"
                                    name="description"
                                    autoComplete="description"
                                    value={description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={addEditProduct}
                            >
                                {edit ? 'Edit Product' : 'Add Product'}
                            </Button>
                        </Grid>
                    </form>
                </div>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info">
                        {notification}
                    </Alert>
                </Snackbar>
            </Base>
        )
    }
}

export default withRouter(withStyles(useStyles)(SingleProduct));