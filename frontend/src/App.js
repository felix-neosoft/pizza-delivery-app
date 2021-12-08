import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import Profile from './components/Profile'

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path='/' exact element ={<Login/>} />
          <Route path='/register' exact element={<Register/>} />
          <Route path='/dashboard' exact element={<Dashboard/>} />
          <Route path='/cart' exact element={<Cart/>} />
          <Route path='/checkout' exact element={<Checkout/>} />
          <Route path='/profile' exact element={<Profile/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
