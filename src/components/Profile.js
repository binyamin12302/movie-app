import React from 'react'

function Profile() {

    function handleChange(){

    }

    function handleClick(){

    }

    return (
        <div className='fields'>
            <input type="file" onChange={handleChange} />
            <button onClick={handleClick}>Upload</button>
        </div>
    )
}

export default Profile
