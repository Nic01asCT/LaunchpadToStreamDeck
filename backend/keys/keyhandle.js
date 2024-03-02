const midi = require('midi')
const robot = require('robotjs')

const output = new midi.Output()

for (let i = 0; i < output.getPortCount(); i++) {
    if (output.getPortName(i).includes('Launchpad Mini')) {
        launchpadOutputPort = i
        break
    }
}

if (launchpadOutputPort === null) {
    console.error("Launchpad Mini output port not found.")
    process.exit(1)
}

output.openPort(launchpadOutputPort)

function setLED(channel, key, color) {
    output.sendMessage([channel, key, color])
}

function toggle(json, message) {
    const current = json[message[0]][message[1]][json.profile]
    const keys = json.groups[current.group].keys

    for (let i = 0; i < keys.length; i++) {
        const x = keys[i].split('_')[0], y = keys[i].split('_')[1]
        if (x == message[0] && y == message[1]) {
            json[x][y][json.profile].active = true
            setLED(x, y, current.color)
        }
        else {
            json[x][y][json.profile].active = false
            setLED(x, y, 0)
        }
    }

    for (let i = 0; i < current.action.length; i++) {
        switch (current.action[i].split('_')[0]) {
            case 'profile': json.profile = current.action[i].split('_')[1]; break
        }
    }
}

function onOff(current, message) {
    for (let i = 0; i < current.action.length; i++) {
        switch (current.action[i].split('_')[0]) {
            case 'press': robot.keyTap(current.action[i].split('_')[1]); break
        }
    }
    
    current.active = !current.active
    current.active
        ? setLED(message[0], message[1], current.color)
        : setLED(message[0], message[1], 0)
}

process.on('exit', () => {
    output.closePort()
})

module.exports = {
    setLED,
    toggle,
    onOff
}