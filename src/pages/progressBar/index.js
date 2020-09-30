import React, {Component} from "react";
import Base from "../../layout/base";
import Button from "@material-ui/core/Button";
import api from "../../utils/api";
import {withRouter} from "react-router";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}


class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progressId: this.props.match.params.progressId,
            progress: 0,
            current: 0,
            total: 0
        }
    }

    componentDidMount() {
        let taskStatus = setInterval(() => {
            if (this.state.progress < 100) {
                this.fetchData();
            } else {
                clearInterval(taskStatus);
            }
        }, 1000)
    }

    fetchData() {
        api
            .get(`/celery-progress/${this.state.progressId}`)
            .then((response) => {
                let {percent, current, total} = response.progress
                this.setState({progress: parseInt(percent), current: current, total: total})
            })
            .catch((err) => {
                console.log(err);
            })
    }

    render() {
        let {progress, current, total} = this.state;
        return (
            <Base>
                <Typography variant="h4" gutterBottom>
                    Products {progress !== 100 ? `Uploading ${current}/${total}` : `Uploaded 🎉🎉🎉`}
                </Typography>
                <LinearProgressWithLabel value={progress}/>
                {progress === 100 ? <Button variant="contained" color="primary" component={Link} to="/">
                    Move to Products Page</Button> : null}
            </Base>
        )
    }
}

export default withRouter(ProgressBar);