module.exports = {
    timeAgo: function timeAgo(time){
        var units = [
            { name: "s", limit: 60, in_seconds: 1 },
            { name: "m", limit: 3600, in_seconds: 60 },
            { name: "h", limit: 86400, in_seconds: 3600  },
            { name: "d", limit: 604800, in_seconds: 86400 },
            { name: "w", limit: 2629743, in_seconds: 604800  }
        ];
        var diff = (new Date() - new Date(time*1000)) / 1000;
        if (diff < 5) return "now";

        var i = 0, unit;
        while (unit = units[i++]) {
            if (diff < unit.limit || !unit.limit){
                var diff =  Math.floor(diff / unit.in_seconds);
                return diff + "" + unit.name ;
            }
        };
    }
}
