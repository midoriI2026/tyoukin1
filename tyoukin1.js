(function () {
'use strict';

/********** DBRecord：再利用ボタン **********/
if (location.href.includes("page=DBRecord")) {

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

        const url = new URL(location.href);
        const did = url.searchParams.get("did");
        const rid = url.searchParams.get("rid");

        const formUrl =
            `${location.origin}/o/ag.cgi?page=DBForm&did=${did}&rid=${rid}` +
            `&mode=reuse&autoTotal=1`;

        location.href = formUrl;
    };

    document.body.appendChild(btn);
}

/********** DBForm：1画面処理 **********/
if (location.href.includes("page=DBForm") &&
    location.href.includes("mode=reuse") &&
    new URL(location.href).searchParams.get("autoTotal") === "1") {

    setTimeout(runAutoTotal, 300);
}

async function runAutoTotal() {

    try {
        const url = new URL(location.href);
        const did = url.searchParams.get("did");
        const rid = url.searchParams.get("rid");

        if (!did || !rid) return;

        // ★ 別タブではなくfetch
        const recordUrl =
            `${location.origin}/o/ag.cgi?page=DBRecord&did=${did}&rid=${rid}`;

        const html = await fetch(recordUrl, { credentials: "include" })
            .then(r => r.text());

        const doc = new DOMParser().parseFromString(html, "text/html");

        // ★ 取得（ここは環境に合わせて調整）
        const total = doc.querySelector(`#record-value-2551-${rid}`)?.textContent?.trim();

        if (!total) {
            alert("取得失敗");
            return;
        }

        // ★ 反映
        const fld = document.querySelector("#dz_fld505");
        if (!fld) {
            alert("貼付先なし");
            return;
        }

        fld.value = total;

        alert(`累計コピー完了\n${total}`);

    } catch (e) {
        console.error(e);
        alert("処理エラー");
    }
}

})();
