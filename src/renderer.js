'use strict'

const { ipcRenderer } = require('electron') //importing ipcRenderer
// listen for the form submit event and grab file data 
const submitListener=document
	.querySelector('form')
	.addEventListener('submit', (event) => {
		//prevent default behaviour that causes page refresh
		event.preventDefault()

		// an array of files with some metadata
		const files = [...document.getElementById('filepicker').files]
		
		// format the file data to only path and name
		const filesFormatted = files.map(({name, path:pathName}) => ({
			name,
			pathName
		}))
		//RENDERER PROCESS COMMUNICATION HANDLERS
		// 1. send the data to the main process
		ipcRenderer.send('files', filesFormatted)
	})

// 2. metadata from the main process
ipcRenderer.on('metadata', (event, metadata) => {
	const pre = document.getElementById('data')

	pre.innerText= JSON.stringify(metadata, null, 2)
})

// 3. error event from catch block in main process
ipcRenderer.on('metadata:error', (event , error)=>{
	console.error(error)
})