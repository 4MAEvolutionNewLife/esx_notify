const w = window;

// Hangok beállítása az nui/sounds mappában
const successSound = new Audio('sounds/success.ogg');
const errorSound = new Audio('sounds/error.ogg');
const infoSound = new Audio('sounds/noti.ogg');
const dutySound = new Audio('sounds/duty.ogg');
const offdutySound = new Audio('sounds/offduty.ogg');

// Gets the current icon it needs to use.
const types = {
    ["success"]: {
        ["icon"]: "check_circle",
        ["sound"]: successSound,
    },
    ["error"]: {
        ["icon"]: "error",
        ["sound"]: errorSound,
    },
    ["info"]: {
        ["icon"]: "info",
        ["sound"]: infoSound,
    },
    ["duty"]: {
        ["icon"]: "info",
        ["sound"]: dutySound,
    },
    ["offduty"]: {
        ["icon"]: "info",
        ["sound"]: offdutySound,
    },
};

// the color codes example `i ~r~love~s~ donuts`
const codes = {
    "~r~": "red",
    "~b~": "#378cbf",
    "~g~": "green",
    "~y~": "yellow",
    "~p~": "purple",
    "~c~": "grey",
    "~m~": "#212121",
    "~u~": "black",
    "~o~": "orange",
};

w.addEventListener("message", (event) => {
    notification({
        type: event.data.type,
        message: event.data.message,
        length: event.data.length,
    });
});

const replaceColors = (str, obj) => {
    let strToReplace = str;

    for (let id in obj) {
        strToReplace = strToReplace.replace(new RegExp(id, "g"), obj[id]);
    }

    return strToReplace;
};

notification = (data) => {
    for (color in codes) {
        if (data["message"].includes(color)) {
            let objArr = {};
            objArr[color] = `<span style="color: ${codes[color]}">`;
            objArr["~s~"] = "</span>";

            let newStr = replaceColors(data["message"], objArr);

            data["message"] = newStr;
        }
    }

    const notification = $(`
        <div class="notify ${data.type}">
            <div class="innerText">
                <span class="material-symbols-outlined icon">${types[data.type]["icon"]}</span>
                <p class="text">${data["message"]}</p>
            </div>
        </div>
    `).appendTo(`#root`);

    if (data.sound !== false) {
        types[data.type]["sound"].play();
    }

    setTimeout(() => {
        notification.fadeOut(700);
    }, data.length);

    return notification;
};
