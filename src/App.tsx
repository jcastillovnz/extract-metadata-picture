import React, {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
  const refInput = useRef();
  useEffect(() => {
    refInput.current.webkitdirectory = true;
    refInput.current.directory = true;
    refInput.current.multiple = true;
    },[])

const [rootFolder, setRootFolder] = useState('');
const [rootFolderFoldersNumber, setRootFolderNumberFolders] = useState('');
const [rootFolderFilesNumber, setRootFolderFilesNumber] = useState(0);

const selectedFolder =(rootFolderFiles)=>{
  const rootFolder = rootFolderFiles[0].webkitRelativePath.split('/')[0];
  setRootFolder(rootFolder);
  setRootFolderFilesNumber(rootFolderFiles.length)
  console.log("root folder: ", rootFolder)
/*   console.log("rootFolderFiles: ",
  rootFolderFiles[0].webkitRelativePath, "n files: ", rootFolderFiles.length ) */

/* mapeando carpetas */
const foldersFiltered = [...rootFolderFiles].filter((file, index)=>{
  const pastIndex = index -1
  const folderName = file.webkitRelativePath.split('/')[1]
  const pastFolderName = rootFolderFiles[index === 0 ? 0: pastIndex].webkitRelativePath.split('/')[1]
 if (folderName !== pastFolderName ){
   console.log("folder", file)
  return {folderDir: file.webkitRelativePath, folderName, files:file.files }
 }
 return null
})

console.log("folders filtered",  foldersFiltered.length)
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
        <input ref={refInput}
        multiple
         onChange={(e)=> selectedFolder(e.target.files) }
          type='file' />
      </header>
    </div>
  );
}

export default App;
