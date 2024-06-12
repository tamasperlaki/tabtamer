browser.runtime.onInstalled.addListener(async () => {
    console.log(`Loaded: ${new Date()}`);
    var asd = await browser.tabs.query({});
    console.log(asd.reduce((acc, curr) => {acc[curr.discarded] = isFinite(acc[curr.discarded]) ? acc[curr.discarded] + 1 : 1; return acc;}, {}));
});
