import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Success from './pages/Success/Success'

function App() {
 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={}/>
        <Route path="/success" element={<Success/>}/>
        <Route path="/" element={}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
