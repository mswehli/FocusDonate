
function FocusDonate (){
}

(function(fd)
{
    fd.prototype.baseAmount = 0.5;
    fd.prototype.minuteAmount = 0.5;

    console.log("FocusDonate function called!");

    fd.prototype.curTab = -1;
    fd.prototype.counters = {}; //create as key/value rather than array
    fd.prototype.curIntervalId = -1; 

    var rx = '(';
    var list = [
        'facebook.com',
        'techcrunch.com',
        'twitter.com',
        'instagram.com',
        'pinterest.com',
        'myspace.com',
        '9gag.com',
        'reddit.com',
        'medium.com'
    ];

    //create the regex
    var len = list.length;
    for(var i=0; i<len;i++)
    {
        rx += list[i];
        if(i<(len-1)){
            rx += '|';
        }
    }
    rx += ')';

    //create the regexp test object
    fd.prototype.uriRegex = new RegExp(rx);
    
    //callback for dealing with activated tab
    fd.prototype.tabCheck = function(tab)
    {
        //if its not the active tab, do nothing
        if(!tab.active){
            return;
        }
        
        //set the active tab
        fd.prototype.curTab = tab.id;

        //check if disallowed
        var disallowedUrl = fd.prototype.uriRegex.test(tab.url);
        console.log("tab checked, is active: true - uri is disallowed: " + disallowedUrl);

        //if disallowed, start or continue timer
        if(disallowedUrl){
            fd.prototype.startTimer();
        }else{
            //stop the timer for the tab
            fd.prototype.endTimer(fd.prototype.curTab);
        }
    }

    //called when a tab is selected(activated) or created (and automatically activated)
    fd.prototype.onActivated = function(activeInfo)
    {
        //pause any running timer
        fd.prototype.pauseTimer();

        //get the tab info and check it
        chrome.tabs.get(activeInfo.tabId, fd.prototype.tabCheck);
        
    }

    //called on tab update
    fd.prototype.onTabUpdate = function(tabId, changeInfo, tab)
    {
        //only start when loading is complete
        if(tab.status == 'complete'){
            fd.prototype.tabCheck(tab);
        }

    }

    fd.prototype.onTabClosed = function(tabId, removeInfo)
    {
        //end the timer, whether or not its the active tab
        console.log("tab closed: " + tabId);
        fd.prototype.endTimer(tabId);
    }

    //helper functions
    //start a new timer or resume the timer if it exists
    fd.prototype.startTimer = function()
    {
         //clear old timers before starting a new one
         fd.prototype.pauseTimer();

        //for ease of use, store tabid as local varaible
        var tabId = fd.prototype.curTab;

        //start timer for newly activated tabs to not allowed uris
        console.log("Starting timer for tab: " + tabId);

        //check if timer exists, if not create it.
        var t = fd.prototype.counters[tabId];
        if(t==null)
        {
            console.log("Timer doesn't yet exist, creating for: " + tabId);
            fd.prototype.counters[tabId] = fd.prototype.baseAmount;

        }
        //set interval to add to timer every second.
        fd.prototype.curIntervalId = window.setInterval(fd.prototype.incrementTimer,5000);
    }

    
    fd.prototype.incrementTimer = function()
    {
        console.log("adding to counter: " + fd.prototype.curIntervalId);

        fd.prototype.counters[fd.prototype.curTab] += (fd.prototype.minuteAmount * (5/60));

    }

    //clears the interval, pausing the timer
    fd.prototype.pauseTimer = function()
    {
        console.log("pausing timer: " + fd.prototype.curIntervalId);
        if(fd.prototype.curIntervalId > 0)
        {
            window.clearInterval(fd.prototype.curIntervalId);
            fd.prototype.curIntervalId = -1;
        }

    }

    fd.prototype.endTimer = function(tabId)
    {
        console.log("ending timer: " + tabId);

        
        //check if tab id exists as timer.
        var counter = fd.prototype.counters[tabId];
        //if it doesnt exist, nothing to do
        if(counter == null){
            console.log("timer doesnt exist, ending early for tab: " + tabId);
            return;
        }

        //check if tab is current tab, if so pause timer
        if(fd.prototype.curTab == tabId){
            fd.prototype.pauseTimer;
        }

        //printer total to be charged
        console.log("total to be charged: " + counter);

        //delete the timer
        delete fd.prototype.counters[tabId];
    }

    //register tab update events
    //when a tab is activated/selected
    chrome.tabs.onActivated.addListener(fd.prototype.onActivated);
    //when a tabs url or status is updated
    chrome.tabs.onUpdated.addListener(fd.prototype.onTabUpdate);
    //when a tab is closed
    chrome.tabs.onRemoved.addListener(fd.prototype.onTabClosed);

})(FocusDonate)

