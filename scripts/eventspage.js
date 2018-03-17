function FocusDonate (){
}

(function(fd)
{
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

    //called on tab update
    fd.prototype.onTabUpdate = function(tabId, changeInfo, tab)
    {
        console.log("tabid:" + tabId);
        console.log("changeInfo: ");
        console.dir(changeInfo);
        console.log("tab:");
        console.dir(tab);

    }

    //create the functions
    fd.prototype.isUriListed = function(uri)
    {
        return false;
    }

    //register tab update events
    chrome.tabs.onUpdated.addListener(fd.prototype.onTabUpdate);

})(FocusDonate)

