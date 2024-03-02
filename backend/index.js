const fs = require('fs')
const midi = require('midi')

const { setLED, toggle, onOff } = require('./keys/keyhandle')

const input = new midi.Input()

input.openPort(0)

input.on('message', (deltaTime, message) => { handleKey(message) })

let json
let sync = 10
async function handleKey(message) {
    const current = json[message[0]][message[1]][json.profile]

    if (message[0] == 144 && message[1] == 120 && message[2] == 127) {
        await writeFile(json)
        loadState()
    }

    try {
        switch (json.groups[current.group].mode) {
            case 'toggle': if (message[2] == 127) toggle(json, message); break
        }
    } catch {
        try {
            switch (current.mode) {
                case 'toggle': if (message[2] == 127) onOff(current, message); break
                case 'switched': onOff(current, message); break
            }
        } catch {  }
    }

    if (sync == 0) {
        sync = 10
        await writeFile(json)
    }
    else sync--
}

async function loadState() {
    json = await readFile()

    for (const key in json[176]) {
        const obj = json[176][key]
        if (obj[json.profile]) obj[json.profile].active
            ? setLED(176, key, obj[json.profile].color)
            : setLED(176, key, 0)
    }

    for (const key in json[144]) {
        const obj = json[144][key]
        if (obj[json.profile]) obj[json.profile].active
            ? setLED(144, key, obj[json.profile].color)
            : setLED(144, key, 0)
    }
}

const readFile = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('keys/map.json', 'utf8', (err, data) => {
            if (err) reject(err)
            else resolve(JSON.parse(data))
        })
    })
}

const writeFile = (jsonData) => {
    return new Promise((resolve, reject) => {
        fs.writeFile('keys/map.json', JSON.stringify(jsonData, null, 2), 'utf8', (err) => {
            if (err) reject(err)
            else resolve()
        })
    })
}

loadState()

process.on('exit', () => {
    input.closePort()
})