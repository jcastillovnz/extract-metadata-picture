import React, {useState, useEffect, useRef} from 'react';

import * as ExifReader from 'exifreader';
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
    if (!supportsFileReader()) {
      alert('Sorry, your web browser does not support the FileReader API.');
      return;
    }
    },[])


let listFiles =  [];
const [rootFolder, setRootFolder] = useState('');
const [rootFolderFoldersNumber, setRootFolderNumberFolders] = useState(0);
const [rootFolderFilesNumber, setRootFolderFilesNumber] = useState(0);
const [isLoading, setIsLoading] = useState(false);
const [foldersFiles, setFoldersFile] = useState(null);
const [metadataFiles, setMetadataFiles] = useState([]);

useEffect(()=> {
console.log("listFiles useEffect: ", metadataFiles.length -1,
 "rootFolderFilesNumber: ",rootFolderFoldersNumber)

if ( metadataFiles.length -1 ===  rootFolderFoldersNumber) {

  console.log("completed :", metadataFiles)
}


  }, [listFiles, metadataFiles, metadataFiles.length, rootFolderFoldersNumber])



const selectedFolder = async(rootFolderFiles)=>{
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
///console.log("folders filtered",  foldersFiltered)
setFoldersFile(foldersFiltered)
/* se crean archivos de imagenes con nombre de cada carpeta */

 return foldersFiltered
}
function supportsFileReader() {
  return window.FileReader !== undefined;
}


const getDataFile =(file)=>{
  const rootFolder = file.webkitRelativePath.split('/')[0];
/* mapeando carpetas */
  const folderName = file.webkitRelativePath.split('/')[1]
const data = {
  rootFolder, 
  folderName,
  name: file.name}
 return data;

}


const extractMetadataFile = (file, index)=>{
  const reader = new FileReader();
  reader.onload = function (readerEvent:{target: {result:any}}) {
    try {
        var tags = ExifReader.load(readerEvent.target.result);
        delete tags['MakerNote'];
        delete tags['WhiteBalance'];
       
  const folderImageData = {
  fileName: getDataFile(file).name,
  rootFolder: getDataFile(file).rootFolder,
  folderName: getDataFile(file).folderName,
  dateTime: tags.DateTime?.description,
  latitude:tags.GPSLatitude?.description,
  longitude:tags.GPSLongitude?.description
  }
  //console.log("folderImageData: ",folderImageData)
  //console.log("metadata file: ", listFiles)
  listFiles.push(folderImageData)
  setMetadataFiles( [...listFiles, folderImageData])
return folderImageData;


  } catch (error) {
      console.log("error: ", error, "file: ", file);
      //alert("Hubo error, intente mas tarde")
        // Handle error.
    }
  };
 reader.readAsArrayBuffer(file)

return listFiles;
}


const saveFilesImages = async()=> {

 foldersFiles.forEach(async(file, index)=>extractMetadataFile(file, index))

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

    {foldersFiles? ( <div>
      <p  style={{fontSize:15, color:'green'}}>Se guardara un archivo de imagen por cada una de las {' '}
         {rootFolderFoldersNumber} carpetas</p>
<button onClick={()=>saveFilesImages()} >Guardar archivos</button>
</div>) : null

         }<div>
        <input ref={refInput}
        multiple
         onChange={(e)=>{ 
          selectedFolder(e.target.files) }}
          type={foldersFiles?'hidden':'file'} />
          </div>
      </header>
    </div>
  );
}

export default App;
