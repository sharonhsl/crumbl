import React, { useEffect, useState } from 'react';
import Button from './Button';
import './Flavors.css';

interface FlavorsProps {
    tabId: number | null;
}

interface Cookies {
    domain: string;
    name: string;
    expirationDate?: number | undefined;
    category?: string | undefined;
}

const Flavors = (props: FlavorsProps) => {
    const [data, setData] = useState<Cookies[]>([]);
    const [showFlavors, setShowFlavors] = useState(false);

    const checkCookieFlavor = async (cookies: chrome.cookies.Cookie[]) => {
        const response = await fetch(
            "https://crumbl-server.herokuapp.com/",
            {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(
                    {
                        "list": cookies.map(c => ({ "name": c.name, "domain": c.domain }))
                    }
                )
            }
        );
        response.json().then(data => setData(data['results']));
    }

    const checkTabCookies = (tabId: number) => {
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
                checkCookieFlavor(c);
            }
        });
    };

    useEffect(() => {
        if (props.tabId) checkTabCookies(props.tabId);
    }, []);

    return <div className={"flavors"}>
        {!showFlavors && <Button text="Show cookies!" onClick={async () => {
            if (props.tabId) await checkTabCookies(props.tabId);
            setShowFlavors(true);
        }}></Button>}
        {showFlavors && <Button text="Hide cookies" onClick={() => setShowFlavors(false)}></Button>}
        {showFlavors && <table>
            <thead>
                <tr>
                    <th style={{ width: "10%" }}></th>
                    <th>domain</th>
                    <th>name</th>
                    <th>expiry</th>
                    <th>Flavor</th>
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
                        <td>{d.category}</td>
                    </tr>
                })}
            </tbody>
        </table>}
    </div>

}

export default Flavors;