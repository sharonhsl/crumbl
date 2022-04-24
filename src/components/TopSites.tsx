import React, { useEffect, useState } from 'react';
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

            </tr>
        </thead>
    )
}

const RecSec = () => {
    return (
        <div>
            <div className='top-sites-recommendation-text'>
                <p>We recommend you install a general-purpose blocker to reduce your Internet footprint. Here’re some chrome extensions of non-profit blockers:</p>
            </div>
            <div className="top-sites-recommendation">
                <div className="blocker">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/UBlock_Origin.svg/1200px-UBlock_Origin.svg.png"
                        width={30}
                        height={30}
                        alt="ublock icon" />
                    <br></br>
                    <a href='https://ublock.org/'>ublock</a>
                </div>
                <div className="blocker">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/PrivacyBadgerLogo.svg/1200px-PrivacyBadgerLogo.svg.png"
                        width={40}
                        height={30}
                        alt="privacy badger icon" />
                    <br></br>
                    <a href='https://privacybadger.org/'>Privacy Badger</a>
                </div>
            </div>
        </div>
    )
}

interface TableRow {
    domain: string;
    count: number;
}

const TopSites = () => {
    const [table, setTable] = useState<TableRow[]>([]);

    const fetchTopSites = () => {
        //group top site
        chrome.cookies.getAll(
            {}, (cookies) => {
                const sites: { [key: string]: number; } = {};
                for (let i = 0; i < cookies.length; i++) {
                    if (sites[cookies[i].domain] === undefined) {
                        sites[cookies[i].domain] = 0;
                    }
                    sites[cookies[i].domain] += 1;
                }

                // get top 10 sites
                let top_sites = new Array();
                for (var [site, count] of Object.entries(sites)) {
                    top_sites.push({ domain: site, count: count });
                }
                top_sites.sort(function (a, b) { return b.count - a.count });
                let top_10 = top_sites.slice(0, 10);
                setTable(top_10);
            }
        );
    }

    useEffect(() => {
        fetchTopSites();
    }, []);


    if (table.length === 0) {
        return <RecSec />
    } else {
        return <>
            <table>
                <TableHeader />
                <tbody>
                    {table.map(((row, index) =>
                        <tr key={index}>
                            <td>{row.domain}</td>
                            <td>{row.count}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
            <RecSec />
        </>
    }
}



export default TopSites;
