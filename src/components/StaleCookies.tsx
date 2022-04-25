import { display } from '@mui/system';
import { type } from '@testing-library/user-event/dist/type';
import React, { useState } from 'react';
import Button from './Button';
import "./StaleCookies.css";



function StaleCookies() {
    const Notification1 = () => {
        const count = 442
        return (
            <div className='text'>
                <p>You have {count} cookies that will expire in the next 30 days.</p >
                <p>Here're the 10 closest expiring cookies in your jar: </p >
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

    return (<div>
        <Notification1 />
        <BarGraph />
        <table className='table'>
        <TableHeader />
        <tbody>
            {mock.map(row =>
                <tr>
                    <td>{row.domain}</td>
                    <td>{row.expiration_time}</td>
                </tr>
            )}
        </tbody>
        </table>
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