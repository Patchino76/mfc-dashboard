import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const HtmlPlot = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const { data: html } = useQuery({
    queryKey: ["html"],
    queryFn: async () =>
      //   axios.get("http://localhost:8000/scatter").then((res) => res.data),
      axios.get("/images/chart.html").then((res) => res.data),
    staleTime: 5000,
    retry: 3,
    refetchInterval: 5000,
  });

  React.useEffect(() => {
    if (html && containerRef.current) {
      containerRef.current.innerHTML = html;
      const scripts = containerRef.current.getElementsByTagName("script");
      for (let script of scripts) {
        const newScript = document.createElement("script");
        newScript.innerHTML = script.innerHTML;
        // newScript.src = "/mpld3.v0.5.11-dev.js";
        document.body.appendChild(newScript);
      }
    }
    // console.log(html);
  }, [html, containerRef]);
  return <div ref={containerRef}></div>;
};

export default HtmlPlot;
