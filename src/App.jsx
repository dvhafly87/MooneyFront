import './App.css'
import MNU from './img/Menu_Icon.png'
import HMK from './img/HomeIcon.png'
function App() {

	return (
		<>
			<div className="Main-Container">
				<div className="Side-Container">
					<div className="Side-1-Container">
						<p className="Proj-Title">Mooney</p>
						<img className="MenuIcon" src={MNU} alt="menu_icon"/>
					</div>
					<div className="Side-2-Container">
						<div className="Dashboard-Container">
							<img src={HMK} alt="HomeIcon"/>
							<span>Dashboard</span>
						</div>
					</div>
				</div>
				<div className="Content-Container">
					
				</div>
			</div>
		</>
	)
}

export default App
