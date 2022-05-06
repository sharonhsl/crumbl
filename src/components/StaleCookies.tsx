import React, { useEffect, useState } from 'react';
import "./StaleCookies.css";

function StaleCookies() {

    const [count, setCount] = useState("...");
    const [count2, setCount2] = useState("...");
    const [count3, setCount3] = useState("...");
    const [count4, setCount4] = useState("...");
    const [count5, setCount5] = useState("...");
    const [count6, setCount6] = useState("...");
    var info;
    var expiring_length_30days = 0;
    var expiring_length_oneyear = 0;
    var expiring_length_1000 = 0;
    var expiring_length_20yrs = 0;
    var total_count = 0;
    var total_time = 0;
    var days = new Array();

    const updateJarCount = () => chrome.cookies.getAll({}, (cookies) => {
        cookies.forEach((cookie) => {
            if (cookie.expirationDate) {
                var cookieExpireTime = new Date(cookie.expirationDate * 1000).valueOf()
                var currentTime = Date.now()
                var timeperiodDays = (cookieExpireTime - currentTime) / 86400000
                if (timeperiodDays < 30) {
                    expiring_length_30days += 1
                }
                if (timeperiodDays < 365) {
                    expiring_length_oneyear += 1
                }
                if (timeperiodDays > 365 * 5) {
                    expiring_length_1000 += 1
                }
                if (timeperiodDays > 365 * 20) {
                    expiring_length_20yrs += 1
                }
                if (timeperiodDays < 365 * 1000) {
                    total_count += 1
                    total_time += Math.trunc(timeperiodDays)
                    days.push(timeperiodDays)
                }
            }
        })
        days.sort(function (a, b) { return a - b });
        console.log(days)
        console.log(Math.trunc(days.length/2))
        var median = days[Math.trunc(days.length/2)]
        var expiring_length_avg = Math.trunc(total_time/total_count)

        setCount(expiring_length_30days.toString())
        setCount2(expiring_length_oneyear.toString())
        setCount3(expiring_length_1000.toString())
        setCount4(expiring_length_avg.toString())
        setCount5(expiring_length_20yrs.toString())
        setCount6(median.toString())
    });

    useEffect(() => {
        updateJarCount();
    }, []);

    const Notification1 = () => {
        return (
            <div className='text'>
                <p>In your cookie jar, you have {count} cookies that will expire in the next month, {count2} in the next year.</p>
                <p>There are {count3} cookies will last for more than <b>5 years</b>, {count5} cookies more than <b>20 years</b>.</p>
                <p>Here're the 10 longest living cookies in your jar: </p >
            </div>
        )
    }


    const Notification2 = () => {
        const avg = parseInt(count4)
        const median = parseInt(count6)
        if (avg < 218 && median < 68) {
            info = "your cookies are below the standard."
        } else if (avg < 218 && median >= 68) {
            info = "there are more long living cookies in your browser."
        } else if (avg >= 218 && median < 68) {
            info = "there are more cookies that has extremely long lifespan."
        } else {
            info = "your cookies are above the standard."
        }

        return (
            <div className="text">
           <p>The average lifetime of your cookies is {avg} days, the median lifetime is {median} days.</p>
                <p>According to the previous study result (Miller & Skiera, 2017) with 218 days average and 68 days median, {info}</p>
                <p> <br></br>
                    Manage your <a href="https://support.google.com/chrome/answer/95647?hl=en&co=GENIE.Platform%3DDesktop" target="_blank">cookies on chrome browser</a>.</p>

            </div>
        )
    }

    const TableHeader = () => {
        return (
            <thead>
                <tr>
                    <th>
                        Domain
                    </th>
                    <th>
                        Expiration Time
                    </th>
                </tr>
            </thead>
        )
    }
    interface TableRow {
        domain: string;
        expirationTime_number: number;
        expirationTime_string: string;
    }

    const TopSites = () => {
        // console.log("a"+chrome.cookies.set.length)
        let top_sites = new Array();
        let top_10 = new Array();
        const [table, setTable] = useState<TableRow[]>([]);
        const fetchTopSites = () => {
            chrome.cookies.getAll(
                {}, (cookies) => {
                    const sites: { [key: string]: number; } = {};
                    cookies.forEach((cookie) => {
                        if (cookie.expirationDate) {
                            sites[cookie.domain] = cookie.expirationDate;
                        }
                    })
                    
                    for (var [site, expire_time] of Object.entries(sites)) {
                        var date = new Date(expire_time * 1000).toDateString()
                        if (new Date(expire_time * 1000).getFullYear() < 9999) {
                            top_sites.push({ domain: site, expirationTime_number: Math.trunc(expire_time * 1000), expirationTime_string: date });
                        }
                    }
                    top_sites.sort(function (a, b) { return b.expirationTime_number - a.expirationTime_number });
                    top_10 = top_sites.slice(0, 10);
                    setTable(top_10);
                }
            );
        }

        useEffect(() => {
            fetchTopSites();
        }, []);

        return <>
            <table>
                <TableHeader />
                <tbody>
                    {table.map(((row, index) =>
                        <tr key={index}>
                            <td>{row.domain}</td>
                            <td>{row.expirationTime_string}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </>
    }

    return (<div>
        <Notification1 />
        <TopSites />
        <Notification2 />

        {/* <Button text="Delete cookies!" onClick={(event: React.MouseEvent<HTMLElement>) => {
            var count = 0
            event.preventDefault()
            chrome.cookies.getAll({}, (cookies) => {
                cookies.forEach((cookie) => {
                    // console.info(cookie)
                    if (cookie.expirationDate) {
                        const cookieExpireTime = new Date(cookie.expirationDate * 1000).valueOf()
                        console.log("expire "+cookieExpireTime)
                        const currentTime = Date.now()
                        console.log("now "+currentTime)
                        const timeperiodDays = (cookieExpireTime - currentTime) / 86400000
                        console.log("period "+timeperiodDays.toString())
                        // seconds for 30 days
                        if (timeperiodDays < 4) {
                          chrome.cookies.remove({ name: cookie.name, url: cookie.domain })
                          count += 1
                          console.log("add")
                        }
                          
                    }
                    
                })
            alert("You have deleted "+count+" stale cookies!")
            })
            console.log(chrome.cookies.set.length)
            
            
        }}></Button> */}
    </div>);
}

export default StaleCookies;