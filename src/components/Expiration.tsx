import React, { useEffect, useState } from 'react';
import './Expiration.css';

interface ExpirationCount {
    exp: string,
    count: number
}

const Expiration = () => {

    const [count, setCount] = useState<ExpirationCount[]>([
        {"exp": "in 30 days", count: 0},
        {"exp": "in 180 days", count: 0},
        {"exp": "in 1 year", count: 0},
        {"exp": "more than a year", count: 0},
        {"exp": "no expiration", count: 0},
    ]);
    const [domains, setDomains] = useState<chrome.cookies.Cookie[]>([]);

    const readExpiry = () => chrome.cookies.getAll({}, (cookies) => {
        let _count = [0,0,0,0,0];
        let _domains: chrome.cookies.Cookie[] = [];
        cookies.forEach((cookie) => {
            if (cookie.expirationDate) {
                let cookieExpireTime = new Date(cookie.expirationDate * 1000).valueOf();
                let currentTime = Date.now();
                let timeperiodDays = (cookieExpireTime - currentTime) / 86400000;
                if (timeperiodDays < 30) _count[0] += 1;
                else if (timeperiodDays < 180) _count[1] += 1;
                else if (timeperiodDays < 365) _count[2] += 1;
                else _count[3] += 1;
            } else {
                _count[4] += 1;
                if (_domains.length === 0)
                    _domains.push(cookie);
                else if (_domains.at(_domains.length-1)?.domain !== cookie.domain)
                    _domains.push(cookie);
            }
        });

        setCount([
            {"exp": "in 30 days", count: _count[0]},
            {"exp": "in 180 days", count: _count[1]},
            {"exp": "in 1 year", count: _count[2]},
            {"exp": "more than a year", count: _count[3]},
            {"exp": "no expiration", count: _count[4]},
        ]);

        setDomains(_domains);

    })

    useEffect(() => {
        readExpiry();
    }, [])

    return <div>
        <p>Here's a brief summary of your cookie expiration dates:</p>
        <table>
            <thead>
                <tr>
                <th>Expiration</th>
                <th>Count</th>
                </tr>

            </thead>
            <tbody>
                {count && count.map((e) => <tr>
                    <td>{e.exp}</td>
                    <td>{e.count}</td>
                </tr>)}

            </tbody>
        </table>

        {domains.length === 0 ? <></>:domains.length < 10 ? <>
        <p>Here're some of the cookies on your browser that never expires:</p>
        <table>
            <thead>
                <tr>
                    <th>Domain</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {domains && domains.map(e => <tr>
                    <td>{e.domain}</td>
                    <td>{e.name}</td>
                    </tr>)}
            </tbody>
        </table>
        </> : <>
        <p>Here're {10} of the {domains.length} cookies on your browser that never expires:</p>
        <table>
            <thead>
                <tr>
                    <th>Domain</th>
                    <th>Name</th>
                </tr>
            </thead>
            <tbody>
                {domains && domains.slice(0,10).map(e => <tr>
                    <td>{e.domain}</td>
                    <td>{e.name}</td>
                    </tr>)}
            </tbody>
        </table>
        </>}


    </div>
}

export default Expiration;