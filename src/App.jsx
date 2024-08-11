  import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home";
import Room from "./pages/Room";

const App = () => {

  return(
    <div>
    
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/room" element={<Room />}></Route>
    </Routes>
    </div>
  )
}

export default App;