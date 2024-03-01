const { handleKey, loadState } = require('./keys/keyhandle')

const midi = require('midi')

const input = new midi.Input()
const output = new midi.Output()

let launchpadOutputPort = null
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

input.openPort(0)

loadState(launchpadOutputPort)

input.on('message', (deltaTime, message) => {
    if (message[2] == 127) handleKey(message)
    //if (message[0] == 144 && message[1] == 88 && message[2] == 127) output.sendMessage([144, 88, 1])
    //setLED(1, 1, 1)
    //if (message[0] == 144 && message[2] == 0 && message[1] == 0) robot.keyTap('f')
})

process.on('exit', () => {
    input.closePort()
    output.closePort()
})