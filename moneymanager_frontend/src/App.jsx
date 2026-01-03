import Home from "./pages/Home";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import Category from "./pages/Category"
import Filter from "./pages/Filter"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App = () => {
  return(
    <>
    <Toaster/>
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element = {<Home/>}></Route>
        <Route path="/income" element = {<Income/>}></Route>
        <Route path="/expense" element = {<Expense/>}></Route>
        <Route path="/category" element = {<Category/>}></Route>
        <Route path="/filter" element = {<Filter/>}></Route>
        <Route path="/login" element = {<Login/>}></Route>
        <Route path="/signup" element = {<Signup/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App;