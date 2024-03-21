import { useEffect, useState } from "react";
import event from "../../../backend/src/models/event";
import { getEventCommentsCount } from "../common/requests";
import { Box } from "@mui/material";

export const CommentsCountBox : React.FC<{eventId: string}> = ({eventId}) => {
    const [commentsCount, setCommentsCount] = useState(0);
    const [loading, setLoading] =useState(true);
    const [error, setError] = useState(false);


    useEffect(() => {
        getEventCommentsCount(eventId).then((response) => {
        console.log(response);
        if (response?.status === 200){
        setCommentsCount(response.data);
        }
        }).then(() => {setLoading(false);}).catch((error) => {setError(error)});
    },[]);
        
    return (
        <Box>
            {loading ? "Loading..." : error ? "Error" : <h1> {`Number of comments: ${commentsCount}`}</h1>}
        </Box>
    );

}