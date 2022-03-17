import _, {debounce} from 'lodash';

export { }

/** Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version. */
chrome.runtime.onInstalled.addListener((details) => {
    console.log('[background.js] onInstalled', details);
});

const checkTabCookies = debounce((tabId: number) => {
    let total = 0;
    chrome.storage.local.get(tabId.toString(), (result) => {
        result[tabId].forEach((domain: string) => {
            chrome.cookies.getAll({domain: domain}, (cookies: any) => {
                total += cookies.length;
                // console.log(domain, total);
                chrome.action.setBadgeText({
                    text: total.toString()
                })
            })
        });
    });
}, 80);

chrome.webRequest.onCompleted.addListener((details) => {
    const hostname = new URL(details.url).hostname.replace('www.','');
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

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.url != undefined) {
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


// chrome.cookies.onChanged.addListener(function (info) {
    // console.log("onChanged" + JSON.stringify(info));
    // chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
    //     console.log(response.farewell);
    //   });
// });


