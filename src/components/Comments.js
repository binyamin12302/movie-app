import {
    addDoc, collection, deleteDoc, doc, increment, onSnapshot, orderBy, query, where
} from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useImmer } from "use-immer";
import { auth, db } from "../firebase/Firebase";
import StateContext from "../StateContext";
import Like from './LikeButton.js';

function Comments({ id }) {
    const appState = useContext(StateContext);

    const [state, setState] = useImmer({
        title: "",
        text: "",
        reviews: []
    });


    const createComment = async () => {
        const commentsCollectionRef = collection(db, id)


        if (state.title === "" || state.text === "")
            return appState.notification("A required field is missing.", `${toast.TYPE.ERROR}`)

        if (state.text.replace(/\s/g, '').length < 100)
            return appState.notification("Sorry, your review is too short. It needs to contain at least 100 characters.",
                `${toast.TYPE.ERROR}`)

        try {
            toast.dismiss()
            setState(draft => {
                draft.title = "";
                draft.text = ""
            });

            await addDoc(commentsCollectionRef, {
                user: auth.currentUser?.uid,
                email: auth.currentUser?.email,
                title: state.title,
                comment: state.text,
                name: auth.currentUser?.displayName !== "" ? auth.currentUser?.displayName : null,
                like: increment(0),
                timestamp: new Date()
            });

        } catch (error) {
            console.log(error)
        }

    }



    useEffect(() => {
        let active = true
        const q = query(collection(db, id), orderBy("timestamp", "desc"));


        onSnapshot(q, (querySnapshot) => {
            const docs = [];

            querySnapshot.forEach((doc) => {
                docs.push({ ...doc.data(), id: doc.id });
            });

            if (active) setState(draft => { draft.reviews = docs; });
        });


        return () => {
            active = false
        }
    }, [id, setState])


    async function deletePost(commentId) {
        const q = query(collection(db, `likeState-${id}`), where("commentId", "==", `${commentId}`));
        try {
            let confirm = window.confirm("Are you sure you want to delete your review?");
            if (confirm) {
                await deleteDoc(doc(db, `${id}`, commentId))
                onSnapshot(q, (querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        deleteEachLikeState({ ...doc.data() }.commentId, { ...doc.data() }.user)
                    });
                });
            }

            const deleteEachLikeState = async (commentId, user) => {
                await deleteDoc(doc(db, `likeState-${id}`, `${user + commentId}`));
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div className="comments">
            <div className='feedbacks'>
                <h1 className='tc'>Reviews <i className="far fa-sticky-note"></i></h1>
                <div className='reviews' >
                    {state.reviews?.map((comment) => {
                        console.log(comment)
                        return <div className="post" key={comment.id}>
                            <div className='postHeader'>
                                <div className='postTitle'>
                                    <h4>{comment.title}</h4>
                                    {appState.loggedIn && comment.user === auth.currentUser.uid && (
                                        <button className="fas fa-trash-alt" onClick={() => {
                                            deletePost(comment.id);
                                        }}></button>
                                    )}
                                </div>
                                <p>{comment.comment}</p>
                            </div>
                            <hr />
                            <div className='postTextContainer'>
                                <div className='av-info'>
                                    <p><span>Reviewed by </span> {`${comment.name || 'anonymous'}`}</p>
                                </div>
                                <div className='li-info'>
                                    <Like id={id} commentId={comment.id} like={comment.like} />
                                </div>
                            </div>
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
                        <textarea value={state.text} placeholder="Comment..." onChange={(e) => {
                            setState(draft => {
                                draft.text = e.target.value;
                                draft.minLength = e.target.minLength;
                            });
                        }} />
                    </div>
                    <button className='btn' onClick={createComment}> Submit Comment</button>
                </div>
            </div>
        </div>
    )
}

export default Comments;
