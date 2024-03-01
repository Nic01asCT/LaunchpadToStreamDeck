const midi = require('midi')

////////////////////////////////
const row1 = [0, 17, 2, 3, 4, 5, 6, 7]
const row2 = [112, 113, 114, 115, 116, 117, 118, 119, 120]
const leds = [...row1, ...row2]
////////////////////////////////

const outputPortName = 'Launchpad Mini'

const output = new midi.Output()
const portsCount = output.getPortCount()

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

// Function to write LED color to Launchpad Mini
function writeLed(ledId, colorVel) {
    output.sendMessage([144, 0, 0 + 1 * 16]);
}

writeLed(0, 3 + 1 * 16)
// Switch to "InControl" mode
output.sendMessage([0x90, 0x0C, 0x7F]);

// Sweep animation loop
const delay = 100; // Delay between LED updates in milliseconds


/*(async function() {
    try {
        while (true) {
            const color = 0 + 1 * 16;

            for (let index = 0; index < row1.length; index++) {
                // Set current LED color
                writeLed(row1[index], color);
                writeLed(row2[index], color);

                // Turn off last set LEDs
                if (index > 0) {
                    writeLed(row1[index - 1], 0);
                    writeLed(row2[index - 1], 0);
                }

                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        // Turn off all LEDs and disable "InControl" mode
        leds.forEach(led => writeLed(led, 0));
        output.sendMessage([0x90, 0x0C, 0x00]);

        // Close the MIDI output port
        output.closePort();
    }
})();*/