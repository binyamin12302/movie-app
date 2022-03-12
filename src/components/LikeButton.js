import debounce from 'debounce';
import { collection, deleteDoc, doc, getDoc, increment, onSnapshot, query, setDoc, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { auth, db } from '../firebase/Firebase.js';
import StateContext from "../StateContext";

function Like({ like, id, commentId }) {
    const appState = useContext(StateContext);
    const [state, setState] = useImmer({
        colorLikeButton: "#636e72"
    });


    const handleLikeUser = debounce(async (commentId, e) => {
        const coRef = doc(db, id, commentId);
        const docRef = doc(db, `likeState-${id}`, `${auth.currentUser?.uid + commentId}`);

        const docSnap = await getDoc(docRef);

        const newDoc = (val) => {
            setDoc(docRef, {
                user: auth.currentUser?.uid,
                like: val,
                commentId,
            }, { merge: true });
        }



        const incrementLike = async () => {
            await updateDoc(coRef, {
                like: increment(1),
            });
        }


        const decrementlike = async () => {
            await updateDoc(coRef, {
                like: increment(-1),
            });
        }

        if (docSnap.exists()) {
            if (docSnap.data().like) {
                await deleteDoc(docRef);
                decrementlike();
                setState(draft => {
                    draft.colorLikeButton = "#636e72";
                });

            } else {
                newDoc(true);
                incrementLike();
                setState(draft => {
                    draft.colorLikeButton = "#0984e3";
                });
            }
        } else {
            // doc.data() will be undefined in this case
            newDoc(true);
            incrementLike();
        }

    }, 450);



    useEffect(() => {
        let active = true;

        const b = query(collection(db, `likeState-${id}`), where("user", "==", `${appState?.userUid}`),
            where("commentId", "==", `${commentId}`)
        )

        onSnapshot(b, (querySnapshot) => {
            querySnapshot.forEach((doc) => {

                if (active) setState(draft => {
                    draft.colorLikeButton = "#0984e3";
                });
            });

        });


        return () => {
            active = false
        }

    }, [id, appState?.userUid, setState, commentId])


    return (
        <>
            {like} : <i className="fa fa-thumbs-up" style={{
                color: `${state?.colorLikeButton}`
            }} onClick={(e) => {
                handleLikeUser(commentId, e)
            }} ></i>
        </>
    )
}

export default Like;