(function () {
const VERSION = "v1.1";
console.log("超勤1:", VERSION);

'use strict';

/********** 共通 **********/
function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

async function waitLoad(tab){
    while(tab.document.readyState !== "complete"){
        await sleep(100);
    }
}

/********** DBRecord：再利用ボタン **********/
if (location.href.includes("page=DBRecord")) {

    const reuseLink = document.querySelector('a[href*="page=DBForm"]');
    if (!reuseLink) return;

    const btn = document.createElement("button");
    btn.textContent = "超勤：カスタム再利用_累計コピー";

    btn.style = `
        position:fixed;
        top:360px;
        right:20px;
        z-index:9999;
        padding:10px;
        background:#673AB7;
        color:#fff;
    `;

    btn.onclick = () => {

        const url = new URL(reuseLink.href, location.origin);

        // ★ 再利用を強制
        url.searchParams.set("mode", "reuse");

        // ★ 編集モード除去（これ重要）
        url.searchParams.delete("rw");

        // トリガー
        url.searchParams.set("autoTotal", "1");

        location.href = url.toString();
    };
    document.body.appendChild(btn);
}

/********** DBForm：自動実行 **********/
    if (location.href.includes("page=DBForm") &&
        location.href.includes("mode=reuse") &&
        new URL(location.href).searchParams.get("autoTotal") === "1") {

        setTimeout(runAutoTotal, 500);
    }

async function runAutoTotal() {

    const fld = document.querySelector("#dz_fld505");
    if (!fld) return;

    const rid = new URL(location.href).searchParams.get("rid");
    if (!rid) return;

    const recordUrl = location.href.replace("page=DBForm", "page=DBRecord");

    const tab = window.open(recordUrl, "_blank");
    if (!tab) return;

    await waitLoad(tab);

    let total = null;

    for (let i = 0; i < 5; i++) {
        total = tab.document.querySelector(`#record-value-2551-${rid}`)?.textContent?.trim();
        if (total) break;
        await sleep(300);
    }

    tab.close();

    if (!total) return;

    fld.value = total;

    alert(`累計コピー完了\nRID=${rid}\n${total}`);
}

})();
