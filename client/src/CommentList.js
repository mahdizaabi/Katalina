import React, { useState } from 'react';
export default ({ comments }) => {

    //previously, we passed the id of the post so we can fetch all the comments that belongs to that post

    /*const [comments, setComment] = useState([])*/
       /* const fetchData = async () => {
    
        const res = await axios.get(`http://localhost:5000/posts/${postId}/comments`)
        setComment(res.data);
    }

    useEffect(() => {
        fetchData();
    }, [])*/

  const renderCommentsList = comments.map(comment => {
      const color = comment.status === 'pending' ? 'orange' : 'rejected' ? 'red' : 'green';
      if(comment.status === "approved")
        return (
            <li key={comment.id}>{comment.content} </li>
        )
        return(
            <li style={{color}} key={comment.id}>{comment.status} </li>
        )
    })
    return (
        <div>
            <ul>
                {renderCommentsList}
            </ul>
        </div>
    )
};
