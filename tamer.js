
const TAB_CHECKER_ALARM_NAME = 'tab-checker-alarm';

browser.runtime.onInstalled.addListener(function () {
    console.log('Loaded!');
});

browser.alarms.onAlarm.addListener((async function (alarmInfo) {
    if(alarmInfo.name !== TAB_CHECKER_ALARM_NAME) {
        return;
    }
    console.log(`Triggered!`);

    const discardCandidateTabs = await browser.tabs.query({
        discarded: false,
        active: false
    });
    discardCandidateTabs.forEach(t => console.log(`Got: Id: ${t.id}, url: ${t.url}, lastAccessed: ${new Date(t.lastAccessed)}`));
    console.log("Got list of potentially discardable tabs: %o", discardCandidateTabs);

    const timeToLiveTimestamp = getTimeToLiveTimestamp();
    console.log(`Discarding tabs that are older than: ${new Date(timeToLiveTimestamp)}`);

    var tabIdsToDiscard = discardCandidateTabs
        .filter(t => !t.url.startsWith("about"))
        .filter(t => t.lastAccessed < timeToLiveTimestamp)
        .map(t => {
            console.log(`Adding tab to discard list. Id: ${t.id}, url: ${t.url}, lastAccessed: ${new Date(t.lastAccessed)}`);
            return t;
        })
        .reduce((idsToDiscard, tab) => { 
            idsToDiscard.push(tab.id);
            return idsToDiscard;
        }, []);
    console.log("Tab ids to discard: %o", tabIdsToDiscard);
    browser.tabs.discard(tabIdsToDiscard);
}));

browser.alarms.create(TAB_CHECKER_ALARM_NAME, {
    periodInMinutes: 1
});

function getTimeToLiveTimestamp() {
    const currentDate = new Date();

    return new Date(currentDate.setHours(currentDate.getHours() - 1)).getTime();
}
