import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import Trend from 'react-trend';
import { getDailyCount } from '../utils/db';
import "./DailyCount.css";



const DailyCount = () => {
    const counts = useLiveQuery(getDailyCount);
    let diff;
    let lastDate;
    if (counts && counts.length >= 2)  {
        let a = counts.at(-1)?.count;
        let b = counts.at(-2)?.count;
        if (a && b) {
            diff = a-b;
            lastDate = counts.at(-2)?.date;
        };
    }
    return (
        <div className={"Section-daily-count"}>
            <p>Count of cookies since installation:</p>
            <div className={"daily-count-trendline"}>
                {counts && <Trend
                    smooth
                    autoDraw
                    autoDrawDuration={3000}
                    autoDrawEasing="ease-out"
                    data={counts.map(c => c.count)}
                    // data={[0,2,5,9,5,10,3,5,0,0,1,8,2,9,0]}
                    gradient={['#00c6ff', '#F0F', '#FF0']}
                    radius={5.2}
                    strokeWidth={2.9}
                    strokeLinecap={'butt'}
                />}
            </div>
            {diff && diff >= 0 ? 
            <p>Compared with {lastDate} you got +{diff} cookies.</p> :
            <p>Compared with {lastDate} you got {diff} cookies.</p>}
        </div>
    )
}

export default DailyCount;