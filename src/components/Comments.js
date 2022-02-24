import { addDoc, collection, deleteDoc, doc, increment, onSnapshot, query, updateDoc } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useImmer } from "use-immer";
import DispatchContext from "../DispatchContext.js";
import { auth, db } from "../firebase/Firebase";
import StateContext from "../StateContext";


function Comments({ id }) {
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);

    const [state, setState] = useImmer({
        title: "",
        text: "",
        reviews: [],
        deleted: false,
        commentLike: null
    });



    const createComment = async () => {


        const commentsCollectionRef = collection(db, id)

        if (state.title === "" || state.text === "") return appDispatch({
            type: "notificationError",
            value: "A required field is missing."
        });

        if (state.text.replace(/\s/g, '').length < 100) return appDispatch({
            type: "notificationError",
            value: "Sorry, your review is too short. It needs to contain at least 100 characters."
        });


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
                like: 0,
                timestamp: new Date()
            });


        } catch (error) {
            console.log(error)
        }

    }


    useEffect(() => {
        let active = true
        const q = query(collection(db, id));

        onSnapshot(q, (querySnapshot) => {
            const cities = [];

            querySnapshot.forEach((doc) => {
                cities.unshift({ ...doc.data(), id: doc.id });
            });

            if (active) {
                setState(draft => {
                    draft.reviews = cities;
                });
            }

        });

        return () => {
            active = false
        }

    }, [id, setState])



    async function deletePost(idUs) {
        try {
            let confirm = window.confirm("Are you sure you want to delete your review?");
            if (confirm === true) await deleteDoc(doc(db, `${id}`, idUs));
        } catch (error) {
            console.log(error)
        }

    }


    async function handleLike(commentId) {
        const washingtonRef = doc(db, id, commentId);
        try {
            setState(draft => {
                draft.commentLike = !state.commentLike;
            });

            if (state.commentLike) {
                await updateDoc(washingtonRef, {
                    like: increment(-1)
                })
            } else {
                await updateDoc(washingtonRef, {
                    like: increment(1)
                })
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
                                    <p><span>Reviewed by </span> {`${comment.name || comment.email}`}</p>
                                </div>
                                <div className='li-info'>
                                    {comment.like} : <i className="fa fa-thumbs-up" onClick={() => {
                                        handleLike(comment.id)
                                    }}></i>
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

export default Comments
