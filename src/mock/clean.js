export function clean() {
    var r = confirm("确认清除Cookie和IndexedDB？");
    if (r == true) {
        console.log('clean');
        // clean cookies
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
        }
        // clean indexedDB
        indexedDB.deleteDatabase('cloud_factory')

    }

}