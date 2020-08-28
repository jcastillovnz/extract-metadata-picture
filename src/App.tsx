import React, {useState, useEffect, useRef} from 'react';
import fs from 'browserify-fs';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import './App.css';
const useStyles = makeStyles((theme) => ({
  root: {
    width: '80%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));
function App() {
  const classes = useStyles();
  const refInput : {current} = useRef();
  useEffect(() => {
    refInput.current.webkitdirectory = true;
    refInput.current.directory = true;
    refInput.current.multiple = true;
    },[])

const [rootFolder, setRootFolder] = useState('');
const [rootFolderFoldersNumber, setRootFolderNumberFolders] = useState(0);
const [rootFolderFilesNumber, setRootFolderFilesNumber] = useState(0);
const [isLoading, setIsLoading] = useState(false);
const selectedFolder =(rootFolderFiles)=>{
  setIsLoading(true);
  const rootFolder = rootFolderFiles[0].webkitRelativePath.split('/')[0];
  setRootFolder(rootFolder);
  setRootFolderFilesNumber(rootFolderFiles.length)
/* mapeando carpetas */
const foldersFiltered = [...rootFolderFiles].filter((file, index)=>{
  const pastIndex = index -1
  const folderName = file.webkitRelativePath.split('/')[1]
  const pastFolderName = rootFolderFiles[index === 0 ? 0: pastIndex].webkitRelativePath.split('/')[1]
  if (folderName !== pastFolderName ){
  return ({folderName});
 } 
 return null
})
setRootFolderNumberFolders(foldersFiltered.length)
setIsLoading(false);
console.log("folders filtered",  foldersFiltered)

/* se crean archivos de imagenes con nombre de cada carpeta */
fs.mkdir('/home', function() {
	fs.writeFile('/home/hello-world.txt', 'Hello world!\n', function() {
		fs.readFile('/home/hello-world.txt', 'utf-8', function(err, data) {
			console.log("ok: ", data);
		});
	});
});

 return foldersFiltered

}


  return (
    <div className="App">
      <header className="App-header">
        <p>
          Extraer metadata de carpetas
       
      </p>
      <p style={{fontSize:15}}>
Seleccione la carpeta raiz donde se contienen las carpetas con los archivos fotograficos
          </p>
    {rootFolder?  (  <p>
         Carpeta raiz: {rootFolder}
         <br></br>
         Numero de carpetas: {rootFolderFoldersNumber}
         <br></br>
         Numero de archivos en carpeta raiz: {rootFolderFilesNumber}
        </p>):null}


 {isLoading?(<div className={classes.root}>
      <LinearProgress />
    </div>): null}
<div>
        <input ref={refInput}
        multiple
         onChange={(e)=>{ selectedFolder(e.target.files) }}
          type='file' />
          </div>

{/*          
          <ol type="A">
  <li>Julio</li>
  <li>Carmen</li>
  <li>Ignacio</li>
  <li>Elena</li>
</ol> */}
      </header>
    </div>
  );
}

export default App;
