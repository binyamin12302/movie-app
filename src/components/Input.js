import React, { useCallback, useContext } from 'react';
import DispatchContext from "../DispatchContext.js";
import StateContext from "../StateContext";


function Input({ type }) {
    const appDispatch = useContext(DispatchContext);
    const appState = useContext(StateContext);


    const handleInputChange = useCallback(
        e => {
            appDispatch({ type, value: e.target.value })
        },

        [appDispatch, type]
    );

    return (
        <input onChange={handleInputChange} value={appState.title} />
    )
}

export default Input;