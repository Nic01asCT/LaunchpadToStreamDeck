require('dotenv').config()

const OBSWebSocket = require('obs-websocket-js').default
const obs = new OBSWebSocket()

obs.connect('ws://127.0.0.1:4455', process.env.PASSWORD)
    .then(() => { console.log(`Connected to OBS`); testing() })
    .catch(err => { console.error(`Error connecting to OBS: ${err}`) })

async function testing() {
    const sceneItemList = await obs.call('GetSceneItemList', { 'sceneName': 'Main' })
    const sourceToControl = sceneItemList.sceneItems.find(item => item.sourceName == 'Background')

    if (sourceToControl) {
        await obs.call('SetSceneItemEnabled', {
            'sceneName': 'Main',
            'sceneItemId': sourceToControl.sceneItemId,
            'sceneItemEnabled': false
        })

        console.log('Source hidden successfully.')
    } else {
        console.log('Source not found in the scene.')
    }
}