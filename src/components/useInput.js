import react from "react";


const UseInput = (arr)  => {
  return <>
    {arr.map((comment) => {
     /*  if (comment.user === appState.user.uid) {
        updateProfileImage(comment.id)
      } */
      console.log(comment)
      return <div className='post' key={comment.id}>
        <div className='postHeader'>
          <div className='title'>
            <h3>{comment.title}</h3>
            <p>{comment.comment}</p>
          </div>
        </div>
        <hr />

        <div className='postTextContainer'>
          <div className='av-info'>
            <img className='avatar' src={comment.image} alt="prs" />
            <strong>@{comment.name}</strong>
            <br />
            {/*  <p>{comment.created.toString() }</p>  */}
          </div>

          <div className='li-info'>
            {comment.like} : <i className="fa fa-thumbs-up"></i>
          </div>
        </div>

      </div>
    })}

  </>;
};

export default UseInput;