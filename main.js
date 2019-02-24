const { app, BrowserWindow, ipcMain } = require('electron')
const util = require ('util')
const fs=require('fs')
//make fs.stat able to use promises(instead of callbacks)
const stat= util.promisify(fs.stat)

//BROWSER PROCESS
//Code to create a basic window or Browser process
// 1. Load in the path module from Node
const path = require('path')
// 2. Creating global variable for the window 
// so that it can be referenced and not garbage collected
let mainWindow
// 3. Load the html in the window
// wait for the main process to be ready
app.on('ready', () => {
	//path to the html
	const htmlPath = path.join('src', 'index.html')
	//create a browser window
	mainWindow = new BrowserWindow()
	// load the html file 
	mainWindow.loadFile(htmlPath)
})

//MAIN PROCESS COMMUNICATION HANDLERS
// listen for files event by browser process
ipcMain.on('files', async(event, filesArr)=>{
	try{
		//asynchronously get the data for all the files
		const data = await Promise.all(
			filesArr.map(async ({name, pathName})=> ({
				...await stat(pathName),
				name,
				pathName
			}))
		)
		// To remember: we declared mainWindow ourselves
		// when we created a new browser window
		mainWindow.webContents.send('metadata', data)
	} catch (error){
		//send an error event if something goes wrong
		mainWindow.webContents.send('metadata:error', error)
	}
})