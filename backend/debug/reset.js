const midi = require('midi')

const output = new midi.Output()
const portsCount = output.getPortCount()

const outputPortName = 'Launchpad Mini'

let launchpadOutputPort = null
for (let i = 0; i < portsCount; i++) {
    const portName = output.getPortName(i)
    if (portName.includes(outputPortName)) {
        launchpadOutputPort = i
        break
    }
}

if (launchpadOutputPort === null) {
    console.error("Launchpad Mini output port not found.")
    process.exit(1)
}

output.openPort(launchpadOutputPort)

for (let i = 0; i < 8; i++) { output.sendMessage([176, 104 + i, 0]) }
for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 9; x++) {
        output.sendMessage([144, x + y * 16, 0])
    }
}