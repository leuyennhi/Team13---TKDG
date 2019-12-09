< script >
    var img_tracker = 'f';

function change() {
    var img = document.getElementById("img-down");
    if (img_tracker == 'f') {
        img.src = 'images/icons/down.png';
        img_tracker = 't';
    } else {
        img.src = 'images/icons/left.png';
        img_tracker = 'f';
    }
} <
/script> <
script >
    var img_tracker1 = 'f1';

function change1() {
    var img = document.getElementById("img-down1");
    if (img_tracker1 == 'f1') {
        img.src = 'images/icons/down.png';
        img_tracker1 = 't1';
    } else {
        img.src = 'images/icons/left.png';
        img_tracker1 = 'f1';
    }
} <
/script> <
script >
    var img_tracker2 = 'f2';

function change2() {
    var img = document.getElementById("img-down2");
    if (img_tracker2 == 'f2') {
        img.src = 'images/icons/down.png';
        img_tracker2 = 't2';
    } else {
        img.src = 'images/icons/left.png';
        img_tracker2 = 'f2';
    }
} <
/script> <
script >
    var img_tracker3 = 'f3';

function change3() {
    var img = document.getElementById("img-down3");
    if (img_tracker3 == 'f3') {
        img.src = 'images/icons/down.png';
        img_tracker3 = 't3';
    } else {
        img.src = 'images/icons/left.png';
        img_tracker3 = 'f3';
    }
} <
/script>

<
script >
    function rangeSlider(value) {
        document.getElementById('rangeValueSearch').innerHTML = value;
    } <
    /script></script>