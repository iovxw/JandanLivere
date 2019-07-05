// ==UserScript==
// @name         Jandan Livere Comments
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add Livere to jandan.net
// @author       yellow
// @author       iovxw
// @match        *://i.jandan.net/*
// @match        *://jandan.net/*
// @grant        none
// ==/UserScript==

/*
 * by yellow(yellow.as@gmail.com)
 */
function yellow() {
    var comments = document.getElementById('comments').getElementsByTagName('li');
    for (var i = 0; i < comments.length; i++) {
        if (comments[i].id.slice(0, 8) == "comment-") {
            var div = comments[i].getElementsByTagName('div')[comments[i].getElementsByTagName('div').length - 1];
            var divs = comments[i].getElementsByTagName('div');
            for (let j = 0; j < divs.length; j++) {
                if (divs[j].getAttribute('class') == "vote") {
                    div = divs[j];
                    break;
                }
            }

            if (div.innerHTML.indexOf('吐槽') > 1) {
                var sps = div.getElementsByTagName('span');
                for (let j = 0; j < sps.length; j++) {
                    if (sps[j].getAttribute('class') == "time") {
                        sps[j].innerHTML = '';
                        div.removeChild(sps[j]);
                        break;
                    }
                }
            }

            div.innerHTML = div.innerHTML + '<span class="time"><a href="javascript:void(0);" onclick="loadComment(\'' + comments[i].id + '\');"> ↓吐槽</a></span>';

            if (document.getElementById('comment-box-' + comments[i].id) == undefined) {
                var cb = document.createElement('div');
                cb.id = 'comment-box-' + comments[i].id;
                cb.name = 'hide';
                comments[i].appendChild(cb);
            }
        }
    };
}

(function(d, s) {
    var j, e = d.getElementsByTagName(s)[0];
    if (typeof LivereTower === 'function') {
        return
    }
    j = d.createElement(s);
    j.src = 'https://cdn-city.livere.com/js/embed.dist.js';
    j.async = true;
    e.parentNode.insertBefore(j, e)
})(document, 'script');

function setupEnvironments(commentId) {
    var refer = 'jandan.net/yellowcomment-' + commentId;
    var meta = document.querySelector('meta[property=\"og:url\"]');
    if (meta && meta.parentElement) {
        meta.parentElement.removeChild(meta)
    }

    let ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    ogUrl.setAttribute('content', 'http://jandan.net/t/' + commentId);
    document.getElementsByTagName('head')[0].appendChild(ogUrl)

    meta = document.querySelector('meta[property=\"og:title\"]');
    if (meta && meta.parentElement) {
        meta.parentElement.removeChild(meta)
    }

    let ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', '无聊图-' + commentId);
    document.getElementsByTagName('head')[0].appendChild(ogTitle)

    window.refer = refer;
}

function setupContainer(parent) {
    let lv = document.getElementById('lv-container');
    if (lv && lv.parentElement) {
        lv.parentElement.removeChild(lv);
    }
    lv = document.createElement('div');
    lv.id = 'lv-container';
    lv.setAttribute('data-id', 'city');
    lv.setAttribute('data-uid', 'MTAyMC80NTA0MS8yMTU1OQ==');
    lv.setAttribute('style', 'min-height:100px;');
    lv.charset = 'UTF-8';
    lv.innerHTML = '正在载入，请稍候，不要重复点击！（这行字不会消失）';
    parent.appendChild(lv);
}

function loadComment(theid) {
    let commentId = theid.split('-')[1];
    setupEnvironments(commentId);
    setupContainer(document.getElementById('comment-box-' + theid));
    window.LivereTower.init();
}

window.loadComment = loadComment;

if (window.location.pathname.startsWith('/t/')) {
    let commentId = window.location.pathname.match(/[0-9]+/g)[0];
    setupEnvironments(commentId);
    setupContainer(document.getElementById('tucao-list'));
} else {
    yellow();
}
