const fs = require('fs')
const midi = require('midi')
const robot = require('robotjs')

const output = new midi.Output()

async function handleKey(message) {
    let json = await readFile()
    
    const profile = json.profiles.map(e => e.active ? e : '')[0].name
    message[0] == 144 ? json = keys(json, message, profile) : json = profiles(json, message)

    await writeFile(json)
}

function profiles(json, message) {
    if (message[1] < 108) {
        for (let i = 0; i < 4; i++) {
            output.sendMessage([176, 104 + i, 0])
            json[176][104 + i].active = false
        }
        if (message[1] == 104) robot.keyTap('f17')
        if (message[1] == 105) robot.keyTap('f18')
        if (message[1] == 106) robot.keyTap('f19')
        if (message[1] == 107) robot.keyTap('f20')
    } else {
        for (let i = 0; i < 4; i++) {
            output.sendMessage([176, 108 + i, 0])
            json[176][108 + i].active = false
        }
        json.profiles.map(e => e.name == message[1] ? e.active = true : e.active = false)
    }
    
    json[176][message[1]].active = true
    output.sendMessage([176, message[1], 16])

    return json
}

function keys(json, message, profile) {
    if (!json[144][message[1]] || !json[144][message[1]][profile]) return json
    const key = json[144][message[1]][profile]

    if (key.action == 'press') {
        robot.keyTap(key.function)
        if (key.active) {
            output.sendMessage([144, message[1], 1])
            key.active = false
        } else {
            output.sendMessage([144, message[1], 0])
            key.active = true
        }
    }

    return json
}

async function loadState(launchpadOutputPort) {
    output.openPort(launchpadOutputPort)

    const json = await readFile()

    for (const key in json[176]) {
        const obj = json[176][key]
        obj.active
            ? output.sendMessage([176, key, 16])
            : output.sendMessage([176, key, 0])
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

module.exports = {
    handleKey,
    loadState
}