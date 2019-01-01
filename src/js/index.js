;
(function() {
    $.ajax({
        url: "/api/list",
        success: function(res) {
            console.log(JSON.parse(res))
        }
    })
})()