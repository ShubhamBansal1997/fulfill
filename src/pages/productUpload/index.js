import React, {Component} from "react";
import Base from "../../layout/base";
import api from "../../utils/api";
import {Redirect, withRouter} from "react-router-dom";
import {DropzoneAreaBase} from "material-ui-dropzone";
import LinearProgress from "@material-ui/core/LinearProgress";


class ProductUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taskId: null,
            url: null,
            fileName: null,
            uploading: false
        }
        this.getUploadURL = this.getUploadURL.bind(this);
    }


    componentDidMount() {
        this.getUploadURL();
    }

    getUploadURL = () => {
        api
            .get('/api/file_upload/pre_signed_url')
            .then(res => {
                this.setState({url: res.url, fileName: res.file_name})
            })
            .catch(err => {
                console.log(err)
            })
    }

    onChangeHandler = (files) => {
        let {url, fileName} = this.state;
        const file = files[0]["file"];
        this.setState({uploading: true});
        api
            .put(url, file)
            .then(_ => {
                api
                    .post('/api/file_upload/start_task', {filename: fileName})
                    .then((res) => this.setState({'taskId': res.task_id}))
                    .catch(e => console.log(e))
            })
            .catch(e => console.log(e))
    }

    render() {
        let {taskId, uploading} = this.state;
        if (taskId) {
            return <Redirect to={`/progressbar/${taskId}`}/>
        } else {
            return <Base>
                {uploading ? <LinearProgress thickness={10}/> : null}
                {uploading ? null : <DropzoneAreaBase
                    filesLimit={1}
                    onAdd={this.onChangeHandler}
                    acceptedFiles={['.csv']}
                    maxFileSize={9999999999999}
                />}
            </Base>
        }
    }
}

export default withRouter(ProductUpload);