import { addDoc, collection, getDocs } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import { auth, db } from "../firebase/Firebase";

function Comments({ id }) {
    const appDispatch = useContext(DispatchContext);

    const [state, setState] = useImmer({
        title: "",
        commentText: "",
        commentList: []
    });

    const commentsCollectionRef = collection(db, `${id}`)

    const createComment = async () => {

        appDispatch({ type: "notificationLoading" })
        try {

            await addDoc(commentsCollectionRef, {
                title: state.title,
                comment: state.commentText,
                author: { name: auth.currentUser.displayName, id: auth.currentUser.uid, image: auth.currentUser.photoURL },
            });

            setState(draft => {
                draft.commentText = "";
                draft.title = "";
            });

            appDispatch({ type: "notificationResult", value: "You have successfully submitted the comment.", typeMessage: `${toast.TYPE.SUCCESS}`, autoClose: 3000 })

        } catch (error) {
            console.log(error)
            appDispatch({ type: "notificationResult", value: error.message.split(':')[1], typeMessage: `${toast.TYPE.ERROR}` })
        }

    }


    console.log(auth);

    useEffect(() => {
        const getComments = async () => {
            const data = await getDocs(commentsCollectionRef);
            const allComments = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            setState(draft => {
                draft.commentList = allComments
            });
        }
        getComments();
    }, [commentsCollectionRef, setState])

    return (
        <div className="comments">
            <div className='feedbacks'>
                <h1 className='tc'>Feedbacks</h1>
                {state.commentList.map((comment) => {
                    return <div className='post'>
                        <div className='postHeader'>
                            <div className='title'>
                                <h1 className="section-title">{comment.title}</h1>
                                <p>{comment.comment}</p>
                            </div>
                        </div>
                        <div className='postTextContainer'></div>
                        <h4>@{comment.author.name}</h4>
                    </div>
                })}
            </div>

            <div className="create-comment">
                <div className="comment-container">
                    <h1 className='tc'>Leave a review <i class="far fa-comment"></i></h1>
                    <div className="inputGp">
                        <label>Title:</label>
                        <input value={state.title} placeholder="Title..." onChange={(e) => {
                            setState(draft => {
                                draft.title = e.target.value;
                            });
                        }} />
                    </div>

                    <div className="inputGp">
                        <label> Review:</label>
                        <textarea value={state.commentText} placeholder="Comment..." onChange={(e) => {
                            setState(draft => {
                                draft.commentText = e.target.value;
                            });
                        }} />
                    </div>
                    <button className='btn' onClick={createComment}> Submit Comment</button>
                </div>
            </div>
        </div>
    )
}

export default Comments
