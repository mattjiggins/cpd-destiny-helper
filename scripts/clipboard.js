var destinyKeywordsClipboard = new Clipboard('.btn-copy-destiny');

destinyKeywordsClipboard.on('success', function(e) {
    // console.info('Action:', e.action);
    // console.info('Text:', e.text);
    // console.info('Trigger:', e.trigger);
    //
    // e.clearSelection();
    var destinyCopyButton = document.getElementById("copy-destiny-keywords");
    destinyCopyButton.innerHTML = "&check; Copied";
    setTimeout(function(){
        destinyCopyButton.innerHTML = "Copy";
    }, 7500);
});
