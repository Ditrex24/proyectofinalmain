import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./components/login/login";
import Home from "./views/Home/Home";
import  CreateProperty  from './components/createProperty/createProperty'
import SignUpForm from "./components/Singup/singUp"


function App() {
	return (
		<>
			<Routes>
				<Route path="/login" element={<Login />} />

				<Route path="/create" element={<CreateProperty />} />

				<Route path="/signUp" element={<SignUpForm />} />

				<Route path="/" element={<Home />} />
        
			</Routes>
		</>
	);
}

export default App;
