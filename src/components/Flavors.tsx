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

    useEffect(() => {
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
                    c.sort((a, b) => a.domain > b.domain ? 1 : -1);
                    setData(c);
                }
            });
        });
        if (props.tabId) checkTabCookies(props.tabId);
    }, []);

    return <div className={"flavors"}>
        {!showFlavors && <Button text="Show cookies!" onClick={() => setShowFlavors(true)}></Button>}
        {showFlavors && <Button text="Hide cookies" onClick={() => setShowFlavors(false)}></Button>}
        {showFlavors && <table>
            <thead>
                <tr>
                    <th style={{ width: "10%" }}></th>
                    <th>domain</th>
                    <th>name</th>
                    <th>expiry</th>
                </tr>
            </thead>
            <tbody>
                {data && data.map((d, i) => {
                    let date;
                    if (d.expirationDate) date = new Date(d.expirationDate * 1000);
                    return <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{d.domain}</td>
                        <td>{d.name}</td>
                        <td>{date && date.toLocaleDateString()}</td>
                    </tr>
                })}
            </tbody>
        </table>}
    </div>

}

export default Flavors;