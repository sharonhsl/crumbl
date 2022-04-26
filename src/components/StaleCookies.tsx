import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import Button from './Button';
import "./StaleCookies.css";



function StaleCookies() {
    
    const [count, setCount] = useState("...");
    const [count2, setCount2] = useState("...");
    const [count3, setCount3] = useState("...");
    const [count4, setCount4] = useState("...");
    const updateJarCount = debounce(() => chrome.cookies.getAll({}, (cookies) => {
        var expiring_length_30days = 0;
        var expiring_length_oneyear = 0;
        var expiring_length_1000 = 0;
        var total_count = 0;
        var total_time = 0;
        cookies.forEach((cookie) => {
            if (cookie.expirationDate) {
                const cookieExpireTime = new Date(cookie.expirationDate * 1000).valueOf()
                const currentTime = Date.now()
                const timeperiodDays = (cookieExpireTime - currentTime) / 86400000
                if (timeperiodDays < 30) {
                    expiring_length_30days += 1
                }
                if (timeperiodDays < 365) {
                    expiring_length_oneyear += 1
                }
                if (timeperiodDays > 365*5) {
                    expiring_length_1000 += 1
                }
                total_count += 1
                total_time += cookie.expirationDate.valueOf()
            }
            
        })
        var expiring_length_avg = new Date((total_time/total_count)*1000).toDateString()
        console.log(expiring_length_avg)
        setCount(expiring_length_30days.toString())
        setCount2(expiring_length_oneyear.toString())
        setCount3(expiring_length_1000.toString())
        setCount4(expiring_length_avg.toString())
        
    }), 1000);

    useEffect(() => {
        updateJarCount();
        chrome.cookies.onChanged.addListener(updateJarCount);
    }, [updateJarCount]);

    const Notification1 = () => {
        return (
            <div className='text'>
                <p>You have {count} cookies that will expire in the next month.</p>
                <p>You have {count2} cookies that will expire in the next year.</p>
                <p>You have {count3} cookies that will <b>NOT</b> expire in the next five years.</p>
                <p>Here're the 10 closest expiring cookies in your jar: </p >
            </div>
        )
    }
    

    const Notification2 = () => {
        return (
            <div className='text'>
                <p>The average time of your cookie expiration date is {count4}.</p>
                <p>We recommend you delete stale cookies regularly. Regular deletion keeps your web browswer safer and quicker.</p >
                <p>Click to delete all the cookies that will expire in the next 30 days:</p >
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
        expirationTime: number;
    }
    
    const TopSites = () => {
        const [table, setTable] = useState<TableRow[]>([]);
    
        const fetchTopSites = () => {
            //group top site
            chrome.cookies.getAll(
                {}, (cookies) => {
                    const sites: { [key: string]: number; } = {};
                    cookies.forEach((cookie) => {
                        if (cookie.expirationDate) {
                            sites[cookie.domain] = cookie.expirationDate;
                        }
                    })
                    let top_sites = new Array();
                    for (var [site, exprire_time] of Object.entries(sites)) {
                        var date = new Date(exprire_time * 1000).toDateString()
                        top_sites.push({ domain: site, expirationTime: date });
                    }
                    top_sites.sort(function (a, b) { return a.expirationTime - b.expprationTime }).slice(0,10);
                    let top_10 = top_sites.slice(0, 10);
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
                            <td>{row.expirationTime}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        </>
    }
    
    
  
    

    return (<div>
        <Notification1 />
        <TopSites/>
        <Notification2 />


        <Button text="Delete cookies!" onClick={(event: React.MouseEvent<HTMLElement>) => {
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
                        if (timeperiodDays < 2) {
                          chrome.cookies.remove({ name: cookie.name, url: cookie.domain })
                        //   console.log("deleted")
                          count += 1
                          console.log("add")
                        }
                          
                    }
                    
                })
            alert("You have deleted "+count+" stale cookies!")
            })
            
            
        }}></Button>
    </div>);
}






export default StaleCookies;