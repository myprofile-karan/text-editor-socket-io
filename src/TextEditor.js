import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const Toolbar_Options = [
  [{ header: [1, 2, 3, 4, 5, 6] }],
  [{ font: [] }],
  [{ list: "orderes" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blackquote", "code-block"],
  ["clean"],
];

const TextEditor = () => {
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const {id} = useParams();

  useEffect(() => {
    const s = io("http://localhost:3001/", {
      transports: ["websocket", "polling", "flashsocket"],
    });
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(()=>{
    if(socket == null || quill == null) return

    socket.once('load-document', document => {
        quill.setContents(document)
        quill.enable()
    })

    socket.emit('get-document', id)

  }, [socket, quill, id]);

  useEffect(() => {
    if(socket == null || quill == null)return

    const handleFunc= (delta, oldDelta, source)=> {
        if (source !== 'user') return
        socket.emit("send-changes", delta);     //emit changes
        console.log( delta, oldDelta, source); 
      }

    quill.on('text-change', handleFunc )
      
      return ()=> {
        quill.off('text-change', handleFunc);
      }
    }, [socket, quill])

    useEffect(() => {
        if(socket == null || quill == null)return
    
        const handleFunc= (delta)=> {
          quill.updateContents(delta)
        }
    
        socket.on('recieve-changes', handleFunc )
          
          return ()=> {
            quill.off('text-change', handleFunc);
          }
        }, [socket, quill])

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: Toolbar_Options },
    });
    q.disable()
    q.setText("...loading")
    setQuill(q);
  }, []);

  return <div className="container" ref={wrapperRef}></div>;
};

export default TextEditor;
