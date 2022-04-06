import { useLiveQuery } from 'dexie-react-hooks';
import React from 'react';
import { getDailyCount } from '../utils/db';
import Trend from 'react-trend';

import "./DailyCount.css";


const DailyCount = () => {
    const counts = useLiveQuery(getDailyCount);
    console.log(counts);
    return (
        <div className={"Section-daily-count"}>
            <p>Count of cookies since installation:</p>
            <div className={"daily-count-trendline"}>
                {counts && <Trend
                    smooth
                    autoDraw
                    autoDrawDuration={3000}
                    autoDrawEasing="ease-out"
                    // data={counts.map(c => c.count)}
                    data={[0,2,5,9,5,10,3,5,0,0,1,8,2,9,0]}
                    gradient={['#00c6ff', '#F0F', '#FF0']}
                    radius={5.2}
                    strokeWidth={2.9}
                    strokeLinecap={'butt'}
                />}
            </div>

        </div>
    )
}

export default DailyCount;