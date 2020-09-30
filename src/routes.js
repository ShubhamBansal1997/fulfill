import React from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import ProductUpload from "./pages/productUpload";
import ProgressBar from "./pages/progressBar";
import Product from "./pages/product";
import SingleProduct from "./pages/singleProduct";

const Routes = () => (
    <Router>
        <Switch>
            <Route exact path='/'><Product/></Route>
            <Route path='/progressbar/:progressId'><ProgressBar/></Route>
            <Route path='/product'><ProductUpload/></Route>
            <Route path='/singleproduct/:id?'><SingleProduct/></Route>
        </Switch>
    </Router>
)

export default Routes;