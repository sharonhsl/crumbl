import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import Button from './Button';
import "./StaleCookies.css";



function StaleCookies() {
    const Notification1 = () => {
        // let count = 0;
        // chrome.cookies.getAll(
        //     {}, (cookies) => {
        //         return cookies.length;
        // });
        const [count, setCount] = useState("...");
        
        const updateJarCount = debounce(() => chrome.cookies.getAll({}, (cookies) => {
            var expiring_length = 0;
            cookies.forEach((cookie) => {
                
                // console.info(cookie)
                if (cookie.expirationDate) {
                    const cookieExpireTime = new Date(cookie.expirationDate * 1000).valueOf()
                    const currentTime = Date.now()
                    const timeperiodDays = (cookieExpireTime - currentTime) / 86400000
                    // seconds for 30 days
                    if (timeperiodDays < 30) {
                    //   chrome.cookies.remove({ name: cookie.name, url: cookie.domain })
                    //   console.log("deleted")
                      expiring_length += 1
                    }
                }    
            })
            setCount(expiring_length.toString())
        }), 1000);

        useEffect(() => {
            updateJarCount();
            chrome.cookies.onChanged.addListener(updateJarCount);
        }, [updateJarCount]);

        return (
            <div className='text'>
                <p>You have {count} cookies that will expire in the next 30 days.</p >
                <p>Here're the 3 closest expiring cookies in your jar: </p >
            </div>
        )
    }

    const Notification2 = () => {
        return (
            <div className='text'>
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

    const mock = [
        { domain: "google.com", expiration_time: "Wednesday, 25 April 2022" },
        { domain: "facebook.com", expiration_time: "Saturday, 30 April 2022" },
        { domain: "microsoft.com", expiration_time: "Thursday, 5 May 2022" },
        { domain: "...", expiration_time: "..." }
    ];

    console.log(mock);

    const BarGraph = () => {
        return (
            <div>
                {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
        <body>

        <canvas id="myChart" className='canvas'></canvas>

        <script>
        var xValues = ["Nov2019", "","","","","","","","","Today"];
        var yValues = [55, 49, 44, 24, 15, 46, 87, 23, 36, 47];
        var barColors = ["black","black","black","black","black","black","black","black","black","black"];

        new Chart("myChart", {
          type: "bar",
          data: {
            labels: xValues,
            datasets: [{
              backgroundColor: barColors,
              data: yValues
            }]
          },
          options: {
            legend: {display: false},
            title: {
              display: true,
              text: "Cookie by last accessed"
            }
          }
        });
        </script>

        </body> */}
            </div>
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
                    for (var [site, count] of Object.entries(sites)) {
                        var date = new Date(count * 1000).toDateString()
                        top_sites.push({ domain: site, expirationTime: date });
                    }
                    top_sites.sort(function (a, b) { return b.count - a.count });
                    let top_10 = top_sites.slice(0, 3);
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
        <BarGraph />
        {/* <TableHeader /> */}
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
                        if (timeperiodDays < 30) {
                        //   chrome.cookies.remove({ name: cookie.name, url: cookie.domain })
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