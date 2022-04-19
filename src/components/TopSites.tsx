import React from 'react';
import "./TopSites.css";


const TopSites = () => {
    const mock = [
        { domain: "google.com", count: 523, category: "CDN" },
        { domain: "googletagmanger.com", count: 523, category: "Essential" }
    ];

    console.log(mock);

    return <div className='top-sites'>
        <p>This is top sites</p>
    </div>;
};

export default TopSites;