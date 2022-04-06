import _, {debounce} from 'lodash';
import * as psl from 'psl';
import { initDatabase, updateDailyCount } from '../utils/db';

export { }

const checkTabCookies = debounce((tabId: number) => {
    let total = 0;
    chrome.storage.local.get(tabId.toString(), (result) => {
        if (result[tabId].length == 0) {
            chrome.action.setBadgeText({
                text: '0',
                tabId: tabId
            });
        } else {
            result[tabId].forEach((domain: string) => {
                console.log("checkTabCookies ", domain);
                chrome.cookies.getAll({domain: domain}, (cookies: any) => {
                    total += cookies.length;
                    chrome.action.setBadgeText({
                        text: total.toString(),
                        tabId: tabId
                    });
                });
            });
        }
    });
}, 80);


/** Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version. */
 chrome.runtime.onInstalled.addListener(async (details) => {
    console.log('[background.js] onInstalled', details);
    chrome.action.setBadgeText({
        text: '0',
    });
    await initDatabase();
});

chrome.cookies.onChanged.addListener(async () => {
    console.log("cookies onchanged")
    // debounce(updateDailyCount);
    await updateDailyCount();
});


chrome.webRequest.onCompleted.addListener((details) => {
    // const hostname = new URL(details.url).hostname.replace('www.','');
    // @ts-ignore
    const hostname = psl.parse(new URL(details.url).hostname).domain;
    const tabId = details.tabId;

    chrome.storage.local.get({ [tabId]: [] }, (result) => {
        if (!result[tabId].includes(hostname)) {
            // console.log(result);
            chrome.storage.local.set({ [tabId]: [...result[tabId], hostname] },
                // () => console.log("a webRequest domain is set")
            );
        }
    });
    chrome.tabs.query({active: true, currentWindow: true}, (result) => {
        if (result.length > 0 && result[0].id == tabId) {
            checkTabCookies(tabId);
        }
    })
}, { urls: ["<all_urls>"] });

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.url != undefined) {
        console.log("update tab ", tabId );
        chrome.storage.local.set({[tabId]: []});
    }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    const tabId = activeInfo.tabId;
    checkTabCookies(tabId);
});

chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.storage.local.remove(tabId.toString(), () => {
        console.log("clear storage for closed tab " + tabId.toString());
    });
});

chrome.tabs.onCreated.addListener((tab) => {
    chrome.action.setBadgeText({
        text: '0',  
        tabId: tab.id
    });
})

chrome.tabs.onRemoved.addListener((tabId) => {
    chrome.storage.local.remove(tabId.toString(), () => {
        console.log("clear storage for closed tab " + tabId.toString());
    });
});

chrome.windows.onRemoved.addListener(() => {
    chrome.cookies.getAll({}, (cookies) => {
        const d = new Date().toISOString().substring(0,10);
    });
    chrome.windows.getCurrent(() => {
        if (chrome.runtime.lastError) {
            chrome.storage.local.clear();
        };
    });
});



