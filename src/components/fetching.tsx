import React, { ReactNode, useEffect } from "react";

export function FetchData({
  children,
  owner,
}: {
  children: ReactNode;
  owner: String;
}) {
  let ws: WebSocket;
  const origin = window.location.origin;
  console.log(origin);
  useEffect(() => {
    let ts: NodeJS.Timeout;
    ws = new WebSocket(`wss://seepbackend.onrender.com/?senderId=${origin}`);
    const sendMessage = () => {
        if (ws.readyState === WebSocket.OPEN && origin != "default") {
          console.log("initial  sent");
          ws.send(
            JSON.stringify({
              owner: owner,
              url: origin,
              type: "1",
            })
          );
        }
      };
  
      ws.onopen = () => {
        console.log("connected");
        ts=setTimeout(sendMessage, 1000);
      };
    ws.onmessage = async (response) => {
      const data = JSON.parse(response.data);
      console.log(data);
    };
    ws.onerror = (error: any) => {
      console.log(error);
    };
    ws.onclose = () => {
      console.log("disconnected");
    };
    return () => {
      ws.close();
      clearTimeout(ts);
    };
  }, [origin]);

  return <>{children}</>;
}
