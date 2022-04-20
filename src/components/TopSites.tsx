import React from 'react';
import "./TopSites.css";

const TableHeader = () => {
    return (
        <thead>
            <tr>
                <th>
                    Domain
                </th>
                <th>
                    Count
                </th>
                <th>
                    Category
                </th>
            </tr>
        </thead>
    )
}

const RecSec =()=>{
    return(
        <div><p>We recommend you install a general-purpose blocker to reduce your Internet footprint. Here’re some chrome extensions of non-profit blockers:</p>
        <div >
            <div > </div>
            <div >
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/UBlock_Origin.svg/1200px-UBlock_Origin.svg.png" width={30} height={30} />
                <br></br>
                <a href ='https://ublock.org/'>ublock</a>
            </div>
            <div >
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/PrivacyBadgerLogo.svg/1200px-PrivacyBadgerLogo.svg.png" width={40} height={30} />
                <br></br>
                <a href ='https://privacybadger.org/'>Privacy bager</a>
            </div>
            <div > </div>
        </div>

    </div>
    )
}

const TopSites = () => {
    const mock = [
        { domain: "google.com", count: 523, category: "CDN" },
        { domain: "googletagmanger.com", count: 523, category: "Essential" }
    ];

    console.log(mock);

    return (<div>
        <TableHeader />
        <tbody>
            {mock.map(row =>
                <tr>
                    <td>{row.domain}</td>
                    <td>{row.count}</td>
                    <td>{row.category}</td>
                </tr>
            )}
        </tbody>
        <RecSec />
    </div>);
};

export default TopSites;
