import React, {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
  const refInput = useRef();
  useEffect(() => {
    refInput.current.webkitdirectory = true;
    refInput.current.directory = true;
    refInput.current.multiple = true;
    console.log("refInput.current.directory", refInput.current.directory)
    console.log("refInput.current.webkitDirectory", refInput.current.webkitDirectory)
    },[])

const [rootFolder, setRootFolder] = useState('');




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
        </p>):null}

        <input ref={refInput} onChange={(e)=> console.log("log: ", e.target.files) } type='file' />
      </header>
    </div>
  );
}

export default App;
