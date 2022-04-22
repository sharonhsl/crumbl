import { display } from '@mui/system';
import { type } from '@testing-library/user-event/dist/type';
import React, { useState } from 'react';
import Button from './Button';
import "./StaleCookies.css";



function StaleCookies() {
  const Notification1 = () => {
    const count = useState("...");
    return (
      <div>
        <p>You have {count} cookies that haven't been accessed in the past 7 days.</p>
        <p>Here're the 10 earliest cookies in your jar: </p>
      </div>
    )
  }

  const Notification2 = () => {
    return (
      <div>
        <p>We recommend you delete stale cookies regularly. Regular deletion keeps your web browswer safer and quicker.</p>
        <p>Click to delete all the cookies that haven't been modified in the past 7 days:</p>
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
                    Last Modified Time
                </th>
            </tr>
        </thead>
    )
  }

  const mock = [
    { domain: "google.com", last_modification: "Wednesday, 20 October 2019" },
    { domain: "facebook.com", last_modification: "Saturday, 20 November 2019" },
    { domain: "microsoft.com", last_modification: "Thursday, 20 January 2019" },
    { domain: "...", last_modification: "..." }
  ];

  console.log(mock);

  const BarGraph = () => {
    return (
      <div>
      {/* <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.5.0/Chart.min.js"></script>
        <body>

        <canvas id="myChart" style="width:100%;max-width:600px"></canvas>

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
      <BarGraph/>
      <TableHeader />
      <tbody>
          {mock.map(row =>
              <tr>
                  <td>{row.domain}</td>
                  <td>{row.last_modification}</td>
              </tr>
          )}
      </tbody>
      <Notification2 />
      {/* button not working */}
      <Button text="Delete cookies!"></Button>
  </div>);
}






export default StaleCookies;