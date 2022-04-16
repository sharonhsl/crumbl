import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import Button from './Button';
import './Flavors.css';


interface FlavorsProps {
    tabId: number | null;
}

const Flavors = (props: FlavorsProps) => {
    const [data, setData] = useState<chrome.cookies.Cookie[]>([]);
    const [showFlavors, setShowFlavors] = useState(false);

    const checkTabCookies = debounce((tabId: number) => {
        chrome.storage.local.get(tabId.toString(), async (result) => {
            if (result[tabId] !== undefined) {
                let c: chrome.cookies.Cookie[] = [];
                for (let i = 0; i < result[tabId].length; i++) {
                    const domain = result[tabId][i];
                    await chrome.cookies.getAll({ domain: domain }).then(
                        (cookies) => c = c.concat(cookies)
                    );
                }
                setData(c);
                console.log(c);
            }
        });
    });

    useEffect(() => {
        if (props.tabId) checkTabCookies(props.tabId);
    }, []);

    return <div>
        {!showFlavors && <Button text="Show cookies!" onClick={() => setShowFlavors(true)}></Button>}
        {showFlavors && <Button text="Hide cookies" onClick={() => setShowFlavors(false)}></Button>}
        {showFlavors && <table>
            <thead>
                <tr>
                    <th>name</th>
                    <th>domain</th>
                    <th>expiry</th>
                </tr>
            </thead>
            <tbody>
                {data && data.map((d, i) => {
                    let date;
                    if (d.expirationDate) date = new Date(d.expirationDate * 1000);
                    return <tr key={i}>
                        <th>{d.name}</th>
                        <th>{d.domain}</th>
                        <th>{date && date.toLocaleDateString()}</th>
                    </tr>
                })}
            </tbody>
        </table>}
    </div>

}

export default Flavors;