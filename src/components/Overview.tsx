import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import DailyCount from './DailyCount';
import './Overview.css';

interface OverviewProps {
    tabId: number;
}

function Overview(props: OverviewProps) {

    const [count, setCount] = useState("...");
    const [currCount, setCurrCount] = useState(0);
    const [domains, setDomains] = useState(new Set());

    const updateJarCount = debounce(() => chrome.cookies.getAll({}, (cookies: any) => {
        setCount(cookies.length);
    }), 1000);

    const checkTabCookies = debounce((tabId: number) => {
        chrome.storage.local.get(tabId.toString(), async (result) => {
            let total = 0;
            if (result[tabId] !== undefined) {
                let d: string[] = [];
                for (let i = 0; i < result[tabId].length; i++) {
                    const domain = result[tabId][i];
                    await chrome.cookies.getAll({ domain: domain }).then(
                        (cookies) => {
                            d = d.concat(cookies.map((e: { domain: string; }) => e.domain));
                            if (cookies.length > 0) {
                                total += cookies.length;
                                setCurrCount(total);
                            }
                        });
                    setDomains(new Set(d));
                }
            }
        });
    }, 500);

    useEffect(() => {
        updateJarCount();
        chrome.cookies.onChanged.addListener(updateJarCount);
        checkTabCookies(props.tabId);
        chrome.cookies.onChanged.addListener(() => checkTabCookies(props.tabId));
    }, []);

    let domainsText = "0 domain";
    let iter = domains.values();
    if (domains.size === 1) domainsText = `${iter.next().value}`;
    else if (domains.size === 2) domainsText = `${iter.next().value} and ${iter.next().value}`;
    else if (domains.size > 2) domainsText = `${iter.next().value}, ${iter.next().value} and ${domains.size - 2} other domains`;

    return (
        <div className="App">
            <header className="App-header">
                <p>You got {count} cookies in your jar.</p>
                {currCount === 0 ?
                    <p>This website stores no cookie.</p> :
                    <p>This website may have enabled {domainsText} to store {currCount} cookies.</p>}
            </header>
            <DailyCount />
        </div>
    );
}

export default Overview;
