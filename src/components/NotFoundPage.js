import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
    return (
        <div className="text-center">
            <h2>Whoops, we cannot find that page.</h2>
            <p className="lead text-muted">
                You can always visit the <Link to="/">homepage</Link> to get a fresh start.
            </p>
        </div>
    )
}

export default NotFoundPage;