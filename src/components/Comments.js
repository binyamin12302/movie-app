import { getAuth } from 'firebase/auth';
import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import { db } from "../firebase/Firebase";
import StateContext from "../StateContext";

function Comments({ id }) {
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);

    const [state, setState] = useImmer({
        title: "",
        commentText: "",
        commentList: [],
        idComment: "",
        arr: [],
        idUser: ""
    });

    const commentsCollectionRef = collection(db, `${id}`)

    const createComment = async () => {
        try {
            appDispatch({ type: "notificationLoading" })
            await addDoc(commentsCollectionRef, {
                user: appState.user.uid,
                title: state.title,
                comment: state.commentText,
                image: appState.user.profileImage,
                name: appState.user.name
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


    useEffect(() => {

        let active = true;

        const getComments = async () => {
            const data = await getDocs(commentsCollectionRef);
            const allComments = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            if (active) {
                setState(draft => {
                    draft.commentList = allComments
                });
            }
        }

        getComments()

        return () => {
            active = false;
        };


    }, [commentsCollectionRef, setState, id,])


    async function updateProfileImage(commentId) {
        const auth = getAuth();

        const washingtonRef = doc(db, `${id}`, `${commentId}`);
        try {
            await updateDoc(washingtonRef, {
                image: appState.user.profileImage,
                name: auth.currentUser?.displayName
            });

        } catch (error) {
            console.log(error)
        }
    }



    return (
        <div className="comments">
            <div className='feedbacks'>
                <h1 className='tc'>Reviews <i className="far fa-sticky-note"></i></h1>
                <div className='reviews' >
                    {state.commentList.map((comment) => {

                        if (comment.user === appState.user.uid) {
                            updateProfileImage(comment.id)
                        }

                        return <div className='post' key={comment.id}>
                            <div className='postHeader'>
                                <div className='title'>
                                    <h1 className="section-title">{comment.title}</h1>
                                    <p>{comment.comment}</p>
                                </div>
                            </div>
                            {<img src={comment.image} alt="prs" />}
                            <div className='postTextContainer'></div>
                            <h4>@{comment.name}</h4>
                        </div>
                    })}
                </div>
            </div>

            <div className="create-comment">
                <h1 className='tc'>Leave a review <i className="far fa-comment"></i></h1>
                <div className="comment-container">
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
