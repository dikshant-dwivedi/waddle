import React from 'react'
import Alert from '@material-ui/lab/Alert';

export default function ErrorNotice(props) {
    return (
        <div style = {{position: "absolute", bottom: "30px",width: "380px"}}>
            <Alert
            onClose={() => {props.clearError() }}
            severity="error">{props.message}</Alert>
        </div>
    )
}
