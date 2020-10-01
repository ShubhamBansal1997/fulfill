import React, {Component} from "react";
import Base from "../../layout/base";
import Button from "@material-ui/core/Button";
import {withRouter} from "react-router";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {Link} from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import CircularProgress from "@material-ui/core/CircularProgress";

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
            total: 0,
            ws: null
        }
    }

    componentDidMount() {
        this.connect();
    }


    connect = () => {
        let {progressId} = this.state
        let ws = new WebSocket(`${process.env.REACT_APP_WS_URL}/ws/progress/${progressId}/`);
        let that = this; // cache the this

        // websocket onopen event listener
        ws.onopen = () => {
            ws.send(JSON.stringify({'type': 'check_task_completion'}));
            that.setState({ws: ws});// clear Interval on on open of websocket connection
        }

        ws.onmessage = event => {
            let data;
            data = JSON.parse(event.data)
            let {percent, current, total} = data.progress
            this.setState({progress: parseInt(percent || 0), current: current || 0, total: total || 0})
        }
        ws.onerror = err => {
            console.log(err);
            ws.close();
        }
    }

    processingFile = () => (
        <Typography variant="h4" gutterBottom>
            Processing File <CircularProgress/>
        </Typography>
    )

    render() {
        let {progress, current, total} = this.state;
        return (
            <Base>
                {progress === 0 ? this.processingFile() : <Typography variant="h4" gutterBottom>
                    Products {progress !== 100 ? `Uploading ${current}/${total}` : `Uploaded 🎉🎉🎉`}
                </Typography>}
                <LinearProgressWithLabel value={progress}/>
                {progress === 100 ? <Button variant="contained" color="primary" component={Link} to="/">
                    Move to Products Page</Button> : null}
            </Base>
        )
    }
}

export default withRouter(ProgressBar);